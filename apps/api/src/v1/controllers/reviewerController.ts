import type { Request, Response, NextFunction } from 'express';
import { ReviewerService } from '../services/reviewerService.js';

export class ReviewerController {
  constructor(private service: ReviewerService = new ReviewerService()) {}

  listPending = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await this.service.listPending(page, limit);
      res.status(200).json({ success: true, data: result, message: 'Pending articles retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };
}

export default new ReviewerController();
