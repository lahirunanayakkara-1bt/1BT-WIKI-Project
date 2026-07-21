import { prisma } from '@repo/db';
import type { ArticleReview } from '@models/article.types.js';

const ARTICLE_REVIEW_SELECT = {
  id: true,
  articleId: true,
  reviewerId: true,
  status: true,
  feedback: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class ArticleReviewRepository {
  async findLatestByArticleId(articleId: string): Promise<ArticleReview | null> {
  const result = await prisma.articleReview.findFirst({
    where: { articleId },
    orderBy: { createdAt: 'desc' },
    select: ARTICLE_REVIEW_SELECT,
  });

  if (!result) {
    return null;
  }

  return {
    id: result.id,
    articleId: result.articleId,
    reviewerId: result.reviewerId,
    reviewStatus: result.status,
    comments: result.feedback ?? undefined,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };
  }
}

export default new ArticleReviewRepository();
