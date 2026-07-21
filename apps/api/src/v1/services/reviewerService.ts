import { ArticleRepository } from '../repositories/articleRepository.js';
import type { Article } from '../types/article.types.js';
import { ArticleStatusValue } from '../types/article.types.js';

export class ReviewerService {
  constructor(private articleRepository: ArticleRepository = new ArticleRepository()) {}

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
}

export default new ReviewerService();
