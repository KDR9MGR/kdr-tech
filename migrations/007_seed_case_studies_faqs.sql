-- KDR Tech — Seed data for case_studies and faqs
-- Run AFTER migration 006

-- =====================================================
-- CASE STUDIES
-- =====================================================

INSERT INTO case_studies (title, client_type, country, flag_emoji, package_name, price_range, timeline, problem, solution, results, tech_stack, placeholder_description, visible, order_index) VALUES
(
  'FitTrack Pro',
  'Fitness Startup',
  'USA',
  '🇺🇸',
  'Growth MVP',
  '$7,200',
  '11 Weeks',
  'A Dallas-based fitness coach had 3,000 Instagram followers but no way to monetize them at scale. She was managing workout plans over DMs and collecting payments through Venmo — messy, unscalable, and unprofessional.',
  'We built a Flutter app (iOS + Android) with subscription-based membership ($9.99/mo), personalized workout plan builder, progress photo tracking, in-app messaging between coach and clients, and Stripe billing with auto-renewal.',
  '[
    {"icon": "📱", "text": "2,100+ downloads in first 60 days"},
    {"icon": "💰", "text": "$18,400 MRR within 90 days of launch"},
    {"icon": "⭐", "text": "4.8 stars on App Store (214 ratings)"},
    {"icon": "⏱", "text": "Launched in 11 weeks, on time and on budget"}
  ]'::jsonb,
  ARRAY['Flutter', 'Firebase', 'Stripe', 'Node.js', 'Firestore'],
  'iPhone + Android mockup showing workout dashboard, progress screen, and subscription page. Dark-mode UI with green accent colors.',
  true,
  1
),
(
  'QuickShift',
  'Logistics & Delivery Startup',
  'UK',
  '🇬🇧',
  'MVP Lite',
  '$3,800',
  '6 Weeks',
  'A London-based logistics founder needed a driver dispatch app to replace a WhatsApp group and a spreadsheet. Drivers were missing jobs, customers had no visibility, and the founder was on calls 12 hours a day.',
  'We built a React Native app with two interfaces: a driver app with job alerts, GPS navigation, and status updates; and a customer app with order tracking, ETA, and ratings. Plus an admin panel for dispatch and driver management.',
  '[
    {"icon": "📦", "text": "340% increase in jobs dispatched per day"},
    {"icon": "📞", "text": "Founder''s daily call volume dropped by 80%"},
    {"icon": "🚗", "text": "47 drivers onboarded in first month"},
    {"icon": "⏱", "text": "Delivered in 6 weeks — 3 days ahead of schedule"}
  ]'::jsonb,
  ARRAY['React Native', 'Node.js', 'PostgreSQL', 'Google Maps API', 'Firebase Cloud Messaging', 'Supabase'],
  'Split-screen: driver app map view (left) + customer tracking screen (right). Clean white UI with blue accent.',
  true,
  2
),
(
  'NestMate',
  'PropTech Startup',
  'Australia',
  '🇦🇺',
  'Growth MVP',
  '$9,500',
  '14 Weeks',
  'A Sydney-based founder wanted to build the "Airbnb for shared housing" — connecting young professionals with room rentals in major Australian cities. No dev team, no technical co-founder, tight 4-month deadline.',
  'Full-stack Flutter app with property listing, photo uploads and maps, tenant/landlord dual user roles, Stripe Connect for split payments and deposits, real-time in-app chat, ID verification integration, and a review and rating system.',
  '[
    {"icon": "🏠", "text": "820 listings in first 8 weeks post-launch"},
    {"icon": "👥", "text": "2,600 registered users in Month 1"},
    {"icon": "💸", "text": "$4,200 in platform fees in Month 2"},
    {"icon": "🏆", "text": "Featured in 2 Australian startup newsletters"}
  ]'::jsonb,
  ARRAY['Flutter', 'Firebase', 'Stripe Connect', 'Onfido', 'Google Maps', 'Node.js', 'PostgreSQL'],
  'iPhone mockup of property listing feed, map view, and chat screen. Light mode with coral and navy brand colors.',
  true,
  3
),
(
  'MediRemind',
  'HealthTech',
  'Canada',
  '🇨🇦',
  'MVP Lite',
  '$4,200',
  '7 Weeks',
  'A Canadian pharmacist wanted a medication reminder app for elderly patients. Existing apps were too complex for older users. She needed something clean, accessible, and family-connected.',
  'Flutter app with simple medication schedule setup (voice-guided), push notification reminders with snooze and confirm, a family dashboard with caregiver visibility, missed dose alerts sent to family contacts, and HIPAA-conscious data handling.',
  '[
    {"icon": "💊", "text": "89% daily medication adherence rate (vs 52% baseline)"},
    {"icon": "👨‍👩‍👧", "text": "3 family members connected per user on average"},
    {"icon": "⭐", "text": "4.9 stars on App Store — \"Finally an app my mom can use\""},
    {"icon": "📱", "text": "1,400 active users within 45 days"}
  ]'::jsonb,
  ARRAY['Flutter', 'Firebase', 'Supabase', 'FCM', 'Twilio SMS'],
  'Clean white UI, large typography, showing medication schedule and family dashboard. Accessible design — big buttons, high contrast.',
  true,
  4
);

-- =====================================================
-- FAQs
-- =====================================================

INSERT INTO faqs (question, answer, category, visible, order_index) VALUES
(
  'Do you build for both iOS and Android?',
  'Yes — always. We use Flutter and React Native, which means we write one codebase that runs natively on both iOS and Android. You get two fully functional apps for roughly the cost of one. We also handle App Store and Google Play submission for every project.',
  'general',
  true,
  1
),
(
  'How do payments work? Is it safe?',
  'We use milestone-based payments, which means you pay in stages as work is completed and approved — never upfront for the full project. Payments are processed via Stripe, Wise, or PayPal. We can also sign a formal contract via DocuSign before any work begins.',
  'payment',
  true,
  2
),
(
  'Will I own the source code?',
  '100%. You own the entire codebase, design files, and all assets from day one. We hand over everything at project completion — no subscriptions, no lock-in, no hidden fees. It is your intellectual property.',
  'general',
  true,
  3
),
(
  'How do you handle communication across time zones?',
  'Our team overlaps with US East Coast mornings and UK afternoons. We communicate via WhatsApp, Slack, or email — whichever you prefer. You will receive a video update every Friday and can reach us within 4 hours on any working day.',
  'communication',
  true,
  4
),
(
  'How long does it take to build an app?',
  'Starter projects: 2–4 weeks. MVP Lite: 4–8 weeks. Growth MVP: 8–16 weeks. Timelines depend on scope, not speed-cutting. We do not rush work — we set realistic deadlines and we hit them. Every proposal includes a week-by-week delivery schedule.',
  'general',
  true,
  5
),
(
  'What happens after the app launches?',
  'Every project includes 30–60 days of free post-launch support depending on your package. We fix bugs, handle any App Store rejections, and help you push the first update. If you need ongoing development after that, we offer monthly retainer packages starting at $800/mo.',
  'support',
  true,
  6
),
(
  'Can you work from my existing Figma designs?',
  'Absolutely. If you already have Figma designs, wireframes, or even rough sketches, we will build directly from them. If you do not have designs yet, our UI/UX designers create them in Figma as part of the project — you approve every screen before development starts.',
  'general',
  true,
  7
),
(
  'Do you sign NDAs?',
  'Yes — on request, we sign an NDA before any project discussion begins. Your idea is safe with us. We also never publicly share client projects without written permission.',
  'legal',
  true,
  8
);
