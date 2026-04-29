-- Migration 009: Seed professional testimonials (3 mobile app + 3 website clients)
-- Run in Supabase SQL Editor

-- Clear existing demo testimonials if any
DELETE FROM testimonials_text WHERE id LIKE 'ttest-%';

INSERT INTO testimonials_text (
  id, client_name, company_name, country, rating, testimonial, visible, order_index
) VALUES

(
  'ttest-001',
  'James Whitfield',
  'FitTrack Pro',
  'USA 🇺🇸',
  5,
  'KDR Tech built our fitness coaching app from scratch in 11 weeks — on time, on budget, and better-looking than anything I had imagined. The weekly Loom updates meant I always knew exactly where we were. We hit 1,200 users in our first two months. I couldn''t recommend them more.',
  true,
  1
),

(
  'ttest-002',
  'Sophie Clarke',
  'Sterling Law LLP',
  'UK 🇬🇧',
  5,
  'Our old website was embarrassing. KDR Tech rebuilt it in 4 weeks and the difference is night and day — fast, professional, and it actually generates leads now. Form submissions are up nearly 300%. The communication throughout was clear and no surprises on the final invoice.',
  true,
  2
),

(
  'ttest-003',
  'Liam O''Brien',
  'SwiftShift Logistics',
  'UK 🇬🇧',
  5,
  'We needed a real-time dispatch app in 6 weeks to secure a pilot contract. KDR Tech delivered with a week to spare. The app is smooth, the drivers love it, and our job acceptance rate went from minutes to seconds. Professional team, honest pricing, and they actually pick up the phone.',
  true,
  3
),

(
  'ttest-004',
  'Rachel Thompson',
  'The Gourmet Box',
  'Australia 🇦🇺',
  5,
  'I was spending $28K a year in Etsy fees. KDR Tech built us a full e-commerce site with Stripe subscriptions in 8 weeks. It looks premium, the CMS means I update it myself, and we''ve already signed up 580 subscribers. Best investment we''ve made as a business.',
  true,
  4
),

(
  'ttest-005',
  'Dr. Priya Nair',
  'MediTrack Health',
  'Canada 🇨🇦',
  5,
  'Building a healthcare app with strict data requirements was daunting. KDR Tech walked us through every decision, explained the security approach clearly, and delivered an app that passed our independent audit first time. Our pilot users love it. A genuinely trustworthy team.',
  true,
  5
),

(
  'ttest-006',
  'Marcus Webb',
  'FieldOps Software',
  'USA 🇺🇸',
  5,
  'We went from managing 40 technicians in Google Sheets to a fully custom SaaS dashboard in 10 weeks. The impact was immediate — dispatch time dropped from 35 minutes to under 4. The team was responsive, the code is clean, and everything was documented properly for our internal dev team to take over.',
  true,
  6
);
