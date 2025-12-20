-- Create footer_links table for managing footer navigation and social media links
CREATE TABLE IF NOT EXISTS footer_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  url text NOT NULL,
  category text NOT NULL, -- 'page', 'social', 'other'
  icon_name text, -- For social media icons (e.g., 'facebook', 'twitter', 'linkedin')
  visible boolean DEFAULT true,
  order_index integer DEFAULT 999,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_footer_links_category ON footer_links(category);
CREATE INDEX IF NOT EXISTS idx_footer_links_visible ON footer_links(visible);
CREATE INDEX IF NOT EXISTS idx_footer_links_order ON footer_links(order_index);

-- Enable RLS
ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;

-- Allow public read access to visible links
CREATE POLICY "Public can view visible footer links"
  ON footer_links
  FOR SELECT
  USING (visible = true);

-- Allow authenticated users full access
CREATE POLICY "Authenticated users have full access to footer links"
  ON footer_links
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO footer_links (title, url, category, icon_name, visible, order_index) VALUES
  ('Home', '/', 'page', NULL, true, 1),
  ('About', '/#About', 'page', NULL, true, 2),
  ('Team', '/#Team', 'page', NULL, true, 3),
  ('Projects', '/#Projects', 'page', NULL, true, 4),
  ('Facebook', 'https://www.facebook.com/arbazkdr', 'social', 'facebook', true, 1),
  ('Twitter', 'https://www.twitter.com/arbazkdr', 'social', 'twitter', true, 2),
  ('LinkedIn', 'https://www.linkedin.com/in/arbazkdr/', 'social', 'linkedin', true, 3),
  ('Instagram', 'https://www.instagram.com/arbazkdr', 'social', 'instagram', true, 4);
