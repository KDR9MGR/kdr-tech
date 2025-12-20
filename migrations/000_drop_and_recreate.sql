-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS team_member_tags CASCADE;
DROP TABLE IF EXISTS team_tags CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS testimonials_video CASCADE;
DROP TABLE IF EXISTS testimonials_text CASCADE;

-- =====================================================
-- 1. TEAM MEMBERS SYSTEM
-- =====================================================

-- Core team members table
CREATE TABLE team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  slug text UNIQUE NOT NULL,
  job_title text NOT NULL,
  department text,
  bio text,
  short_bio text,
  photo_url text,
  avatar_url text,
  order_index integer DEFAULT 999,
  is_featured boolean DEFAULT false,
  social_links jsonb DEFAULT '{}',
  location text,
  email text,
  phone text,
  visible boolean DEFAULT true,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team skills/tags
CREATE TABLE team_tags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Team member tags relationship
CREATE TABLE team_member_tags (
  team_member_id uuid REFERENCES team_members(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES team_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (team_member_id, tag_id)
);

-- =====================================================
-- 2. BLOG SYSTEM
-- =====================================================

CREATE TABLE blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  cover_image text,
  author_id uuid REFERENCES team_members(id),
  category text,
  tags text[],
  status text DEFAULT 'draft',
  published_at timestamptz,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 3. TESTIMONIALS SYSTEM
-- =====================================================

CREATE TABLE testimonials_video (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name text NOT NULL,
  company_name text,
  project_name text,
  video_url text NOT NULL,
  thumbnail_url text,
  country text,
  order_index integer DEFAULT 999,
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE testimonials_text (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name text NOT NULL,
  company_name text,
  project_name text,
  testimonial text NOT NULL,
  avatar_url text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  country text,
  order_index integer DEFAULT 999,
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_member_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials_video ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials_text ENABLE ROW LEVEL SECURITY;

-- Public read access for visible/published content
CREATE POLICY "Public can view visible team members"
  ON team_members FOR SELECT
  USING (visible = true);

CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can view visible video testimonials"
  ON testimonials_video FOR SELECT
  USING (visible = true);

CREATE POLICY "Public can view visible text testimonials"
  ON testimonials_text FOR SELECT
  USING (visible = true);

CREATE POLICY "Public can view all team tags"
  ON team_tags FOR SELECT
  USING (true);

CREATE POLICY "Public can view team member tags"
  ON team_member_tags FOR SELECT
  USING (true);

-- Admin full access (authenticated users)
CREATE POLICY "Authenticated users can do everything on team_members"
  ON team_members FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can do everything on blog_posts"
  ON blog_posts FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can do everything on testimonials_video"
  ON testimonials_video FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can do everything on testimonials_text"
  ON testimonials_text FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage team_tags"
  ON team_tags FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage team_member_tags"
  ON team_member_tags FOR ALL
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 5. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_team_members_slug ON team_members(slug);
CREATE INDEX idx_team_members_visible ON team_members(visible);
CREATE INDEX idx_team_members_order ON team_members(order_index);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at);

CREATE INDEX idx_testimonials_video_visible ON testimonials_video(visible);
CREATE INDEX idx_testimonials_text_visible ON testimonials_text(visible);

-- =====================================================
-- 6. FUNCTIONS FOR AUTO-UPDATING TIMESTAMPS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DONE! Tables recreated with correct schema
-- =====================================================
