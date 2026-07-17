import { prisma } from '@repo/db';
import type { Article, CreateArticleInput, JSONContent } from '../types/article.types.js';
import type { Prisma } from '@repo/db';

const ARTICLE_SELECT = {
  id: true,
  title: true,
  body: true,
  status: true,
  authorId: true,
  tags: true,
  createdAt: true,
  updatedAt: true,
} as const;

const create = async (data: CreateArticleInput & { authorId: string }): Promise<Article> => {
  const { title, body, tags, authorId } = data;
  
  // Default values
  const defaultBody = body ?? {};
  const defaultTags = tags ?? [];
  const status = 'Draft';

  const result = await prisma.article.create({
    data: {
      title,
      body: defaultBody as Prisma.InputJsonValue,
      status,
      authorId,
      tags: defaultTags,
    },
    select: ARTICLE_SELECT,
  });

  return result as unknown as Article;
};

const findById = async (id: string): Promise<Article | null> => {
  const result = await prisma.article.findFirst({
    where: { id, deletedAt: null },
    select: ARTICLE_SELECT,
  });

  return result ? (result as unknown as Article) : null;
};

const update = async (
  id: string,
  fields: Partial<{ title: string; body: JSONContent; tags: string[]; status: string }>
): Promise<Article> => {
  // Prisma will update updatedAt automatically via @updatedAt
  
  // Since 'status' is typed as a string in the interface, but an enum in Prisma, we cast it.
  const updateData: Prisma.articleUpdateInput = {
    ...(fields.title !== undefined && { title: fields.title }),
    ...(fields.body !== undefined && { body: fields.body as Prisma.InputJsonValue }),
    ...(fields.tags !== undefined && { tags: fields.tags }),
    ...(fields.status !== undefined && { status: fields.status as any }),
  };

  const result = await prisma.article.update({
    where: { id },
    data: updateData,
    select: ARTICLE_SELECT,
  });

  return result as unknown as Article;
};

const updateStatus = async (id: string, status: string): Promise<Article> => {
  const result = await prisma.article.update({
    where: { id },
    data: { status: status as any },
    select: ARTICLE_SELECT,
  });

  return result as unknown as Article;
};

export default { create, findById, update, updateStatus };
