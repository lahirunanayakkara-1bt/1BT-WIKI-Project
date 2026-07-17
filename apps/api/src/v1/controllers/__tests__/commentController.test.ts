import { jest } from '@jest/globals';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../errors/AppError.js';

jest.unstable_mockModule('../../services/commentService.js', () => ({
  default: {
    addComment: jest.fn(),
  },
}));

const { default: controller } = await import('../commentController.js');
const { default: mockCommentService } = await import('../../services/commentService.js');

describe('CommentController.create', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<any>;

  beforeEach(() => {
    req = {
      params: { id: 'article-123' },
      body: {},
      user: { userId: 'user-123' } as any,
    };
    res = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any,
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should call CommentService.addComment and return 201 with success response', async () => {
    req.body = { body: 'Nice article' };

    const createdComment = {
      id: 'comment-123',
      articleId: 'article-123',
      createdBy: 'user-123',
      body: 'Nice article',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (mockCommentService.addComment as jest.Mock<any>).mockResolvedValue(createdComment);

    await controller.create(req as Request, res as Response, next);

    expect(mockCommentService.addComment).toHaveBeenCalledWith('article-123', 'user-123', 'Nice article');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: createdComment,
      message: 'Comment added successfully',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should pass errors from CommentService to next', async () => {
    req.body = { body: 'Nice article' };

    const error = new AppError('Cannot comment on this article', 403);
    (mockCommentService.addComment as jest.Mock<any>).mockRejectedValue(error);

    await controller.create(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
