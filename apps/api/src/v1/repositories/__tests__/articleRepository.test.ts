// apps/api/src/v1/repositories/__tests__/articleRepository.test.ts

import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// ── ESM mock registration — must be before any import of the repository ─────

const mockFindMany = jest.fn<any>();
const mockCount = jest.fn<any>();

await jest.unstable_mockModule('@repo/db', () => ({
  prisma: {
    article: {
      findMany: mockFindMany,
      count: mockCount,
    },
  },
}));

// Import AFTER mock is registered (ESM requirement)
const { default: ArticleRepository } = await import('../articleRepository.js');

describe('ArticleRepository.findPublished', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should query published, non-deleted articles with the expected pagination and ordering', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await ArticleRepository.findPublished(2, 10);

    expect(mockFindMany).toHaveBeenCalledTimes(1);
    const [findManyArgs] = mockFindMany.mock.calls[0] as [any];

    expect(findManyArgs.where).toEqual({ status: 'Published', deletedAt: null });
    expect(findManyArgs.orderBy).toEqual({ createdAt: 'desc' });
    expect(findManyArgs.skip).toBe(10);
    expect(findManyArgs.take).toBe(10);
  });

  it('should request a filtered comment count that excludes soft-deleted comments, and an unfiltered like count', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await ArticleRepository.findPublished(1, 20);

    const [findManyArgs] = mockFindMany.mock.calls[0] as [any];

    expect(findManyArgs.include).toEqual({
      _count: {
        select: {
          likes: true,
          comments: { where: { deletedAt: null } },
        },
      },
    });
  });

  it('should call prisma.article.count with the same where clause used for findMany', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await ArticleRepository.findPublished(1, 20);

    expect(mockCount).toHaveBeenCalledTimes(1);
    const [countArgs] = mockCount.mock.calls[0] as [any];
    expect(countArgs.where).toEqual({ status: 'Published', deletedAt: null });
  });

  it('should return the articles and total as resolved by prisma', async () => {
    const mockArticles = [
      { id: 'article-1', title: 'Title 1', _count: { likes: 3, comments: 1 } },
    ];
    mockFindMany.mockResolvedValue(mockArticles);
    mockCount.mockResolvedValue(1);

    const result = await ArticleRepository.findPublished(1, 20);

    expect(result).toEqual({ articles: mockArticles, total: 1 });
  });
});

describe('ArticleRepository.findByAuthor', () => {
  const authorId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should query non-deleted articles for the given author regardless of status, with the expected pagination and ordering', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await ArticleRepository.findByAuthor(authorId, 2, 10);

    expect(mockFindMany).toHaveBeenCalledTimes(1);
    const [findManyArgs] = mockFindMany.mock.calls[0] as [any];

    expect(findManyArgs.where).toEqual({ authorId, deletedAt: null });
    expect(findManyArgs.orderBy).toEqual({ createdAt: 'desc' });
    expect(findManyArgs.skip).toBe(10);
    expect(findManyArgs.take).toBe(10);
  });

  it('should request a filtered comment count that excludes soft-deleted comments, and an unfiltered like count', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await ArticleRepository.findByAuthor(authorId, 1, 20);

    const [findManyArgs] = mockFindMany.mock.calls[0] as [any];

    expect(findManyArgs.include).toEqual({
      _count: {
        select: {
          likes: true,
          comments: { where: { deletedAt: null } },
        },
      },
    });
  });

  it('should call prisma.article.count with the same where clause used for findMany', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await ArticleRepository.findByAuthor(authorId, 1, 20);

    expect(mockCount).toHaveBeenCalledTimes(1);
    const [countArgs] = mockCount.mock.calls[0] as [any];
    expect(countArgs.where).toEqual({ authorId, deletedAt: null });
  });

  it('should return the articles and total as resolved by prisma', async () => {
    const mockArticles = [
      { id: 'article-1', title: 'Title 1', authorId, status: 'Draft', _count: { likes: 3, comments: 1 } },
    ];
    mockFindMany.mockResolvedValue(mockArticles);
    mockCount.mockResolvedValue(1);

    const result = await ArticleRepository.findByAuthor(authorId, 1, 20);

    expect(result).toEqual({ articles: mockArticles, total: 1 });
  });
});
