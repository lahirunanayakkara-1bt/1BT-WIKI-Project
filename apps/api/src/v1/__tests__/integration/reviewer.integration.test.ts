// apps/api/src/v1/__tests__/integration/reviewer.integration.test.ts

import { jest, describe, it, expect, beforeAll, beforeEach } from '@jest/globals';

await jest.unstable_mockModule('@repo/db', () => ({
  prisma: {
    user: { findFirst: jest.fn(), findMany: jest.fn(), update: jest.fn(), create: jest.fn() },
    article: { findFirst: jest.fn(), findMany: jest.fn(), update: jest.fn(), create: jest.fn(), count: jest.fn() },
  },
}));

await jest.unstable_mockModule('../../../middleware/auth.middleware.js', () => ({
  authenticate: jest.fn(
    async (
      req: import('express').Request,
      res: import('express').Response,
      next: import('express').NextFunction
    ) => {
      const userId = req.headers['x-test-user-id'] as string | undefined;
      const email  = req.headers['x-test-user-email'] as string | undefined;
      const role   = req.headers['x-test-user-role'] as string | undefined;

      if (userId && email && role) {
        req.user = { userId, email, role };
        next();
        return;
      }

      res.status(401).json({ success: false, error: 'Authentication required' });
    }
  ),
}));

const MockArticleRepository = {
  findByStatus: jest.fn<() => Promise<unknown>>().mockResolvedValue({ articles: [], total: 0 }),
};

await jest.unstable_mockModule('../../repositories/articleRepository.js', () => ({
  ArticleRepository: jest.fn().mockImplementation(() => MockArticleRepository),
}));

const { default: app, appReady } = await import('../../../app.js');
const { default: request } = await import('supertest');

const mockFindByStatus = MockArticleRepository.findByStatus as jest.Mock<any>;

const reviewerHeaders = {
  'x-test-user-id':    'reviewer-1',
  'x-test-user-email': 'reviewer@example.com',
  'x-test-user-role':  'Reviewer',
};

const userHeaders = {
  'x-test-user-id':    'user-123',
  'x-test-user-email': 'user@example.com',
  'x-test-user-role':  'User',
};

describe('Reviewer API Integration', () => {
  beforeAll(async () => {
    await appReady;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockFindByStatus.mockResolvedValue({ articles: [], total: 0 });
  });

  describe('GET /api/v1/reviewer/articles/pending', () => {
    it('should return 401 if unauthenticated', async () => {
      const response = await request(app).get('/api/v1/reviewer/articles/pending');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return 403 for a non-Reviewer role', async () => {
      const response = await request(app)
        .get('/api/v1/reviewer/articles/pending')
        .set(userHeaders);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Insufficient permissions');
      expect(mockFindByStatus).not.toHaveBeenCalled();
    });

    it('should return 200 with pending articles for a Reviewer', async () => {
      const mockArticles = [
        {
          id: 'article-1',
          title: 'Pending Article',
          body: { type: 'doc' },
          status: 'Pending',
          authorId: 'user-1',
          tags: ['review'],
          createdAt: new Date('2023-01-01').toISOString(),
          updatedAt: new Date('2023-01-01').toISOString(),
        },
      ];

      mockFindByStatus.mockResolvedValueOnce({ articles: mockArticles, total: 1 });

      const response = await request(app)
        .get('/api/v1/reviewer/articles/pending')
        .set(reviewerHeaders);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Pending articles retrieved successfully');
      expect(response.body.data.articles).toHaveLength(1);
      expect(response.body.data.articles[0].status).toBe('Pending');
      expect(response.body.data.total).toBe(1);
      expect(response.body.data.page).toBe(1);
      expect(response.body.data.limit).toBe(20);
      expect(mockFindByStatus).toHaveBeenCalledWith('Pending', 1, 20);
    });
  });
});
