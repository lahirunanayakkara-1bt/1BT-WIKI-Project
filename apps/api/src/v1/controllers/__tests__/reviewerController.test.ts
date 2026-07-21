import { jest } from '@jest/globals';
import type { Request, Response, NextFunction } from 'express';
import type { ReviewerService } from '../../services/reviewerService.js';
import { AppError } from '../../../errors/AppError.js';

jest.unstable_mockModule('../../services/reviewerService.js', () => ({
  ReviewerService: jest.fn(),
}));

const { ReviewerController } = await import('../reviewerController.js');

const makeMockService = (): jest.Mocked<Pick<ReviewerService, 'listPending'>> => ({
  listPending: jest.fn(),
});

describe('ReviewerController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<any>;
  let mockService: ReturnType<typeof makeMockService>;
  let controller: InstanceType<typeof ReviewerController>;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any,
    };
    next = jest.fn();
    mockService = makeMockService();
    controller = new ReviewerController(mockService as unknown as ReviewerService);
    jest.clearAllMocks();
  });

  describe('listPending', () => {
    it('should call listPending with default pagination', async () => {
      const mockResult = {
        articles: [],
        total: 0,
        page: 1,
        limit: 20,
      };
      mockService.listPending.mockResolvedValue(mockResult as never);

      await controller.listPending(req as Request, res as Response, next);

      expect(mockService.listPending).toHaveBeenCalledWith(1, 20);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        message: 'Pending articles retrieved successfully',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should parse custom page and limit query params', async () => {
      req.query = { page: '3', limit: '5' };
      const mockResult = {
        articles: [],
        total: 0,
        page: 3,
        limit: 5,
      };
      mockService.listPending.mockResolvedValue(mockResult as never);

      await controller.listPending(req as Request, res as Response, next);

      expect(mockService.listPending).toHaveBeenCalledWith(3, 5);
    });

    it('should pass errors to next', async () => {
      const error = new AppError('Database error', 500);
      mockService.listPending.mockRejectedValue(error as never);

      await controller.listPending(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
