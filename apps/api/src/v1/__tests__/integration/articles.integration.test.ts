// apps/api/src/__tests__/integration/articles.integration.test.ts

import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock Prisma DB from @repo/db
await jest.unstable_mockModule('@repo/db', () => ({
  prisma: {
    user: { findFirst: jest.fn(), findMany: jest.fn(), update: jest.fn(), create: jest.fn() },
    article: { findFirst: jest.fn(), findMany: jest.fn(), update: jest.fn(), create: jest.fn() },
  }
}));

// Mock Auth Middleware
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

// Mock Repositories
await jest.unstable_mockModule('../../repositories/articleRepository.js', () => ({
  default: {
    create: jest.fn<() => Promise<unknown>>().mockResolvedValue({}),
    findById: jest.fn<() => Promise<unknown>>().mockResolvedValue(null),
    update: jest.fn<() => Promise<unknown>>().mockResolvedValue({}),
    updateStatus: jest.fn<() => Promise<unknown>>().mockResolvedValue({}),
    findPublished: jest.fn<() => Promise<unknown>>().mockResolvedValue({}),
  },
}));

await jest.unstable_mockModule('../../repositories/articleAttachmentRepository.js', () => ({
  default: {
    create: jest.fn<() => Promise<unknown>>().mockResolvedValue({}),
  },
}));

await jest.unstable_mockModule('../../repositories/articleReviewRepository.js', () => ({
  default: {
    findLatestByArticleId: jest.fn<() => Promise<unknown>>().mockResolvedValue(null),
  },
}));

// Mock B2 Client
await jest.unstable_mockModule('../../lib/b2Client.js', () => ({
  default: {
    uploadFile: jest.fn<() => Promise<{ fileId: string; fileUrl: string }>>().mockResolvedValue({ fileId: 'test', fileUrl: 'test' }),
  },
}));

const { default: app } = await import('../../../app.js');
const { default: request } = await import('supertest');
const { default: ArticleRepository } = await import('../../repositories/articleRepository.js');
const { default: ArticleReviewRepository } = await import('../../repositories/articleReviewRepository.js');

const mockFindById = ArticleRepository.findById as jest.Mock<any>;
const mockUpdate = ArticleRepository.update as jest.Mock<any>;
const mockUpdateStatus = ArticleRepository.updateStatus as jest.Mock<any>;
const mockFindPublished = ArticleRepository.findPublished as jest.Mock<any>;
const mockFindLatestByArticleId = ArticleReviewRepository.findLatestByArticleId as jest.Mock<any>;

const userHeaders = {
  'x-test-user-id':    'user-123',
  'x-test-user-email': 'user@example.com',
  'x-test-user-role':  'User',
};

