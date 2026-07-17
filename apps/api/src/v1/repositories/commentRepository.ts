import { prisma } from '@repo/db';
import type { Comment, CommentWithAuthor, CreateCommentInput } from '../types/comment.types.js';

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

const findByArticleId = async (articleId: string): Promise<CommentWithAuthor[]> => {
  const results = await prisma.comment.findMany({
    where: { articleId, deletedAt: null },
    select: { ...COMMENT_SELECT, user: { select: { name: true, image: true } } },
    orderBy: { createdAt: 'asc' },
  });

  return results.map(({ user, ...rest }) => ({
    ...rest,
    authorName: user.name,
    authorImage: user.image,
  })) as unknown as CommentWithAuthor[];
};

export default { create, findByArticleId };
