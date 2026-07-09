import pool from '../db/index.js';
import type { ArticleAttachment, CreateAttachmentInput } from '../types/article.types.js';

const create = async (
  data: CreateAttachmentInput
): Promise<ArticleAttachment> => {
  const query = `
    INSERT INTO article_attachments (
      article_id,
      uploaded_by,
      file_name,
      b2_file_key,
      b2_file_id,
      b2_bucket_name,
      file_url,
      mime_type,
      size_bytes
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING
      id,
      article_id,
      uploaded_by,
      file_name,
      b2_file_key,
      b2_file_id,
      b2_bucket_name,
      file_url,
      mime_type,
      size_bytes,
      created_at,
      deleted_at
  `;

  const values = [
    data.articleId,
    data.uploadedBy,
    data.fileName,
    data.b2FileKey,
    data.b2FileId,
    data.b2BucketName,
    data.fileUrl,
    data.mimeType,
    data.sizeBytes,
  ];

  const { rows } = await pool.query(query, values);
  const row = rows[0];

  return {
    id: row.id,
    articleId: row.article_id,
    uploadedBy: row.uploaded_by,
    fileName: row.file_name,
    b2FileKey: row.b2_file_key,
    b2FileId: row.b2_file_id,
    b2BucketName: row.b2_bucket_name,
    fileUrl: row.file_url,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    createdAt: row.created_at,
    deletedAt: row.deleted_at,
  };
};

const findByArticleId = async (
  articleId: string
): Promise<ArticleAttachment[]> => {
  const query = `
    SELECT
      id,
      article_id,
      uploaded_by,
      file_name,
      b2_file_key,
      b2_file_id,
      b2_bucket_name,
      file_url,
      mime_type,
      size_bytes,
      created_at,
      deleted_at
    FROM article_attachments
    WHERE article_id = $1 AND deleted_at IS NULL
  `;
  
  const { rows } = await pool.query(query, [articleId]);

  return rows.map(row => ({
    id: row.id,
    articleId: row.article_id,
    uploadedBy: row.uploaded_by,
    fileName: row.file_name,
    b2FileKey: row.b2_file_key,
    b2FileId: row.b2_file_id,
    b2BucketName: row.b2_bucket_name,
    fileUrl: row.file_url,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    createdAt: row.created_at,
    deletedAt: row.deleted_at,
  }));
};

const softDelete = async (
  id: string
): Promise<void> => {
  const query = `
    UPDATE article_attachments
    SET deleted_at = NOW()
    WHERE id = $1
  `;
  await pool.query(query, [id]);
};

export default { create, findByArticleId, softDelete };
