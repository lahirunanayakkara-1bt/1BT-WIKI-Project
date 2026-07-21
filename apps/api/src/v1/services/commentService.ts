import ArticleRepository from '@repositories/articleRepository.js';
import CommentRepository from '@repositories/commentRepository.js';
import NotificationService from './notificationService.js';
import { AppError } from '@errors/AppError.js';
import type { Comment, CommentWithAuthor } from '@models/comment.types.js';

const validateBody = (body: string | undefined): string => {
  if (!body || body.trim() === '') {
    throw new AppError('Comment body is required and cannot be empty', 400);
  }

  if (body.length > 5000) {
    throw new AppError('Comment cannot exceed 5000 characters', 400);
  }

  return body.trim();
};

const addComment = async (
  articleId: string,
  authorId: string,
  input: string | undefined
): Promise<Comment> => {
  const body = validateBody(input);

  const article = await ArticleRepository.findById(articleId);

  if (!article) {
    throw new AppError('Article not found', 404);
  }

  if (article.status !== 'Published') {
    throw new AppError('Cannot comment on this article', 403);
  }

  const comment = await CommentRepository.create({
    articleId,
    createdBy: authorId,
    body,
  });

  if (article.authorId !== authorId) {
    NotificationService.send({
      recipientId: article.authorId,
      notificationTitle: 'New comment on your article',
      notificationReferenceType: 'comment',
      referenceId: comment.id,
      notificationType: 'info',
      message: `Someone commented on your article "${article.title}"`,
    }).catch((error: unknown) => {
      console.error('Failed to send new_comment notification:', error);
    });
  }

  return comment;
};

const listComments = async (
  articleId: string,
  requesterId: string
): Promise<CommentWithAuthor[]> => {
  const article = await ArticleRepository.findById(articleId);

  if (!article) {
    throw new AppError('Article not found', 404);
  }

  if (article.status !== 'Published' && article.authorId !== requesterId) {
    throw new AppError('Cannot view comments on this article', 403);
  }

  return CommentRepository.findByArticleId(articleId);
};

const updateComment = async (
  commentId: string,
  userId: string,
  input: string | undefined
): Promise<Comment> => {
  const body = validateBody(input);

  const comment = await CommentRepository.findById(commentId);

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  if (comment.createdBy !== userId) {
    throw new AppError('Only the comment owner can edit this comment', 403);
  }

  return CommentRepository.update(commentId, body);
};

const deleteComment = async (commentId: string, userId: string): Promise<void> => {
  const comment = await CommentRepository.findById(commentId);

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  if (comment.createdBy !== userId) {
    throw new AppError('Only the comment owner can delete this comment', 403);
  }

  await CommentRepository.remove(commentId);
};

export default { addComment, listComments, updateComment, deleteComment };
