import { ArticleRepository } from '@repositories/articleRepository.js';
import { ArticleReviewRepository } from '@repositories/articleReviewRepository.js';
import UserRepository from '@repositories/userRepository.js';
import { AppError } from '@errors/AppError.js';
import type { Article } from '@models/article.types.js';
import { ArticleStatusValue } from '@models/article.types.js';
import { ReviewStatus } from '@repo/db/generated/prisma/index.js';

export class ReviewerService {
  constructor(
    private articleRepository: ArticleRepository = new ArticleRepository(),
    private reviewRepository: ArticleReviewRepository = new ArticleReviewRepository(),
    private userRepository: typeof UserRepository = UserRepository,
  ) {}

  async listPending(
    page: number = 1,
    limit: number = 20
  ): Promise<{ articles: (Article & { authorName: string; authorEmail: string | null })[]; total: number; page: number; limit: number }> {
    const { articles, total } = await this.articleRepository.findByStatus(
      ArticleStatusValue.Pending,
      page,
      limit
    );

    // TODO: batch via a findManyByIds if UserRepository adds one, to avoid N+1 queries on larger pending lists
    const enrichedArticles = await Promise.all(
      articles.map(async (article) => {
        const author = await this.userRepository.findById(article.authorId);
        return {
          ...article,
          authorName: author?.name ?? 'Unknown',
          authorEmail: author?.email ?? null,
        };
      })
    );

    return { articles: enrichedArticles, total, page, limit };
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

  async rejectArticle(
    articleId: string,
    reviewerId: string,
    feedback: string
  ): Promise<Article> {
    if (!feedback || feedback.trim().length < 10) {
      throw new AppError('Rejection feedback must be at least 10 characters', 400);
    }

    const article = await this.articleRepository.findById(articleId);
    if (!article) throw new AppError('Article not found', 404);
    if (article.status !== 'Pending') {
      throw new AppError('Only Pending articles can be rejected', 400);
    }

    const rejected = await this.articleRepository.updateStatus(articleId, ArticleStatusValue.Unpublished);

    await this.reviewRepository.create({
      articleId,
      reviewerId,
      status: ReviewStatus.Rejected,
      feedback: feedback.trim(),
      createdBy: reviewerId,
    });

    // TODO: notify author on rejection — pending notification-engineer infra migration

    return rejected;
  }

  async getArticleForReview(articleId: string): Promise<Article & { authorName: string; authorEmail: string | null }> {
    const article = await this.articleRepository.findById(articleId);
    if (!article) throw new AppError('Article not found', 404);
    if (article.status !== 'Pending') {
      throw new AppError('Only Pending articles can be reviewed', 400);
    }

    const author = await this.userRepository.findById(article.authorId);

    return {
      ...article,
      authorName: author?.name ?? 'Unknown',
      authorEmail: author?.email ?? null,
    };
  }
}

export default new ReviewerService();

