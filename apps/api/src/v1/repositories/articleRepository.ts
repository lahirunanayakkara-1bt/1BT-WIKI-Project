import { prisma } from '@repo/db';
import type { Article, CreateArticleInput, JSONContent } from '../types/article.types.js';
import type { Prisma } from '@repo/db';
import { ArticleStatus } from '@repo/db/generated/prisma/index.js';

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

type ArticleBody = { title: string; body: JSONContent; tags: string[]; status: ArticleStatus };

const update = async (
  id: string,
  fields: Partial<ArticleBody>
): Promise<Article> => {
  // Prisma will update updatedAt automatically via @updatedAt
  
  const updateData: Prisma.articleUpdateInput = {
    ...(fields.title !== undefined && { title: fields.title }),
    ...(fields.body !== undefined && { body: fields.body as Prisma.InputJsonValue }),
    ...(fields.tags !== undefined && { tags: fields.tags }),
    ...(fields.status !== undefined && { status: fields.status }),
  };

  const result = await prisma.article.update({
    where: { id },
    data: updateData,
    select: ARTICLE_SELECT,
  });

  return result as unknown as Article;
};

const updateStatus = async (id: string, status: ArticleStatus): Promise<Article> => {
  const result = await prisma.article.update({
    where: { id },
    data: { status },
    select: ARTICLE_SELECT,
  });

  return result as unknown as Article;
};

export default { create, findById, update, updateStatus };
