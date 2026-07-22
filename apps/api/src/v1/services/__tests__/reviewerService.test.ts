import { jest } from '@jest/globals';
import { AppError } from '@errors/AppError.js';
import type { ArticleRepository } from '@repositories/articleRepository.js';
import type { ArticleReviewRepository } from '@repositories/articleReviewRepository.js';
import { ReviewStatus } from '@repo/db/generated/prisma/index.js';

jest.unstable_mockModule('@repositories/articleRepository.js', () => ({
  ArticleRepository: jest.fn(),
}));

jest.unstable_mockModule('@repositories/articleReviewRepository.js', () => ({
  ArticleReviewRepository: jest.fn(),
}));

const { ReviewerService } = await import('../reviewerService.js');

const makeMockArticleRepo = (): jest.Mocked<
  Pick<ArticleRepository, 'findByStatus' | 'findById' | 'updateStatus'>
> => ({
  findByStatus: jest.fn(),
  findById: jest.fn(),
  updateStatus: jest.fn(),
});

const makeMockReviewRepo = (): jest.Mocked<Pick<ArticleReviewRepository, 'create'>> => ({
  create: jest.fn(),
});

describe('ReviewerService.listPending', () => {
  let mockArticleRepo: ReturnType<typeof makeMockArticleRepo>;
  let mockReviewRepo: ReturnType<typeof makeMockReviewRepo>;
  let service: InstanceType<typeof ReviewerService>;

  beforeEach(() => {
    mockArticleRepo = makeMockArticleRepo();
    mockReviewRepo = makeMockReviewRepo();
    service = new ReviewerService(
      mockArticleRepo as unknown as ArticleRepository,
      mockReviewRepo as unknown as ArticleReviewRepository
    );
    jest.clearAllMocks();
  });

  it('should call findByStatus with Pending status and no includeCounts', async () => {
    const mockArticles = [
      {
        id: 'article-1',
        title: 'Pending Article',
        body: { type: 'doc' },
        status: 'Pending',
        authorId: 'user-1',
        tags: [],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
    ];

    mockArticleRepo.findByStatus.mockResolvedValue({ articles: mockArticles, total: 1 } as never);

    const result = await service.listPending(2, 10);

    expect(mockArticleRepo.findByStatus).toHaveBeenCalledWith('Pending', 2, 10);
    expect(mockArticleRepo.findByStatus).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      articles: mockArticles,
      total: 1,
      page: 2,
      limit: 10,
    });
    expect(result.articles[0]).not.toHaveProperty('_count');
  });

  it('should default page and limit when not provided', async () => {
    mockArticleRepo.findByStatus.mockResolvedValue({ articles: [], total: 0 } as never);

    const result = await service.listPending();

    expect(mockArticleRepo.findByStatus).toHaveBeenCalledWith('Pending', 1, 20);
    expect(result).toEqual({ articles: [], total: 0, page: 1, limit: 20 });
  });
});

describe('ReviewerService.approveArticle', () => {
  const articleId = 'article-123';
  const reviewerId = 'reviewer-1';
  let mockArticleRepo: ReturnType<typeof makeMockArticleRepo>;
  let mockReviewRepo: ReturnType<typeof makeMockReviewRepo>;
  let service: InstanceType<typeof ReviewerService>;

  beforeEach(() => {
    mockArticleRepo = makeMockArticleRepo();
    mockReviewRepo = makeMockReviewRepo();
    service = new ReviewerService(
      mockArticleRepo as unknown as ArticleRepository,
      mockReviewRepo as unknown as ArticleReviewRepository
    );
    jest.clearAllMocks();
  });

  it('should approve a Pending article and create an Approved review record', async () => {
    const pendingArticle = {
      id: articleId,
      title: 'Pending Article',
      body: { type: 'doc' },
      status: 'Pending',
      authorId: 'user-1',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const publishedArticle = { ...pendingArticle, status: 'Published' };

    mockArticleRepo.findById.mockResolvedValue(pendingArticle as never);
    mockArticleRepo.updateStatus.mockResolvedValue(publishedArticle as never);
    mockReviewRepo.create.mockResolvedValue({
      id: 'review-1',
      articleId,
      reviewerId,
      reviewStatus: 'Approved',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const result = await service.approveArticle(articleId, reviewerId);

    expect(mockArticleRepo.findById).toHaveBeenCalledWith(articleId);
    expect(mockArticleRepo.updateStatus).toHaveBeenCalledWith(articleId, 'Published');
    expect(mockReviewRepo.create).toHaveBeenCalledWith({
      articleId,
      reviewerId,
      status: ReviewStatus.Approved,
      feedback: null,
      createdBy: reviewerId,
    });
    expect(result).toEqual(publishedArticle);
  });

  it.each(['Draft', 'Published', 'Rejected'] as const)(
    'should throw 400 when article status is %s',
    async (status) => {
      mockArticleRepo.findById.mockResolvedValue({
        id: articleId,
        status,
        authorId: 'user-1',
      } as never);

      await expect(service.approveArticle(articleId, reviewerId))
        .rejects.toThrow(new AppError('Only Pending articles can be approved', 400));

      expect(mockArticleRepo.updateStatus).not.toHaveBeenCalled();
      expect(mockReviewRepo.create).not.toHaveBeenCalled();
    }
  );

  it('should throw 404 when article does not exist', async () => {
    mockArticleRepo.findById.mockResolvedValue(null);

    await expect(service.approveArticle(articleId, reviewerId))
      .rejects.toThrow(new AppError('Article not found', 404));

    expect(mockArticleRepo.updateStatus).not.toHaveBeenCalled();
    expect(mockReviewRepo.create).not.toHaveBeenCalled();
  });
});
