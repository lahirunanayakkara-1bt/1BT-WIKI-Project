import { jest } from '@jest/globals';
import type { Request, Response, NextFunction } from 'express';
import ArticleController from '../articleController.js';
import ArticleService from '../../services/articleService.js';
import { AppError } from '../../../errors/AppError.js';

// Mock the ArticleService
jest.unstable_mockModule('../../services/articleService.js', () => ({
  default: {
    createArticle: jest.fn(),
    updateArticle: jest.fn(),
    listPublished: jest.fn(),
    listMine: jest.fn(),
  },
}));

// We need to re-import the controller after mocking its dependencies
const { default: controller } = await import('../articleController.js');
const { default: mockArticleService } = await import('../../services/articleService.js');

describe('ArticleController.create', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<any>;

  beforeEach(() => {
    req = {
      body: {},
      user: { userId: 'user-123' } as any,
      files: [],
    };
    res = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any,
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

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

    (mockArticleService.createArticle as jest.Mock<any>).mockResolvedValue(createdArticle);

    await controller.create(req as Request, res as Response, next);

    expect(mockArticleService.createArticle).toHaveBeenCalledWith(inputData, 'user-123', [mockFile]);
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
    (mockArticleService.createArticle as jest.Mock<any>).mockRejectedValue(error);

    await controller.create(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('ArticleController.update', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<any>;

  beforeEach(() => {
    req = {
      params: { id: 'article-123' },
      body: {},
      user: { userId: 'user-123' } as any,
      files: [],
    };
    res = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any,
    };
    next = jest.fn();
    jest.clearAllMocks();
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

    (mockArticleService.updateArticle as jest.Mock<any>).mockResolvedValue(updatedArticle);

    await controller.update(req as Request, res as Response, next);

    expect(mockArticleService.updateArticle).toHaveBeenCalledWith('article-123', {}, 'user-123', []);
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

    (mockArticleService.updateArticle as jest.Mock<any>).mockResolvedValue(updatedArticle);

    await controller.update(req as Request, res as Response, next);

    expect(mockArticleService.updateArticle).toHaveBeenCalledWith('article-123', inputData, 'user-123', [mockFile]);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should pass errors from ArticleService to next', async () => {
    req.body = { data: JSON.stringify({ title: 'Title' }) };

    const error = new Error('Service error');
    (mockArticleService.updateArticle as jest.Mock<any>).mockRejectedValue(error);

    await controller.update(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('ArticleController.listPublished', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<any>;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any,
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should default to page 1 and limit 20 when no query params are provided', async () => {
    const result = { articles: [], total: 0, page: 1, limit: 20 };
    (mockArticleService.listPublished as jest.Mock<any>).mockResolvedValue(result);

    await controller.listPublished(req as Request, res as Response, next);

    expect(mockArticleService.listPublished).toHaveBeenCalledWith(1, 20);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: result,
      message: 'Articles retrieved successfully',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should parse custom page and limit query params', async () => {
    req.query = { page: '3', limit: '5' };
    const result = { articles: [], total: 0, page: 3, limit: 5 };
    (mockArticleService.listPublished as jest.Mock<any>).mockResolvedValue(result);

    await controller.listPublished(req as Request, res as Response, next);

    expect(mockArticleService.listPublished).toHaveBeenCalledWith(3, 5);
  });

  it('should include likeCount and commentCount in the response payload', async () => {
    const result = {
      articles: [
        { id: 'article-1', title: 'Title 1', likeCount: 5, commentCount: 2 },
      ],
      total: 1,
      page: 1,
      limit: 20,
    };
    (mockArticleService.listPublished as jest.Mock<any>).mockResolvedValue(result);

    await controller.listPublished(req as Request, res as Response, next);

    const jsonCall = (res.json as jest.Mock<any>).mock.calls[0][0] as any;
    expect(jsonCall.data.articles[0].likeCount).toBe(5);
    expect(jsonCall.data.articles[0].commentCount).toBe(2);
  });

  it('should pass errors from ArticleService to next', async () => {
    const error = new Error('Service error');
    (mockArticleService.listPublished as jest.Mock<any>).mockRejectedValue(error);

    await controller.listPublished(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('ArticleController.listMine', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<any>;

  beforeEach(() => {
    req = {
      query: {},
      user: { userId: 'user-123' } as any,
    };
    res = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any,
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should default to page 1 and limit 20 when no query params are provided', async () => {
    const result = { articles: [], total: 0, page: 1, limit: 20 };
    (mockArticleService.listMine as jest.Mock<any>).mockResolvedValue(result);

    await controller.listMine(req as Request, res as Response, next);

    expect(mockArticleService.listMine).toHaveBeenCalledWith('user-123', 1, 20);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: result,
      message: 'Articles retrieved successfully',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should parse custom page and limit query params', async () => {
    req.query = { page: '3', limit: '5' };
    const result = { articles: [], total: 0, page: 3, limit: 5 };
    (mockArticleService.listMine as jest.Mock<any>).mockResolvedValue(result);

    await controller.listMine(req as Request, res as Response, next);

    expect(mockArticleService.listMine).toHaveBeenCalledWith('user-123', 3, 5);
  });

  it('should include articles across all statuses with likeCount and commentCount', async () => {
    const result = {
      articles: [
        { id: 'article-1', title: 'Title 1', status: 'Draft', likeCount: 5, commentCount: 2 },
      ],
      total: 1,
      page: 1,
      limit: 20,
    };
    (mockArticleService.listMine as jest.Mock<any>).mockResolvedValue(result);

    await controller.listMine(req as Request, res as Response, next);

    const jsonCall = (res.json as jest.Mock<any>).mock.calls[0][0] as any;
    expect(jsonCall.data.articles[0].status).toBe('Draft');
    expect(jsonCall.data.articles[0].likeCount).toBe(5);
    expect(jsonCall.data.articles[0].commentCount).toBe(2);
  });

  it('should pass errors from ArticleService to next', async () => {
    const error = new Error('Service error');
    (mockArticleService.listMine as jest.Mock<any>).mockRejectedValue(error);

    await controller.listMine(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
