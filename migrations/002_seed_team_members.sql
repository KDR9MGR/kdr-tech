-- Seed initial team members from existing static data
-- Run this in Supabase SQL Editor to migrate your team

INSERT INTO team_members (
  full_name,
  slug,
  job_title,
  department,
  bio,
  short_bio,
  photo_url,
  visible,
  is_featured,
  order_index,
  location
) VALUES
-- 1. Arbaz Kudekar - Lead Developer
(
  'Arbaz Kudekar',
  'arbaz-kudekar',
  'Lead Developer',
  'Engineering',
  'Arbaz Kudekar is a seasoned Flutter expert who has been working with the framework since its inception. With a deep understanding of Flutter''s capabilities, Arbaz has successfully delivered numerous high-quality mobile applications. In addition to Flutter, Arbaz has extensive experience with React Native and other mobile application development frameworks, making him a versatile and skilled developer in the mobile app development industry.',
  'Flutter expert with deep understanding of mobile app development, skilled in Flutter, React Native, and cross-platform solutions.',
  '/images/profiles/me.png',
  true,
  true,
  1,
  'Bengaluru, India'
),

-- 2. Shreya - Social Media Manager
(
  'Shreya',
  'shreya',
  'Social Media Manager',
  'Marketing',
  'Shreya is an expert in digital marketing with a proven track record of driving growth through strategic campaigns and data-driven insights. She specializes in SEO, social media marketing, content strategy, and brand positioning, helping businesses achieve their marketing goals and maximize their online presence.',
  'Digital marketing expert specializing in SEO, social media, and strategic campaigns to drive business growth.',
  '/images/profiles/shreya.jpeg',
  true,
  false,
  2,
  'Bengaluru, India'
),

-- 3. Abdul Razak - Manager & Developer
(
  'Abdul Razak',
  'abdul-razak',
  'Manager & Developer',
  'Management',
  'Abdul Razak is a versatile Manager and Developer with over 7 years of experience in leading projects and developing innovative solutions. He has a strong background in Flutter development, Android development, and mobile application development. Razak has successfully managed teams and delivered high-quality products that meet client expectations. His technical skills, combined with his leadership abilities, make him a key player in any development team.',
  '7+ years experience in Flutter, Android development, and team leadership. Delivers high-quality products that exceed expectations.',
  '/images/profiles/Razak.jpg',
  true,
  true,
  3,
  'Bengaluru, India'
),

-- 4. Abdul Kadar - Frontend Developer
(
  'Abdul Kadar',
  'abdul-kadar',
  'Frontend Developer',
  'Engineering',
  'Abdul Kadar is a talented Front-end Designer and Developer specializing in creating visually appealing and highly functional mobile and web applications. With a strong foundation in modern web technologies and a keen eye for design, Abdul excels in crafting user-friendly interfaces that enhance user experience. His expertise in both design and development makes him a versatile and valuable member of the team.',
  'Frontend specialist creating visually appealing, highly functional interfaces with modern web technologies and design expertise.',
  '/images/profiles/kadar.png',
  true,
  false,
  4,
  'Bengaluru, India'
),

-- 5. Apoorv Pandey - Backend Developer
(
  'Apoorv Pandey',
  'apoorv-pandey',
  'Backend Developer',
  'Engineering',
  'Apoorv Pandey is a skilled Backend Developer with over 6 years of experience in building robust and scalable backend systems. He has worked on various projects, including e-commerce platforms, social media applications, and enterprise solutions. Apoorv is proficient in technologies like Node.js, Python, and Java, and has a deep understanding of database management and API development. His ability to design and implement efficient backend architectures ensures the smooth functioning of applications.',
  '6+ years building scalable backend systems with Node.js, Python, Java. Expert in API development and database architecture.',
  '/images/profiles/apoorva.jpg',
  true,
  false,
  5,
  'Bengaluru, India'
),

-- 6. Bhakti - UI/UX Designer
(
  'Bhakti',
  'bhakti',
  'UI/UX Designer',
  'Design',
  'Bhakti is a seasoned UI/UX Designer with over 5 years of experience in crafting intuitive and beautiful user experiences. She has worked on numerous projects, including mobile applications and web platforms, ensuring that users have a seamless and engaging experience. Bhakti is proficient in tools like Figma, Sketch, and Adobe XD, and has a keen eye for detail and aesthetics. Her expertise in user research, wireframing, and prototyping makes her an invaluable asset to any project.',
  '5+ years crafting intuitive user experiences. Expert in Figma, Sketch, Adobe XD with focus on user research and prototyping.',
  '/images/profiles/bhakti.jpg',
  true,
  false,
  6,
  'Bengaluru, India'
);

-- Verify the migration
SELECT full_name, job_title, visible FROM team_members ORDER BY order_index;
