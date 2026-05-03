-- Migration 011: Analytics CMS tables — projects, support_tickets, pipeline_deals
-- Run in Supabase SQL Editor

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. PROJECTS — internal project tracker (revenue, status, type)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title         text NOT NULL,
  client_name   text NOT NULL,
  project_type  text NOT NULL DEFAULT 'mobile_app', -- mobile_app | website
  package_name  text,
  revenue       numeric(10,2) DEFAULT 0,
  paid_amount   numeric(10,2) DEFAULT 0,
  status        text DEFAULT 'active', -- active | completed | cancelled | on_hold
  country       text DEFAULT '',
  flag_emoji    text DEFAULT '',
  start_date    date,
  end_date      date,
  notes         text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. SUPPORT TICKETS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS support_tickets (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  subject       text NOT NULL,
  client_name   text NOT NULL,
  status        text DEFAULT 'new', -- new | in_progress | resolved | closed
  priority      text DEFAULT 'medium', -- low | medium | high | urgent
  assigned_to   text DEFAULT '',
  description   text DEFAULT '',
  sla_hours     integer DEFAULT 24,
  rating        integer CHECK (rating IS NULL OR (rating BETWEEN 1 AND 5)),
  created_at    timestamptz DEFAULT now(),
  resolved_at   timestamptz,
  updated_at    timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. PIPELINE DEALS — sales pipeline tracker
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pipeline_deals (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name   text NOT NULL,
  company       text DEFAULT '',
  email         text DEFAULT '',
  project_type  text DEFAULT 'mobile_app', -- mobile_app | website
  package_name  text DEFAULT '',
  deal_value    numeric(10,2) DEFAULT 0,
  stage         text DEFAULT 'contacted', -- contacted | discovery | proposal | negotiation | closed_won | closed_lost
  notes         text DEFAULT '',
  created_at    timestamptz DEFAULT now(),
  closed_at     timestamptz,
  updated_at    timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. AUTO-UPDATE TRIGGERS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS support_tickets_updated_at ON support_tickets;
CREATE TRIGGER support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS pipeline_deals_updated_at ON pipeline_deals;
CREATE TRIGGER pipeline_deals_updated_at
  BEFORE UPDATE ON pipeline_deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY — admin-only (no public read)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can manage projects"
  ON projects FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage support_tickets"
  ON support_tickets FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage pipeline_deals"
  ON pipeline_deals FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. SEED — sample data to populate dashboards immediately
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO projects (title, client_name, project_type, package_name, revenue, paid_amount, status, country, flag_emoji, start_date, end_date) VALUES
('FitTrack Pro', 'James Whitfield', 'mobile_app', 'Growth MVP', 7200, 7200, 'completed', 'USA', '🇺🇸', '2025-01-10', '2025-03-21'),
('SwiftShift App', 'Liam O''Brien', 'mobile_app', 'MVP Lite', 3800, 3800, 'completed', 'UK', '🇬🇧', '2025-02-01', '2025-03-14'),
('MediTrack', 'Dr. Priya Nair', 'mobile_app', 'MVP Lite', 4200, 4200, 'completed', 'Canada', '🇨🇦', '2025-02-15', '2025-04-05'),
('Sterling Law Website', 'Sophie Clarke', 'website', 'Dynamic Website', 2900, 2900, 'completed', 'UK', '🇬🇧', '2025-03-01', '2025-03-29'),
('The Gourmet Box Store', 'Rachel Thompson', 'website', 'Dynamic + CMS', 6100, 6100, 'completed', 'Australia', '🇦🇺', '2025-03-10', '2025-05-03'),
('FieldOps SaaS', 'Marcus Webb', 'website', 'Dynamic + CMS', 7800, 5850, 'active', 'USA', '🇺🇸', '2025-04-01', NULL);

INSERT INTO support_tickets (subject, client_name, status, priority, assigned_to, sla_hours, rating) VALUES
('App not loading on iOS 17', 'James Whitfield', 'new', 'urgent', '', 8, NULL),
('Payment gateway error on checkout', 'Rachel Thompson', 'new', 'high', '', 4, NULL),
('Push notification delay on Android', 'Liam O''Brien', 'in_progress', 'medium', 'Arbaz K.', 24, NULL),
('CMS image upload 500 error', 'Sophie Clarke', 'in_progress', 'high', 'Abdul R.', 8, NULL),
('App Store review feedback', 'Marcus Webb', 'resolved', 'low', 'Arbaz K.', 48, 5),
('Stripe webhook config', 'Dr. Priya Nair', 'resolved', 'medium', 'Apoorv P.', 24, 5),
('Figma file access', 'James Whitfield', 'resolved', 'low', 'Bhakti', 24, 4);

INSERT INTO pipeline_deals (client_name, company, email, project_type, package_name, deal_value, stage) VALUES
('Alex Johnson', 'RunnerUp Co.', 'alex@runnerup.com', 'mobile_app', 'MVP Lite', 3500, 'contacted'),
('Emma Davis', 'StyleHub', 'emma@stylehub.io', 'website', 'Dynamic + CMS', 5200, 'discovery'),
('Noah Wilson', 'TechLaunch', 'noah@techlaunch.co', 'mobile_app', 'Growth MVP', 8000, 'proposal'),
('Olivia Brown', 'PetPal UK', 'olivia@petpal.co.uk', 'mobile_app', 'MVP Lite', 4200, 'negotiation'),
('William Taylor', 'ConsultPro', 'will@consultpro.com', 'website', 'Dynamic Website', 2800, 'contacted'),
('Isabella Martinez', 'FreshBox AU', 'bella@freshbox.au', 'website', 'Dynamic + CMS', 6500, 'discovery');
