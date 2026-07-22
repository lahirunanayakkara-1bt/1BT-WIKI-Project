import { ArticleRepository } from '@repositories/articleRepository.js';
import { ArticleReviewRepository } from '@repositories/articleReviewRepository.js';
import { AppError } from '@errors/AppError.js';
import type { Article } from '@models/article.types.js';
import { ArticleStatusValue } from '@models/article.types.js';
import { ReviewStatus } from '@repo/db/generated/prisma/index.js';

export class ReviewerService {
  constructor(
    private articleRepository: ArticleRepository = new ArticleRepository(),
    private reviewRepository: ArticleReviewRepository = new ArticleReviewRepository(),
  ) {}

  async listPending(
    page: number = 1,
    limit: number = 20
  ): Promise<{ articles: Article[]; total: number; page: number; limit: number }> {
    const { articles, total } = await this.articleRepository.findByStatus(
      ArticleStatusValue.Pending,
      page,
      limit
    );
    return { articles, total, page, limit };
  }

  async approveArticle(articleId: string, reviewerId: string): Promise<Article> {
    const article = await this.articleRepository.findById(articleId);
    if (!article) throw new AppError('Article not found', 404);
    if (article.status !== ArticleStatusValue.Pending) {
      throw new AppError('Only Pending articles can be approved', 400);
    }

    const approved = await this.articleRepository.updateStatus(articleId, ArticleStatusValue.Published);

    await this.reviewRepository.create({
      articleId,
      reviewerId,
      status: ReviewStatus.Approved,
      feedback: null,
      createdBy: reviewerId,
    });

    // TODO: notify author on approval — pending notification-engineer infra migration

    return approved;
  }
}

export default new ReviewerService();
