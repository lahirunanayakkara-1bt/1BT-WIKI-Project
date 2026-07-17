import ArticleRepository from '../repositories/articleRepository.js';
import CommentRepository from '../repositories/commentRepository.js';
import NotificationService from './notificationService.js';
import { AppError } from '../../errors/AppError.js';
import type { Comment } from '../types/comment.types.js';

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

export default { addComment };
