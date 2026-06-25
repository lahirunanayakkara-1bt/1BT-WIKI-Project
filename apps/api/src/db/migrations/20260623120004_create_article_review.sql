-- Migration: 20260624120001_create_article_reviews
-- Description: Stores rejection history for articles including reviewer feedback.
--              Kept as a separate table to preserve full rejection history
--              across multiple review cycles (an article can be rejected, edited,
--              and rejected again — each rejection is recorded).

CREATE TYPE review_status AS ENUM (
    'Pending', 
    'Approved', 
    'Rejected'
);

CREATE TABLE article_reviews (
    id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id          UUID          NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    reviewer_id         UUID          NOT NULL REFERENCES neon_auth.user(id),
    review_feedback     TEXT,
    review_status       review_status NOT NULL,
    created_by          UUID             NOT NULL REFERENCES neon_auth.user(id) ON DELETE RESTRICT,
    deleted_at          TIMESTAMP,                          -- soft delete
    created_at          TIMESTAMP        NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP        NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_review_feedback CHECK (
        (review_status = 'Rejected' AND review_feedback IS NOT NULL)
        OR (review_status <> 'Rejected')
    )
);

CREATE INDEX idx_article_reviews_article_id  ON article_reviews (article_id);
CREATE INDEX idx_article_reviews_reviewer_id ON article_reviews (reviewer_id);

COMMENT ON TABLE  article_reviews                     IS 'Full rejection history per article; one row per rejection event across all review cycles';
COMMENT ON COLUMN article_reviews.article_id          IS 'FK to articles — cascades on delete so rejections are cleaned up with the article';
COMMENT ON COLUMN article_reviews.reviewer_id         IS 'Clerk user ID of the reviewer who rejected; no hard FK since users table is Clerk-managed';
COMMENT ON COLUMN article_reviews.review_feedback  IS 'Mandatory feedback entered by reviewer explaining why the article was rejected';
COMMENT ON COLUMN article_reviews.created_at         IS 'Timestamp of the rejection event';