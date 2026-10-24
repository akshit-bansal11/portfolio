-- Resume revisions for the /resume editor. Paste into the Cloudflare D1 console.
-- Append-only: every save inserts a row and the highest id is the live resume,
-- so history is free. To restore, re-insert an older body:
--   INSERT INTO resume_revisions (body, created_at)
--     SELECT body, unixepoch() * 1000 FROM resume_revisions WHERE id = <old id>;

CREATE TABLE IF NOT EXISTS resume_revisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
