import { prisma } from '@repo/db';
import type { Like } from '@models/like.types.js';

const upsert = async (articleId: string, userId: string): Promise<Like> => {
  const result = await prisma.like.upsert({
    where: { articleId_userId: { articleId, userId } },
    create: { articleId, userId },
    update: {},
  });

  return result as unknown as Like;
};

const remove = async (articleId: string, userId: string): Promise<void> => {
  await prisma.like.deleteMany({
    where: { articleId, userId },
  });
};

export default { upsert, remove };
