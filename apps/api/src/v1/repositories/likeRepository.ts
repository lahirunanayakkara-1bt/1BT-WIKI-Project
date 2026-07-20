import { prisma } from '@repo/db';
import type { Like } from '../types/like.types.js';

const upsert = async (articleId: string, userId: string): Promise<Like> => {
  const result = await prisma.like.upsert({
    where: { articleId_userId: { articleId, userId } },
    create: { articleId, userId },
    update: {},
  });

  return result as unknown as Like;
};

export default { upsert };
