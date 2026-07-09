import pool from '../db/index.js';
import type { Article, CreateArticleInput } from '../types/article.types.js';

const create = async (data: CreateArticleInput & { authorId: string }): Promise<Article> => {
  const { title, body, tags, authorId } = data;
  
  // Default values
  const defaultBody = body ?? {};
  const defaultTags = tags ?? [];
  const status = 'Draft';

  const query = `
    INSERT INTO articles (
      title, 
      body, 
      status, 
      author_id, 
      article_tags
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING 
      id, 
      title, 
      body, 
      status, 
      author_id, 
      article_tags, 
      created_at, 
      updated_at
  `;

  const values = [
    title,
    JSON.stringify(defaultBody),
    status,
    authorId,
    defaultTags
  ];

  const { rows } = await pool.query(query, values);
  const row = rows[0];

  return {
    id: row.id,
    title: row.title,
    body: row.body,
    status: row.status,
    authorId: row.author_id,
    tags: row.article_tags,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export default { create };
