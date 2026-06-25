-- Migration: 004_create_article_likes
-- Description: Tracks which users liked which articles (one like per user per article)

CREATE TABLE article_likes (
    id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id  UUID      NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
    user_id     UUID      NOT NULL REFERENCES neon_auth.user(id)    ON DELETE CASCADE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_article_likes UNIQUE (article_id, user_id)
);

CREATE INDEX idx_article_likes_article_id ON article_likes (article_id);
CREATE INDEX idx_article_likes_user_id    ON article_likes (user_id);

COMMENT ON TABLE  article_likes IS 'One row per user-article like; the unique constraint prevents duplicate likes';
