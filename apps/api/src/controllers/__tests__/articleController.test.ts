import { jest } from '@jest/globals';
import type { Request, Response, NextFunction } from 'express';
import ArticleController from '../articleController.js';
import ArticleService from '../../services/articleService.js';
import { AppError } from '../../errors/AppError.js';

// Mock the ArticleService
jest.unstable_mockModule('../../services/articleService.js', () => ({
  default: {
    createArticle: jest.fn(),
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
