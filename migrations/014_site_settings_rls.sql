-- Migration 014: Enable RLS on site_settings
-- Found during security review: site_settings had no RLS policy at all,
-- meaning it wasn't "public by design" so much as unprotected by omission.
-- Current contents are harmless (display config like showcase_scroll_speed),
-- but there was nothing stopping a future write from putting something
-- sensitive there. This makes the public-read intent explicit and locks
-- writes to authenticated users, matching every other table in this schema.
-- Run in Supabase SQL Editor.

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can manage site settings"
  ON site_settings FOR ALL
  USING (auth.role() = 'authenticated');