describe('Articles API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PATCH /api/v1/articles/:id', () => {
    const articleId = 'article-123';
    
    it('should return 401 if unauthenticated', async () => {
      const response = await request(app)
        .patch(`/api/v1/articles/${articleId}`)
        .send({ data: JSON.stringify({ title: 'New Title' }) });
        
      expect(response.status).toBe(401);
    });

    it('should return 404 if article not found', async () => {
      mockFindById.mockResolvedValueOnce(null);

      const response = await request(app)
        .patch(`/api/v1/articles/${articleId}`)
        .set(userHeaders)
        .field('data', JSON.stringify({ title: 'New Title' }));
        
      expect(response.status).toBe(404);
    });

    it('should return 403 if user is not author', async () => {
      mockFindById.mockResolvedValueOnce({ id: articleId, authorId: 'other-user', status: 'Draft' });

      const response = await request(app)
        .patch(`/api/v1/articles/${articleId}`)
        .set(userHeaders)
        .field('data', JSON.stringify({ title: 'New Title' }));
        
      expect(response.status).toBe(403);
    });

    it('should update article successfully if user is author and article is Draft', async () => {
      const existingArticle = { id: articleId, authorId: 'user-123', status: 'Draft', title: 'Old Title' };
      const updatedArticle = { ...existingArticle, title: 'New Title' };
      
      mockFindById.mockResolvedValueOnce(existingArticle);
      mockUpdate.mockResolvedValueOnce(updatedArticle);

      const response = await request(app)
        .patch(`/api/v1/articles/${articleId}`)
        .set(userHeaders)
        .field('data', JSON.stringify({ title: 'New Title' }));
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('New Title');
      expect(mockUpdate).toHaveBeenCalledWith(articleId, { title: 'New Title' });
    });
  });

  describe('GET /api/v1/articles', () => {
    it('should return 401 if unauthenticated', async () => {
      const response = await request(app).get('/api/v1/articles');
      expect(response.status).toBe(401);
    });

    it('should return published articles with default pagination', async () => {
      const mockArticles = [
        {
          id: 'article-1',
          title: 'Title 1',
          authorId: 'user-1',
          tags: ['test'],
          status: 'Published',
          createdAt: new Date('2023-01-01').toISOString(),
          updatedAt: new Date('2023-01-01').toISOString(),
          _count: { likes: 5, comments: 2 },
        }
      ];

      mockFindPublished.mockResolvedValueOnce({ articles: mockArticles, total: 1 });

      const response = await request(app)
        .get('/api/v1/articles')
        .set(userHeaders);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.articles).toHaveLength(1);
      expect(response.body.data.articles[0].likeCount).toBe(5);
      expect(response.body.data.articles[0].commentCount).toBe(2);
      expect(response.body.data.total).toBe(1);
      expect(response.body.data.page).toBe(1);
      expect(response.body.data.limit).toBe(20);
      
      expect(mockFindPublished).toHaveBeenCalledWith(1, 20);
    });

    it('should respect custom page and limit query params', async () => {
      mockFindPublished.mockResolvedValueOnce({ articles: [], total: 0 });

      const response = await request(app)
        .get('/api/v1/articles?page=3&limit=5')
        .set(userHeaders);

      expect(response.status).toBe(200);
      expect(response.body.data.page).toBe(3);
      expect(response.body.data.limit).toBe(5);
      
      expect(mockFindPublished).toHaveBeenCalledWith(3, 5);
    });
  });

  describe('POST /api/v1/articles/:id/submit', () => {
    const articleId = 'article-123';
    
    it('should return 401 if unauthenticated', async () => {
      const response = await request(app).post(`/api/v1/articles/${articleId}/submit`);
      expect(response.status).toBe(401);
    });

    it('should return 404 if article not found', async () => {
      mockFindById.mockResolvedValueOnce(null);

      const response = await request(app)
        .post(`/api/v1/articles/${articleId}/submit`)
        .set(userHeaders);
        
      expect(response.status).toBe(404);
    });

    it('should return 403 if user is not author', async () => {
      mockFindById.mockResolvedValueOnce({ id: articleId, authorId: 'other-user', status: 'Draft' });

      const response = await request(app)
        .post(`/api/v1/articles/${articleId}/submit`)
        .set(userHeaders);
        
      expect(response.status).toBe(403);
    });

    it('should return 400 if article is not Draft', async () => {
      mockFindById.mockResolvedValueOnce({ id: articleId, authorId: 'user-123', status: 'Pending' });

      const response = await request(app)
        .post(`/api/v1/articles/${articleId}/submit`)
        .set(userHeaders);
        
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Cannot transition from Pending to Pending');
    });

    it('should submit article for review successfully', async () => {
      const existingArticle = { id: articleId, authorId: 'user-123', status: 'Draft' };
      const updatedArticle = { ...existingArticle, status: 'Pending' };
      
      mockFindById.mockResolvedValueOnce(existingArticle);
      mockUpdateStatus.mockResolvedValueOnce(updatedArticle);

      const response = await request(app)
        .post(`/api/v1/articles/${articleId}/submit`)
        .set(userHeaders);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('Pending');
      expect(mockUpdateStatus).toHaveBeenCalledWith(articleId, 'Pending');
    });
  });
});

