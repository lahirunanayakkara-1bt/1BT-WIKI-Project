import type { Request, Response, NextFunction } from 'express';
import LikeService from '../services/likeService.js';
import { successResponse } from '../types/article.types.js';

const like = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: articleId } = req.params;
    // req.user is guaranteed to exist because of authenticate middleware
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const userId = req.user!.userId;

    await LikeService.likeArticle(articleId, userId);

    res.status(200).json(successResponse({ liked: true }, 'Article liked successfully'));
  } catch (error) {
    next(error);
  }
};

export default { like };
