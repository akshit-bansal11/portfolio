-- Blog engagement: likes and comments. Paste into the Cloudflare D1 console.
-- Like count is COUNT(*) per slug, so there is no counter to drift.

CREATE TABLE IF NOT EXISTS post_likes (
  slug TEXT NOT NULL,
  visitor TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (slug, visitor)
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  name TEXT,
  email TEXT,
  body TEXT NOT NULL,
  visitor TEXT NOT NULL,
  hidden INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_comments_slug_hidden_created ON comments (slug, hidden, created_at);
CREATE INDEX IF NOT EXISTS idx_comments_visitor_created ON comments (visitor, created_at);
