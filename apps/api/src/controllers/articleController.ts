import type { Request, Response, NextFunction } from 'express';
import ArticleService from '../services/articleService.js';
import { successResponse } from '../types/article.types.js';
import type { CreateArticleInput } from '../types/article.types.js';
import { AppError } from '../errors/AppError.js';

const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.body.data) {
      throw new AppError('The "data" field is required', 400);
    }
    
    let input: CreateArticleInput;
    try {
      input = JSON.parse(req.body.data) as CreateArticleInput;
    } catch (e) {
      throw new AppError('Invalid JSON in "data" field', 400);
    }
    
    // req.user is guaranteed to exist because of authenticate middleware
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const authorId = req.user!.userId;
    const images = (req.files as Express.Multer.File[]) ?? [];

    const article = await ArticleService.createArticle(input, authorId, images);

    res.status(201).json(successResponse(article, 'Article created successfully'));
  } catch (error) {
    next(error);
  }
};

export default { create };
