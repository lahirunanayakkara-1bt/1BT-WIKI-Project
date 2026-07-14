import pool from '../db/index.js';
import type { Article, CreateArticleInput, JSONContent } from '../types/article.types.js';

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

const findById = async (id: string): Promise<Article | null> => {
  const query = `
    SELECT 
      id, 
      title, 
      body, 
      status, 
      author_id, 
      article_tags, 
      created_at, 
      updated_at
    FROM articles
    WHERE id = $1
    AND deleted_at IS NULL
  `;

  const { rows } = await pool.query(query, [id]);

  if (rows.length === 0) {
    return null;
  }

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

const update = async (
  id: string,
  fields: Partial<{ title: string; body: JSONContent; tags: string[]; status: string }>
): Promise<Article> => {
  const setClauses: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (fields.title !== undefined) {
    setClauses.push(`title = $${paramIndex++}`);
    values.push(fields.title);
  }

  if (fields.body !== undefined) {
    setClauses.push(`body = $${paramIndex++}`);
    values.push(JSON.stringify(fields.body));
  }

  if (fields.tags !== undefined) {
    setClauses.push(`article_tags = $${paramIndex++}`);
    values.push(fields.tags);
  }

  if (fields.status !== undefined) {
    setClauses.push(`status = $${paramIndex++}`);
    values.push(fields.status);
  }

  setClauses.push(`updated_at = NOW()`);
  
  const setString = setClauses.join(', ');
  
  const query = `
    UPDATE articles
    SET ${setString}
    WHERE id = $${paramIndex}
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
  
  values.push(id);

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

export default { create, findById, update };
