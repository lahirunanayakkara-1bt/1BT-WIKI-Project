import { jest } from '@jest/globals';
import type { Request, Response, NextFunction } from 'express';
import { ArticleController } from '../articleController.js';
import type { ArticleService } from '../../services/articleService.js';
import { AppError } from '../../../errors/AppError.js';

// Build a typed mock service object — injected directly into the controller.
const makeMockService = (): jest.Mocked<Pick<ArticleService, 'createArticle' | 'updateArticle' | 'submitForReview' | 'listPublished' | 'getPublishedById'>> => ({
  createArticle: jest.fn(),
  updateArticle: jest.fn(),
  submitForReview: jest.fn(),
  listPublished: jest.fn(),
  getPublishedById: jest.fn(),
});

describe('ArticleController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<any>;
  let mockService: ReturnType<typeof makeMockService>;
  let controller: ArticleController;

  beforeEach(() => {
    req = {
      body: {},
      user: { userId: 'user-123' } as any,
      files: [],
      params: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any,
    };
    next = jest.fn();
    mockService = makeMockService();
    controller = new ArticleController(mockService as unknown as ArticleService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw AppError if data field is missing', async () => {
      await controller.create(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = next.mock.calls[0][0] as any as AppError;
      expect(error.message).toBe('The "data" field is required');
      expect(error.statusCode).toBe(400);
    });

    it('should throw AppError if data field is not valid JSON', async () => {
      req.body = { data: 'invalid-json' };
      await controller.create(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = next.mock.calls[0][0] as any as AppError;
      expect(error.message).toBe('Invalid JSON in "data" field');
      expect(error.statusCode).toBe(400);
    });

    it('should call ArticleService.createArticle and return 201 with success response', async () => {
      const inputData = { title: 'Test Article', body: { type: 'doc' } };
      req.body = { data: JSON.stringify(inputData) };
      
      const mockFile = {
        originalname: 'test.png',
        mimetype: 'image/png',
        size: 1024,
        buffer: Buffer.from('test'),
      } as Express.Multer.File;
      req.files = [mockFile];

      const createdArticle = {
        id: 'article-123',
        title: 'Test Article',
        body: { type: 'doc' },
        tags: [],
        authorId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockService.createArticle.mockResolvedValue(createdArticle as never);

      await controller.create(req as Request, res as Response, next);

      expect(mockService.createArticle).toHaveBeenCalledWith(inputData, 'user-123', [mockFile]);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: createdArticle,
        message: 'Article created successfully',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should pass errors from ArticleService to next', async () => {
      const inputData = { title: 'Test Article', body: { type: 'doc' } };
      req.body = { data: JSON.stringify(inputData) };

      const error = new Error('Service error');
      mockService.createArticle.mockRejectedValue(error as never);

      await controller.create(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      req.params = { id: 'article-123' };
    });

    it('should call ArticleService.updateArticle with empty input if no data field is provided', async () => {
      const updatedArticle = {
        id: 'article-123',
        title: 'Updated Article',
        body: { type: 'doc' },
        tags: [],
        authorId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockService.updateArticle.mockResolvedValue(updatedArticle as never);

      await controller.update(req as Request, res as Response, next);

      expect(mockService.updateArticle).toHaveBeenCalledWith('article-123', {}, 'user-123', []);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: updatedArticle,
        message: 'Article updated successfully',
      });
    });

    it('should throw AppError if data field is not valid JSON', async () => {
      req.body = { data: 'invalid-json' };
      await controller.update(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = next.mock.calls[0][0] as any as AppError;
      expect(error.message).toBe('Invalid JSON in "data" field');
      expect(error.statusCode).toBe(400);
    });

    it('should call ArticleService.updateArticle with parsed data and files', async () => {
      const inputData = { title: 'Updated Article' };
      req.body = { data: JSON.stringify(inputData) };
      
      const mockFile = {
        originalname: 'test.png',
        mimetype: 'image/png',
        size: 1024,
        buffer: Buffer.from('test'),
      } as Express.Multer.File;
      req.files = [mockFile];

      const updatedArticle = {
        id: 'article-123',
        title: 'Updated Article',
        body: { type: 'doc' },
        tags: [],
        authorId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockService.updateArticle.mockResolvedValue(updatedArticle as never);

      await controller.update(req as Request, res as Response, next);

      expect(mockService.updateArticle).toHaveBeenCalledWith('article-123', inputData, 'user-123', [mockFile]);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should pass errors from ArticleService to next', async () => {
      req.body = { data: JSON.stringify({ title: 'Title' }) };

      const error = new Error('Service error');
      mockService.updateArticle.mockRejectedValue(error as never);

      await controller.update(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('submitForReview', () => {
    it('should call ArticleService.submitForReview', async () => {
      req.params = { id: 'article-123' };
      const updatedArticle = { id: 'article-123', status: 'Pending' };
      mockService.submitForReview.mockResolvedValue(updatedArticle as never);

      await controller.submitForReview(req as Request, res as Response, next);

      expect(mockService.submitForReview).toHaveBeenCalledWith('article-123', 'user-123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: updatedArticle,
        message: 'Article submitted for review',
      });
    });
  });

  describe('listPublished', () => {
    it('should call ArticleService.listPublished with default pagination', async () => {
      const mockResult = { articles: [], total: 0, page: 1, limit: 20 };
      mockService.listPublished.mockResolvedValue(mockResult as never);

      await controller.listPublished(req as Request, res as Response, next);

      expect(mockService.listPublished).toHaveBeenCalledWith(1, 20);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        message: 'Articles retrieved successfully',
      });
    });

    it('should respect custom page and limit', async () => {
      req.query = { page: '3', limit: '5' };
      const mockResult = { articles: [], total: 0, page: 3, limit: 5 };
      mockService.listPublished.mockResolvedValue(mockResult as never);

      await controller.listPublished(req as Request, res as Response, next);

      expect(mockService.listPublished).toHaveBeenCalledWith(3, 5);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getById', () => {
    beforeEach(() => {
      req.params = { id: 'article-123' };
    });

    it('should return the article', async () => {
      const mockArticle = { id: 'article-123', title: 'Test Article', status: 'Published' };
      mockService.getPublishedById.mockResolvedValue(mockArticle as never);

      await controller.getById(req as Request, res as Response, next);

      expect(mockService.getPublishedById).toHaveBeenCalledWith('article-123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockArticle,
        message: 'Article retrieved successfully',
      });
    });

    it('should pass service errors to next', async () => {
      const error = new Error('Service error');
      mockService.getPublishedById.mockRejectedValue(error as never);

      await controller.getById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
