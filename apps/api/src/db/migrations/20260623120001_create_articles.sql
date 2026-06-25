-- Rollback: DROP TABLE IF EXISTS articles;

CREATE TYPE article_status AS ENUM (
    'Draft', 
    'Pending', 
    'Published',
    'Unpublished'
);

CREATE TABLE IF NOT EXISTS articles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title               VARCHAR(500) NOT NULL,
  body                JSONB NOT NULL DEFAULT '{}',
  article_status      article_status NOT NULL,
  author_id           UUID NOT NULL REFERENCES neon_auth.user(id),
  article_tags        TEXT[] DEFAULT '{}',
  created_by          UUID             NOT NULL REFERENCES neon_auth.user(id) ON DELETE RESTRICT,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(article_status);
CREATE INDEX IF NOT EXISTS idx_articles_deleted_at ON articles(deleted_at);
