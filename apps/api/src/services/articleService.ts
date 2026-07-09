import crypto from 'node:crypto';
import ArticleRepository from '../repositories/articleRepository.js';
import ArticleAttachmentRepository from '../repositories/articleAttachmentRepository.js';
import b2Client from '../lib/b2Client.js';
import { AppError } from '../errors/AppError.js';
import type { Article, CreateArticleInput, ArticleAttachment } from '../types/article.types.js';

const createArticle = async (
  input: CreateArticleInput,
  authorId: string,
  images: Express.Multer.File[] = []
): Promise<Article> => {
  // Validate images count
  if (images.length > 10) {
    throw new AppError('Maximum 10 images per article', 400);
  }

  // Validate images size and type
  for (const img of images) {
    if (img.size > 5 * 1024 * 1024) {
      throw new AppError('Image size cannot exceed 5MB', 400);
    }
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(img.mimetype)) {
      throw new AppError('Only jpeg, png, webp, and gif images are allowed', 400);
    }
  }

  // Validate title
  if (!input.title || input.title.trim() === '') {
    throw new AppError('Title is required and cannot be empty', 400);
  }
  
  if (input.title.length > 500) {
    throw new AppError('Title cannot exceed 500 characters', 400);
  }

  const title = input.title.trim();

  // Validate body
  const body = input.body ?? {};
  if (typeof body === 'string') {
    throw new AppError('Body must be valid JSONContent, raw HTML is not allowed', 400);
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new AppError('Body must be a valid JSON object', 400);
  }

  if (Object.keys(body).length > 0 && typeof body.type !== 'string') {
    throw new AppError('Body must have a "type" field', 400);
  }

  // Create article via repository
  const article = await ArticleRepository.create({
    title,
    body,
    tags: input.tags ?? [],
    authorId
  });

  const attachments: ArticleAttachment[] = [];
  const warnings: string[] = [];

  // Upload valid images to B2 and track in DB
  const b2BucketName = process.env.B2_BUCKET_NAME ?? '';

  for (const img of images) {
    const fileUuid = crypto.randomUUID();
    // Sanitize filename: replace spaces and non-alphanumeric chars (except dots/dashes)
    const sanitizedName = img.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
    const b2FileKey = `articles/${article.id}/${fileUuid}-${sanitizedName}`;

    try {
      const { fileId, fileUrl } = await b2Client.uploadFile(b2FileKey, img.buffer, img.mimetype);

      const attachment = await ArticleAttachmentRepository.create({
        articleId: article.id,
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

  return {
    ...article,
    attachments,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
};

export default { createArticle };
