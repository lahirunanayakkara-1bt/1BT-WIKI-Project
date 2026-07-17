import { prisma } from '@repo/db';
import type { Comment, CreateCommentInput } from '../types/comment.types.js';

const COMMENT_SELECT = {
  id: true,
  articleId: true,
  createdBy: true,
  body: true,
  createdAt: true,
  updatedAt: true,
} as const;

const create = async (data: CreateCommentInput): Promise<Comment> => {
  const result = await prisma.comment.create({
    data,
    select: COMMENT_SELECT,
  });

  return result as unknown as Comment;
};

export default { create };
