import type { Request, Response, NextFunction } from 'express';
import CommentService from '../services/commentService.js';
import { successResponse } from '../types/article.types.js';

const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: articleId } = req.params;
    // req.user is guaranteed to exist because of authenticate middleware
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const authorId = req.user!.userId;
    const body = req.body.body as string | undefined;

    const comment = await CommentService.addComment(articleId, authorId, body);

    res.status(201).json(successResponse(comment, 'Comment added successfully'));
  } catch (error) {
    next(error);
  }
};

export default { create };
