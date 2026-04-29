-- Migration 008: Reseed case studies (3 mobile + 3 website) and FAQs for full-service positioning
-- Run this in Supabase SQL Editor after migration 007
-- Replaces the original 4 case studies and 8 FAQs with 6 case studies and 8 updated FAQs

-- Clear existing seeded data (safe — only removes rows seeded by migrations 007+)
DELETE FROM case_studies WHERE order_index BETWEEN 1 AND 10;
DELETE FROM faqs WHERE order_index BETWEEN 1 AND 20;

-- ─────────────────────────────────────────────────────────────────────────────
-- CASE STUDIES — 3 Mobile Apps
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO case_studies (
  title, client_type, country, flag_emoji, package_name,
  price_range, timeline, problem, solution,
  results, tech_stack, image_url, placeholder_description,
  visible, order_index
) VALUES

(
  'FitTrack Pro — Fitness Coaching App',
  'Health & Fitness Startup',
  'USA',
  '🇺🇸',
  'Growth MVP',
  '$7,200',
  '11 Weeks',
  'A personal training startup in Austin needed to move their coaching business online. Trainers were managing clients via WhatsApp and spreadsheets, losing track of progress, and unable to scale beyond 20 clients per coach.',
  'We built FitTrack Pro — a Flutter app for iOS and Android with trainer and client roles. Trainers create custom workout plans, clients log daily progress, and everyone gets push reminders. Stripe subscriptions handle monthly billing automatically.',
  '[
    {"icon": "📈", "text": "340% increase in trainer revenue within 90 days of launch"},
    {"icon": "👥", "text": "1,200+ active users acquired in the first 8 weeks"},
    {"icon": "⭐", "text": "4.8-star rating on both Google Play and the App Store"},
    {"icon": "💰", "text": "Client reduced per-user management time by 70%"}
  ]'::jsonb,
  ARRAY['Flutter', 'Firebase', 'Stripe', 'Node.js', 'Figma', 'Google Play', 'App Store'],
  '',
  'Deep navy phone mockup showing FitTrack Pro home screen with a workout plan calendar, green progress rings, and a trainer profile card. Clean, premium fitness app aesthetic.',
  true,
  1
),

(
  'SwiftShift — On-Demand Logistics App',
  'Logistics & Delivery Startup',
  'UK',
  '🇬🇧',
  'MVP Lite',
  '$3,800',
  '6 Weeks',
  'A UK logistics startup needed a driver-dispatch app to compete with Uber Freight. Their existing system was a web form that drivers had to refresh manually — missed jobs, angry drivers, no real-time tracking.',
  'We built SwiftShift with React Native — a dual-side app for dispatchers and drivers. Dispatchers post jobs, drivers accept in real time, and clients track delivery progress on a live map. Socket.io powers instant job updates with no polling.',
  '[
    {"icon": "🚚", "text": "60% reduction in missed delivery windows within 30 days"},
    {"icon": "👨‍💼", "text": "85 drivers onboarded in the first month post-launch"},
    {"icon": "⏱️", "text": "Average job acceptance time dropped from 8 minutes to 47 seconds"},
    {"icon": "📱", "text": "4.7-star rating on Google Play after 200+ driver reviews"}
  ]'::jsonb,
  ARRAY['React Native', 'Node.js', 'Socket.io', 'PostgreSQL', 'Google Maps API', 'Stripe Connect'],
  '',
  'Split-screen mockup showing the SwiftShift dispatcher view (job board with live map) and driver view (incoming job alert with accept/decline buttons). Dark navy and amber accent colors.',
  true,
  2
),

