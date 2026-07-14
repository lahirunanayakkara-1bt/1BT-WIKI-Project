/**
 * @repo/db
 *
 * Public surface of the shared database package.
 * All consuming apps/packages should import from "@repo/db" only —
 * never directly from the generated Prisma internals.
 */

// Re-export the singleton PrismaClient instance
export { prisma } from './client.js';
export { default } from './client.js';

// Re-export all Prisma-generated types and enums
export type {
  // neon_auth schema models
  account,
  invitation,
  jwks,
  member,
  organization,
  project_config,
  session,
  user,
  verification,
  // public schema models
  article_attachments,
  article_comments,
  article_likes,
  article_reviews,
  articles,
  notifications,
  tech_talks,
} from './generated/prisma/client.js';

export {
  // Enums
  article_status,
  notification_reference_type,
  notification_type,
  review_status,
  tech_talk_status,
} from './generated/prisma/client.js';