-- Migration: 006_create_tech_talks
-- Description: Tech talk events managed exclusively by admins

CREATE TYPE tech_talk_status AS ENUM ('draft', 'published', 'unpublished');

CREATE TABLE tech_talks (
    id                  UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(500)     NOT NULL,
    description         TEXT,
    presenters          TEXT[]           NOT NULL DEFAULT '{}',
    event_date          TIMESTAMP        NOT NULL,
    slides_url          TEXT,
    youtube_iframe_url  TEXT,
    tech_talks_status   tech_talk_status NOT NULL DEFAULT 'draft',
    created_by          UUID             NOT NULL REFERENCES neon_auth.user(id) ON DELETE RESTRICT,
    deleted_at          TIMESTAMP,                          -- soft delete
    created_at          TIMESTAMP        NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP        NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tech_talks_status      ON tech_talks (tech_talks_status);
CREATE INDEX idx_tech_talks_event_date  ON tech_talks (event_date DESC);
CREATE INDEX idx_tech_talks_created_by  ON tech_talks (created_by);
CREATE INDEX idx_tech_talks_deleted_at  ON tech_talks (deleted_at);
-- Active published events (default listing view)
CREATE INDEX idx_tech_talks_published   ON tech_talks (event_date DESC)
    WHERE tech_talks_status = 'published' AND deleted_at IS NULL;

COMMENT ON TABLE  tech_talks                   IS 'Tech talk events created and managed by admin users only';
COMMENT ON COLUMN tech_talks.presenters        IS 'Array of presenter names; normalise to a separate table if presenter profiles are needed later';
COMMENT ON COLUMN tech_talks.youtube_iframe_url IS 'Full YouTube embed URL rendered as an iframe on the event page';
COMMENT ON COLUMN tech_talks.tech_talks_status            IS 'draft → published; hidden hides from users without deleting';