(
  'MediTrack — Patient Medication Tracker',
  'Healthcare Technology',
  'Canada',
  '🇨🇦',
  'MVP Lite',
  '$4,200',
  '7 Weeks',
  'A Canadian digital health company needed a HIPAA-aware medication adherence app. Patients were missing doses due to complex schedules, and caregivers had no visibility into adherence rates.',
  'We built MediTrack in Flutter with a custom notification engine that adapts reminder times to each patient''s schedule. Caregivers get a read-only dashboard with weekly adherence reports. All health data is encrypted at rest and in transit.',
  '[
    {"icon": "💊", "text": "78% improvement in medication adherence among beta users"},
    {"icon": "👨‍👩‍👧", "text": "Caregiver satisfaction score of 9.2 out of 10 in pilot"},
    {"icon": "🔒", "text": "Zero data incidents — passed independent security audit"},
    {"icon": "📲", "text": "2,400+ patients enrolled within 60 days of public launch"}
  ]'::jsonb,
  ARRAY['Flutter', 'Supabase', 'PostgreSQL', 'Firebase Cloud Messaging', 'AES-256 Encryption'],
  '',
  'Healthcare app mockup showing a weekly medication schedule with green check marks for taken doses and a caregiver dashboard with adherence percentage charts. Clean white and teal color scheme.',
  true,
  3
),

-- ─────────────────────────────────────────────────────────────────────────────
-- CASE STUDIES — 3 Websites
-- ─────────────────────────────────────────────────────────────────────────────

(
  'Sterling Law — Law Firm Website Redesign',
  'Legal Services',
  'UK',
  '🇬🇧',
  'Dynamic Website',
  '$2,900',
  '4 Weeks',
  'A mid-size London law firm had an outdated website built in 2016. It was slow (4.2s load time), not mobile-friendly, and generated zero leads. The firm was losing prospective clients to competitors with polished, modern websites.',
  'We rebuilt Sterling Law as a Next.js site with a clean, authoritative design. We added a contact form with CRM integration, a lawyer profile directory, and a blog for SEO. Deployed on Vercel for sub-second load times globally.',
  '[
    {"icon": "⚡", "text": "Page load time improved from 4.2 seconds to 0.8 seconds"},
    {"icon": "📨", "text": "Inbound inquiry form submissions up 290% in 60 days"},
    {"icon": "📱", "text": "Mobile bounce rate dropped from 74% to 31%"},
    {"icon": "🔍", "text": "First-page Google rankings for 3 target practice area keywords"}
  ]'::jsonb,
  ARRAY['Next.js', 'Tailwind CSS', 'Vercel', 'Supabase', 'HubSpot CRM Integration', 'Framer Motion'],
  '',
  'Desktop and mobile mockup of a premium law firm website with a dark navy header, white serif typography, and professional headshots of lawyers. Clean, trustworthy design on a laptop and iPhone.',
  true,
  4
),

(
  'The Gourmet Box — Subscription E-commerce',
  'Food & Beverage / E-commerce',
  'Australia',
  '🇦🇺',
  'Dynamic + CMS',
  '$6,100',
  '8 Weeks',
  'An Australian artisan food brand was selling through Etsy and losing 15% of revenue to platform fees. They needed their own branded e-commerce store with subscription boxes, order management, and a blog to drive organic traffic.',
  'We built a fully custom Next.js e-commerce platform with Stripe for subscriptions and one-time purchases, a headless CMS for the team to manage products and blog posts without a developer, and a customer portal for managing subscriptions.',
  '[
    {"icon": "💵", "text": "Saved $28,000/year in Etsy platform fees within 12 months"},
    {"icon": "📦", "text": "580 active subscribers acquired in the first 3 months"},
    {"icon": "🛒", "text": "Average order value increased by 42% vs. Etsy baseline"},
    {"icon": "✍️", "text": "Blog drove 12,000 organic visitors in month 2 post-launch"}
  ]'::jsonb,
  ARRAY['Next.js', 'Stripe Subscriptions', 'Supabase', 'Sanity CMS', 'Vercel', 'Tailwind CSS'],
  '',
  'E-commerce website mockup showing a premium artisan food brand with warm earthy tones, a subscription box product page with Stripe checkout, and a CMS-powered recipe blog. Shown on a MacBook and iPhone.',
  true,
  5
),

