import pool from '../../db/index.js';
import type { ArticleReview } from '../types/article.types.js';

const findLatestByArticleId = async (articleId: string): Promise<ArticleReview | null> => {
  const query = `
    SELECT 
      id,
      article_id,
      reviewer_id,
      review_status,
      comments,
      created_at,
      updated_at
    FROM article_reviews
    WHERE article_id = $1
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [articleId]);

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];

  return {
    id: row.id,
    articleId: row.article_id,
    reviewerId: row.reviewer_id,
    reviewStatus: row.review_status,
    comments: row.comments,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export default { findLatestByArticleId };
