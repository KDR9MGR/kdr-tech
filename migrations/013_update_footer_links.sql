-- Migration 013: Update social media links in footer_links table

-- 1. Replace Facebook with YouTube
UPDATE footer_links 
SET 
  title = 'YouTube',
  url = 'https://www.youtube.com/@KDRTech',
  icon_name = 'youtube'
WHERE title = 'Facebook' OR icon_name = 'facebook';

-- 2. Update LinkedIn URL
UPDATE footer_links 
SET 
  url = 'https://www.linkedin.com/in/kdr-tech-70a754334/',
  icon_name = 'linkedin'
WHERE title ILIKE '%linkedin%' OR icon_name = 'linkedin';

-- 3. Update Twitter/X URL
UPDATE footer_links 
SET 
  title = 'X (Twitter)',
  url = 'https://x.com/kdr_tech',
  icon_name = 'twitter'
WHERE title ILIKE '%twitter%' OR title ILIKE '%X%' OR icon_name = 'twitter';

-- 4. Ensure YouTube exists if it wasn't there (optional insert if no Facebook was found)
-- This is a fallback in case the Facebook link wasn't found or was already deleted
INSERT INTO footer_links (title, url, category, icon_name, visible, order_index)
SELECT 'YouTube', 'https://www.youtube.com/@KDRTech', 'social', 'youtube', true, 10
WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE icon_name = 'youtube');
