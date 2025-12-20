-- App Showcase Section
-- For displaying completed app logos with scrolling animation

CREATE TABLE IF NOT EXISTS app_showcase (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  app_name text NOT NULL,
  logo_url text NOT NULL,
  app_url text,
  description text,
  category text, -- 'mobile', 'web', 'desktop', etc.
  scroll_direction text DEFAULT 'left', -- 'left' or 'right'
  scroll_speed integer DEFAULT 20, -- seconds for one full scroll
  visible boolean DEFAULT true,
  order_index integer DEFAULT 999,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_app_showcase_order ON app_showcase(order_index);

-- Enable RLS
ALTER TABLE app_showcase ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view visible apps
CREATE POLICY "Anyone can view visible apps" ON app_showcase
  FOR SELECT USING (visible = true);

-- Policy: Authenticated users can view all apps
CREATE POLICY "Authenticated users can view all apps" ON app_showcase
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can insert apps
CREATE POLICY "Authenticated users can insert apps" ON app_showcase
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can update apps
CREATE POLICY "Authenticated users can update apps" ON app_showcase
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can delete apps
CREATE POLICY "Authenticated users can delete apps" ON app_showcase
  FOR DELETE USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_app_showcase_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_app_showcase_updated_at
  BEFORE UPDATE ON app_showcase
  FOR EACH ROW
  EXECUTE FUNCTION update_app_showcase_updated_at();

-- Sample data (optional - remove if not needed)
INSERT INTO app_showcase (app_name, logo_url, app_url, description, category, scroll_direction, scroll_speed, order_index) VALUES
('Example App 1', 'https://via.placeholder.com/150', 'https://example.com/app1', 'Mobile app for productivity', 'mobile', 'left', 20, 1),
('Example App 2', 'https://via.placeholder.com/150', 'https://example.com/app2', 'Web application', 'web', 'left', 20, 2),
('Example App 3', 'https://via.placeholder.com/150', 'https://example.com/app3', 'Desktop software', 'desktop', 'right', 25, 3);
