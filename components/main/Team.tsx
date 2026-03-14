import React from "react";
import Head from "next/head";
import ProfileCard from "../sub/ProfileCard";
import { createClient } from "@/lib/supabase/server";

interface TeamMember {
  id: string;
  full_name: string;
  slug: string;
  job_title: string;
  bio: string;
  short_bio: string;
  photo_url: string;
  avatar_url?: string;
  visible: boolean;
  is_featured: boolean;
  order_index: number;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
    github?: string;
  };
}

interface TeamMembersResult {
  members: TeamMember[];
  error?: string;
}

const fallbackTeamMembers: TeamMember[] = [
  {
    id: "fallback-arbaz-kudekar",
    full_name: "Arbaz Kudekar",
    slug: "arbaz-kudekar",
    job_title: "Lead Developer",
    bio: "Arbaz Kudekar is a seasoned Flutter expert who has been working with the framework since its inception. With a deep understanding of Flutter's capabilities, Arbaz has successfully delivered numerous high-quality mobile applications. In addition to Flutter, Arbaz has extensive experience with React Native and other mobile application development frameworks, making him a versatile and skilled developer in the mobile app development industry.",
    short_bio:
      "Flutter expert with deep understanding of mobile app development, skilled in Flutter, React Native, and cross-platform solutions.",
    photo_url: "/images/profiles/me.png",
    visible: true,
    is_featured: true,
    order_index: 1,
    social_links: {},
  },
  {
    id: "fallback-shreya",
    full_name: "Shreya",
    slug: "shreya",
    job_title: "Social Media Manager",
    bio: "Shreya is an expert in digital marketing with a proven track record of driving growth through strategic campaigns and data-driven insights. She specializes in SEO, social media marketing, content strategy, and brand positioning, helping businesses achieve their marketing goals and maximize their online presence.",
    short_bio:
      "Digital marketing specialist focused on SEO, social media marketing, content strategy, and brand positioning.",
    photo_url: "/images/profiles/shreya.jpeg",
    visible: true,
    is_featured: false,
    order_index: 2,
    social_links: {},
  },
  {
    id: "fallback-abdul-razak",
    full_name: "Abdul Razak",
    slug: "abdul-razak",
    job_title: "Manager & Developer",
    bio: "Abdul Razak combines leadership with hands-on development experience. He focuses on project execution, team coordination, and delivering reliable solutions across web and mobile. With strong communication and planning skills, he helps turn requirements into shipped products.",
    short_bio:
      "Manager and developer focused on delivery, coordination, and building reliable web and mobile solutions.",
    photo_url: "/images/profiles/Razak.jpg",
    visible: true,
    is_featured: true,
    order_index: 3,
    social_links: {},
  },
  {
    id: "fallback-abdul-kadar",
    full_name: "Abdul Kadar",
    slug: "abdul-kadar",
    job_title: "Frontend Developer",
    bio: "Abdul Kadar is a frontend developer who focuses on building polished user experiences with modern web technologies. He enjoys turning designs into responsive interfaces, improving performance, and creating reusable UI components.",
    short_bio:
      "Frontend developer focused on responsive UI, performance, and building reusable components.",
    photo_url: "/images/profiles/kadar.png",
    visible: true,
    is_featured: false,
    order_index: 4,
    social_links: {},
  },
  {
    id: "fallback-apoorv-pandey",
    full_name: "Apoorv Pandey",
    slug: "apoorv-pandey",
    job_title: "Backend Developer",
    bio: "Apoorv Pandey is a backend developer who designs APIs and database systems that are secure, scalable, and maintainable. He focuses on clean architecture, data modeling, and building integrations that keep products reliable as they grow.",
    short_bio:
      "Backend developer focused on scalable APIs, secure systems, and maintainable architecture.",
    photo_url: "/images/profiles/apoorva.jpg",
    visible: true,
    is_featured: false,
    order_index: 5,
    social_links: {},
  },
  {
    id: "fallback-bhakti",
    full_name: "Bhakti",
    slug: "bhakti",
    job_title: "UI/UX Designer",
    bio: "Bhakti is a UI/UX designer who crafts intuitive, user-centered experiences. She focuses on research-driven design, clear interaction patterns, and consistent visual systems that make products both beautiful and easy to use.",
    short_bio:
      "UI/UX designer focused on research-driven design, clean interactions, and consistent visual systems.",
    photo_url: "/images/profiles/bhakti.jpg",
    visible: true,
    is_featured: false,
    order_index: 6,
    social_links: {},
  },
];

async function getTeamMembers(): Promise<TeamMembersResult> {
  try {
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return {
        members: fallbackTeamMembers,
      };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('visible', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      return {
        members: fallbackTeamMembers,
      };
    }

    if (!data || data.length === 0) {
      console.warn('No team members found in database');
      return {
        members: fallbackTeamMembers,
      };
    }

    return { members: data };
  } catch (error) {
    console.error('Error fetching team members:', error);
    return {
      members: fallbackTeamMembers,
    };
  }
}

const Team = async () => {
  const result = await getTeamMembers();
  const { members, error } = result;

  return (
    <>
      <Head>
        <title>
          Our Team - Expert Flutter, Android, and Mobile Application Developers
        </title>
        <meta
          name="description"
          content="Meet our team of expert Flutter developers, Android developers, and mobile application developers. Our team has extensive experience in delivering high-quality projects."
        />
        <meta
          name="keywords"
          content="Flutter developer, Android developer, mobile application developer, UI/UX designer, backend developer, project manager"
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Our Team - Expert Flutter, Android, and Mobile Application Developers"
        />
        <meta
          property="og:description"
          content="Meet our team of expert Flutter developers, Android developers, and mobile application developers. Our team has extensive experience in delivering high-quality projects."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.kdrtech.in/team" />
        <meta
          property="og:image"
          content="https://www.kdrtech.in/images/team.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Our Team - Expert Flutter, Android, and Mobile Application Developers"
        />
        <meta
          name="twitter:description"
          content="Meet our team of expert Flutter developers, Android developers, and mobile application developers. Our team has extensive experience in delivering high-quality projects."
        />
        <meta
          name="twitter:image"
          content="https://www.kdrtech.in/images/team.jpg"
        />
      </Head>
      <div id='Team' className="py-12 pb-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Our Team
            </h2> */}
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              Meet the Experts
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-400 lg:mx-auto">
              Our team is the best team in the world.
            </p>
          </div>
          <div className="mt-10 mb-12">
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {members.length > 0 ? (
                  members.map((member) => {
                    // Get primary profile URL (prioritize: portfolio > linkedin > twitter > github)
                    const socialLinks = member.social_links || {};
                    const profileUrl = socialLinks.portfolio || socialLinks.linkedin || socialLinks.twitter || socialLinks.github;

                    return (
                      <ProfileCard
                        key={member.id}
                        image={member.photo_url || member.avatar_url || '/images/default-avatar.png'}
                        name={member.full_name}
                        role={member.job_title}
                        description={member.short_bio || member.bio?.slice(0, 150) + '...'}
                        quote={`#${member.job_title.replace(/\s+/g, '')}`}
                        profileUrl={profileUrl}
                      />
                    );
                  })
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-6 max-w-2xl mx-auto">
                      <svg className="w-12 h-12 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-yellow-400 font-semibold mb-2">No Team Members Found</p>
                      <p className="text-gray-400 text-sm">{error || 'Loading team members...'}</p>
                      {error && error.includes('admin panel') && (
                        <a href="/admin" className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors">
                          Go to Admin Panel
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Team;
