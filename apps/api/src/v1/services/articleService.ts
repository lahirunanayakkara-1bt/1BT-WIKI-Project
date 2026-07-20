import crypto from 'node:crypto';
import { ArticleStatus } from '@repo/db/generated/prisma/index.js';
import type { article } from '@repo/db/generated/prisma/index.js';
import ArticleRepository from '../repositories/articleRepository.js';
import ArticleAttachmentRepository from '../repositories/articleAttachmentRepository.js';
import ArticleReviewRepository from '../repositories/articleReviewRepository.js';
import b2Client from '../lib/b2Client.js';
import { AppError } from '../../errors/AppError.js';
import type { Article, CreateArticleInput, UpdateArticleInput, ArticleAttachment, JSONContent, ArticleListItem } from '../types/article.types.js';

type ArticleUpdateFields = Partial<Pick<article, 'title' | 'tags' | 'status'>> & { body?: JSONContent };

const validateImages = (images: Express.Multer.File[]) => {
  if (images.length > 10) {
    throw new AppError('Maximum 10 images per article', 400);
  }

  for (const img of images) {
    if (img.size > 5 * 1024 * 1024) {
      throw new AppError('Image size cannot exceed 5MB', 400);
    }
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(img.mimetype)) {
      throw new AppError('Only jpeg, png, webp, and gif images are allowed', 400);
    }
  }
};

const uploadArticleImages = async (
  articleId: string,
  authorId: string,
  images: Express.Multer.File[]
) => {
  const attachments: ArticleAttachment[] = [];
  const warnings: string[] = [];
  const b2BucketName = process.env.B2_BUCKET_NAME ?? '';

  for (const img of images) {
    const fileUuid = crypto.randomUUID();
    const sanitizedName = img.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
    const b2FileKey = `articles/${articleId}/${fileUuid}-${sanitizedName}`;

    try {
      const { fileId, fileUrl } = await b2Client.uploadFile(b2FileKey, img.buffer, img.mimetype);

      const attachment = await ArticleAttachmentRepository.create({
        articleId,
        uploadedBy: authorId,
        fileName: img.originalname,
        b2FileKey,
        b2FileId: fileId,
        b2BucketName,
        fileUrl,
        mimeType: img.mimetype,
        sizeBytes: img.size,
      });

      attachments.push(attachment);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      warnings.push(`Failed to upload ${img.originalname}: ${message}`);
    }
  }

  return { attachments, warnings };
};

const validateTitle = (title: string | undefined): string => {
  if (!title || title.trim() === '') {
    throw new AppError('Title is required and cannot be empty', 400);
  }
  
  if (title.length > 500) {
    throw new AppError('Title cannot exceed 500 characters', 400);
  }

  return title.trim();
};

const validateBody = (body: JSONContent | undefined): JSONContent => {
  const safeBody = body ?? {};
  if (typeof safeBody === 'string') {
    throw new AppError('Body must be valid JSONContent, raw HTML is not allowed', 400);
  }

  if (typeof safeBody !== 'object' || safeBody === null || Array.isArray(safeBody)) {
    throw new AppError('Body must be a valid JSON object', 400);
  }

  if (Object.keys(safeBody).length > 0 && typeof safeBody.type !== 'string') {
    throw new AppError('Body must have a "type" field', 400);
  }
  
  return safeBody;
};

const createArticle = async (
  input: CreateArticleInput,
  authorId: string,
  images: Express.Multer.File[] = []
): Promise<Article> => {
  // Validate images
  validateImages(images);

  // Validate title
  const title = validateTitle(input.title);

  // Validate body
  const body = validateBody(input.body);

  // Create article via repository
  const article = await ArticleRepository.create({
    title,
    body,
    tags: input.tags ?? [],
    authorId
  });

  // Upload valid images to B2 and track in DB
  const { attachments, warnings } = await uploadArticleImages(article.id, authorId, images);

  return {
    ...article,
    attachments,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
};

const updateArticle = async (
  id: string,
  input: UpdateArticleInput,
  userId: string,
  images: Express.Multer.File[] = []
): Promise<Article> => {
  // Validate images if provided
  if (images.length > 0) {
    validateImages(images);
  }

  const article = await findOwned(id, userId);

  let isEditable = false;
  let resetToDraft = false;

  if (article.status === 'Draft') {
    isEditable = true;
  } else {
    const latestReview = await ArticleReviewRepository.findLatestByArticleId(id);
    if (latestReview && latestReview.reviewStatus === 'Rejected') {
      isEditable = true;
      resetToDraft = true;
    }
  }

  if (!isEditable) {
    throw new AppError('Only Draft or Rejected articles can be edited', 400);
  }

  const hasUpdates = input.title !== undefined || input.body !== undefined || input.tags !== undefined;
  let updatedArticle = article;
  
  if (hasUpdates || resetToDraft) {
    const updateFields: ArticleUpdateFields = {};

    if (input.title !== undefined) updateFields.title = validateTitle(input.title);
    if (input.body !== undefined) updateFields.body = validateBody(input.body);
    if (input.tags !== undefined) updateFields.tags = input.tags;
    if (resetToDraft) updateFields.status = ArticleStatus.Draft;

    updatedArticle = await ArticleRepository.update(id, updateFields);
  }

  // Only consider it a total no-op if there are no data updates AND no new images
  if (!hasUpdates && !resetToDraft && images.length === 0) {
    return article;
  }

  // Upload any new images
  const { attachments, warnings } = await uploadArticleImages(updatedArticle.id, userId, images);

  return {
    ...updatedArticle,
    attachments: attachments.length > 0 ? attachments : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
};

const findOwned = async (articleId: string, userId: string): Promise<Article> => {
  const article = await ArticleRepository.findById(articleId);
  
  if (!article) {
    throw new AppError('Article not found', 404);
  }

  if (article.authorId !== userId) {
    throw new AppError('Only the author can edit this article', 403);
  }

  return article;
};

const assertTransition = (currentStatus: string, targetStatus: string): void => {
  if (currentStatus === 'Draft' && targetStatus === 'Pending') {
    return;
  }
  
  throw new AppError(`Cannot transition from ${currentStatus} to ${targetStatus}`, 400);
};

const submitForReview = async (articleId: string, userId: string): Promise<Article> => {
  const article = await findOwned(articleId, userId);
  
  assertTransition(article.status, 'Pending');
  
  return ArticleRepository.updateStatus(articleId, ArticleStatus.Pending);
};

const listPublished = async (
  page: number = 1,
  limit: number = 20
): Promise<{ articles: ArticleListItem[]; total: number; page: number; limit: number }> => {
  const { articles, total } = await ArticleRepository.findPublished(page, limit);
  
  const mappedArticles: ArticleListItem[] = articles.map((article: any) => ({
    id: article.id,
    title: article.title,
    authorId: article.authorId,
    tags: article.tags,
    status: article.status,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    likeCount: article._count?.likes ?? 0,
    commentCount: article._count?.comments ?? 0,
  }));

  return { articles: mappedArticles, total, page, limit };
};

export default { createArticle, updateArticle, submitForReview, listPublished };

