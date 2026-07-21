import { jest } from '@jest/globals';
import type { ArticleRepository } from '../../repositories/articleRepository.js';

jest.unstable_mockModule('../../repositories/articleRepository.js', () => ({
  ArticleRepository: jest.fn(),
}));

const { ReviewerService } = await import('../reviewerService.js');

const makeMockRepo = (): jest.Mocked<Pick<ArticleRepository, 'findByStatus'>> => ({
  findByStatus: jest.fn(),
});

describe('ReviewerService.listPending', () => {
  let mockRepo: ReturnType<typeof makeMockRepo>;
  let service: InstanceType<typeof ReviewerService>;

  beforeEach(() => {
    mockRepo = makeMockRepo();
    service = new ReviewerService(mockRepo as unknown as ArticleRepository);
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

    mockRepo.findByStatus.mockResolvedValue({ articles: mockArticles, total: 1 } as never);

    const result = await service.listPending(2, 10);

    expect(mockRepo.findByStatus).toHaveBeenCalledWith('Pending', 2, 10);
    expect(mockRepo.findByStatus).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      articles: mockArticles,
      total: 1,
      page: 2,
      limit: 10,
    });
    expect(result.articles[0]).not.toHaveProperty('_count');
  });

  it('should default page and limit when not provided', async () => {
    mockRepo.findByStatus.mockResolvedValue({ articles: [], total: 0 } as never);

    const result = await service.listPending();

    expect(mockRepo.findByStatus).toHaveBeenCalledWith('Pending', 1, 20);
    expect(result).toEqual({ articles: [], total: 0, page: 1, limit: 20 });
  });
});
