-- KDR Tech — Case Studies, FAQs, and Leads tables
-- Run in Supabase SQL Editor

-- =====================================================
-- 1. CASE STUDIES
-- =====================================================

CREATE TABLE IF NOT EXISTS case_studies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  client_type text NOT NULL,
  country text NOT NULL DEFAULT '',
  flag_emoji text DEFAULT '',
  package_name text,
  price_range text,
  timeline text,
  problem text NOT NULL,
  solution text NOT NULL,
  results jsonb DEFAULT '[]'::jsonb,
  tech_stack text[] DEFAULT '{}',
  image_url text,
  placeholder_description text,
  visible boolean DEFAULT true,
  order_index integer DEFAULT 999,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 2. FAQs
-- =====================================================

CREATE TABLE IF NOT EXISTS faqs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'general',
  visible boolean DEFAULT true,
  order_index integer DEFAULT 999,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 3. LEADS (contact form submissions)
-- =====================================================

CREATE TABLE IF NOT EXISTS leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  app_idea text,
  budget_range text,
  source text DEFAULT 'website',
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 4. ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Public: read visible case studies
CREATE POLICY "Public can view visible case studies"
  ON case_studies FOR SELECT
  USING (visible = true);

-- Authenticated: full access to case studies
CREATE POLICY "Authenticated can manage case studies"
  ON case_studies FOR ALL
  USING (auth.role() = 'authenticated');

-- Public: read visible FAQs
CREATE POLICY "Public can view visible faqs"
  ON faqs FOR SELECT
  USING (visible = true);

-- Authenticated: full access to FAQs
CREATE POLICY "Authenticated can manage faqs"
  ON faqs FOR ALL
  USING (auth.role() = 'authenticated');

-- Public: submit leads (insert only)
CREATE POLICY "Public can submit leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- Authenticated: read all leads
CREATE POLICY "Authenticated can read leads"
  ON leads FOR SELECT
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 5. INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_case_studies_visible ON case_studies(visible);
CREATE INDEX IF NOT EXISTS idx_case_studies_order ON case_studies(order_index);
CREATE INDEX IF NOT EXISTS idx_faqs_visible ON faqs(visible);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(order_index);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

-- =====================================================
-- 6. AUTO-UPDATE updated_at TRIGGER for case_studies
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_case_studies_updated_at ON case_studies;
CREATE TRIGGER update_case_studies_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
