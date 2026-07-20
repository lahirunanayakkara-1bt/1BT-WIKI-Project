import ArticleRepository from '../repositories/articleRepository.js';
import LikeRepository from '../repositories/likeRepository.js';
import NotificationService from './notificationService.js';
import { AppError } from '../../errors/AppError.js';

const likeArticle = async (articleId: string, userId: string): Promise<void> => {
  const article = await ArticleRepository.findById(articleId);

  if (!article) {
    throw new AppError('Article not found', 404);
  }

  if (article.status !== 'Published') {
    throw new AppError('Cannot like this article', 403);
  }

  const like = await LikeRepository.upsert(articleId, userId);

  if (article.authorId !== userId) {
    NotificationService.send({
      recipientId: article.authorId,
      notificationTitle: 'New like on your article',
      notificationReferenceType: 'like',
      referenceId: like.id,
      notificationType: 'info',
      message: `Someone liked your article "${article.title}"`,
    }).catch((error: unknown) => {
      console.error('Failed to send new_like notification:', error);
    });
  }
};

const unlikeArticle = async (articleId: string, userId: string): Promise<void> => {
  const article = await ArticleRepository.findById(articleId);

  if (!article) {
    throw new AppError('Article not found', 404);
  }

  await LikeRepository.remove(articleId, userId);
};

export default { likeArticle, unlikeArticle };