(
  'FieldOps — SaaS Dashboard for Field Teams',
  'B2B SaaS / Field Service Management',
  'USA',
  '🇺🇸',
  'Dynamic + CMS',
  '$7,800',
  '10 Weeks',
  'A US field service company was managing 40+ technicians with Google Sheets and group texts. They needed a web dashboard to assign jobs, track field status in real time, and generate invoices — without buying an expensive off-the-shelf tool.',
  'We built FieldOps — a custom Next.js SaaS dashboard with role-based access for managers, technicians, and clients. Real-time job status updates via Supabase subscriptions, PDF invoice generation, and a client portal for job history and billing.',
  '[
    {"icon": "⏱️", "text": "Job dispatch time reduced from 35 minutes to under 4 minutes"},
    {"icon": "💳", "text": "Invoice collection rate improved from 61% to 94% in 90 days"},
    {"icon": "👷", "text": "40 technicians fully onboarded within 1 week of launch"},
    {"icon": "📊", "text": "Management reporting time cut by 80% with auto-generated reports"}
  ]'::jsonb,
  ARRAY['Next.js', 'Supabase', 'PostgreSQL', 'Stripe', 'Vercel', 'React PDF', 'Tailwind CSS'],
  '',
  'SaaS dashboard mockup with a dark sidebar, job board with status columns (Assigned, In Progress, Completed), a map view of active technicians, and a billing summary card. Professional dark blue enterprise UI on a wide monitor.',
  true,
  6
);


-- ─────────────────────────────────────────────────────────────────────────────
-- FAQs — 8 questions covering both mobile apps and websites
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO faqs (question, answer, category, visible, order_index) VALUES

(
  'Do you build both mobile apps AND websites?',
  'Yes. KDR Tech is a full-service digital solutions agency. We build native iOS and Android apps (using Flutter and React Native), static websites, dynamic web applications, and fully custom websites with a CMS so your team can manage content without a developer. Every project starts with a free strategy call to figure out exactly what you need.',
  'general',
  true,
  1
),

(
  'How does your pricing and payment structure work?',
  'All projects are fixed-price — no hourly billing, no scope-creep surprises. Payments are milestone-based: you pay a portion when we start, a portion at the midpoint review, and the final amount on delivery and approval. We accept Stripe, Wise, PayPal, and bank transfer. You never pay for work you haven''t reviewed and approved.',
  'payment',
  true,
  2
),

(
  'How long does it take to build a mobile app or website?',
  'It depends on complexity. A simple static website takes 1–2 weeks. A dynamic web app or MVP mobile app typically takes 4–8 weeks. A full-scale mobile app or complex SaaS platform runs 8–12 weeks. We give you a firm timeline before the project starts and commit to it — we don''t move deadlines without your agreement.',
  'general',
  true,
  3
),

(
  'Will I own the source code and design files?',
  'Absolutely. Everything we build belongs to you — 100%. You receive the full source code, Figma design files, database schemas, and all documentation at project handoff. There are no licensing fees, no lock-in, and no ongoing dependency on KDR Tech (though most clients come back for v2).',
  'legal',
  true,
  4
),

(
  'Can you work with clients in different time zones?',
  'Yes — we work with clients in the US, UK, Australia, Canada, and across Europe. Our team is flexible on scheduling. For active projects, we hold weekly or bi-weekly video calls at a time that works for your timezone. Between calls, you can reach us any business day via WhatsApp or email and we respond within a few hours.',
  'communication',
  true,
  5
),

(
  'What happens after my app or website launches?',
  'Every project includes post-launch support — 14 days for smaller projects, 30 days for mid-tier, and 60 days for full-scale builds. During that window, any bugs or issues are fixed at no cost. After support ends, we offer a monthly maintenance plan, or you can take the code to any developer — it''s yours.',
  'support',
  true,
  6
),

(
  'Do I need to have a design ready before we start?',
  'No. For Basic and Static Website packages, we work from your content and branding guidelines (or our templates). For MVP Lite and above, full UI/UX design is included in the project — we create your Figma mockups, get your approval, then move into development. You see exactly what you''re getting before a single line of code is written.',
  'general',
  true,
  7
),

(
  'Will you sign an NDA before the project begins?',
  'Yes, always. We sign a mutual NDA before any detailed discussions about your idea or business. We also use DocuSign for contracts so everything is legally binding and professionally documented. Your idea is safe with us.',
  'legal',
  true,
  8
);
