-- Migration: 005_create_article_comments
-- Description: User comments on articles; owners can edit/delete their own comments

CREATE TABLE article_comments (
    id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id  UUID      NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
    created_by  UUID      NOT NULL REFERENCES neon_auth.user(id) ON DELETE RESTRICT,
    body        TEXT      NOT NULL,
    deleted_at  TIMESTAMP,                                  -- soft delete for owner/admin removal
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_article_comments_article_id ON article_comments (article_id);
CREATE INDEX idx_article_comments_created_by  ON article_comments (created_by);
-- Active comments only index (excludes soft-deleted rows)
CREATE INDEX idx_article_comments_active     ON article_comments (article_id, created_at)
    WHERE deleted_at IS NULL;

COMMENT ON TABLE  article_comments            IS 'Comments on published articles; non-owners get read-only access';
COMMENT ON COLUMN article_comments.deleted_at IS 'Soft delete: comment owners and admins can remove comments';
