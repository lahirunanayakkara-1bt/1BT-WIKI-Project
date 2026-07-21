import { jest } from '@jest/globals';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@errors/AppError.js';

jest.unstable_mockModule('@services/likeService.js', () => ({
  default: {
    likeArticle: jest.fn(),
    unlikeArticle: jest.fn(),
  },
}));

const { default: controller } = await import('../likeController.js');
const { default: mockLikeService } = await import('@services/likeService.js');

describe('LikeController.like', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<any>;

  beforeEach(() => {
    req = {
      params: { id: 'article-123' },
      user: { userId: 'user-123' } as any,
    };
    res = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any,
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should call LikeService.likeArticle and return 200 with success response', async () => {
    (mockLikeService.likeArticle as jest.Mock<any>).mockResolvedValue(undefined);

    await controller.like(req as Request, res as Response, next);

    expect(mockLikeService.likeArticle).toHaveBeenCalledWith('article-123', 'user-123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { liked: true },
      message: 'Article liked successfully',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should pass errors from LikeService to next', async () => {
    const error = new AppError('Cannot like this article', 403);
    (mockLikeService.likeArticle as jest.Mock<any>).mockRejectedValue(error);

    await controller.like(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('LikeController.unlike', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<any>;

  beforeEach(() => {
    req = {
      params: { id: 'article-123' },
      user: { userId: 'user-123' } as any,
    };
    res = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any,
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should call LikeService.unlikeArticle and return 200 with success response', async () => {
    (mockLikeService.unlikeArticle as jest.Mock<any>).mockResolvedValue(undefined);

    await controller.unlike(req as Request, res as Response, next);

    expect(mockLikeService.unlikeArticle).toHaveBeenCalledWith('article-123', 'user-123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { liked: false },
      message: 'Article unliked successfully',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should pass errors from LikeService to next', async () => {
    const error = new AppError('Article not found', 404);
    (mockLikeService.unlikeArticle as jest.Mock<any>).mockRejectedValue(error);

    await controller.unlike(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
