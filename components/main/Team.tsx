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
  visible: boolean;
  is_featured: boolean;
  order_index: number;
}

interface TeamMembersResult {
  members: TeamMember[];
  error?: string;
}

async function getTeamMembers(): Promise<TeamMembersResult> {
  try {
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables are not set');
      return {
        members: [],
        error: 'Database configuration missing. Please check environment variables.'
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
        members: [],
        error: `Failed to load team members: ${error.message}`
      };
    }

    if (!data || data.length === 0) {
      console.warn('No team members found in database');
      return {
        members: [],
        error: 'No team members found. Please add team members in the admin panel.'
      };
    }

    return { members: data };
  } catch (error) {
    console.error('Error fetching team members:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      members: [],
      error: `An error occurred while loading team members: ${errorMessage}`
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
      <div id='Team' className="py-12 bg-gray-900">
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
          <div className="mt-10">
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.length > 0 ? (
                  members.map((member) => (
                    <ProfileCard
                      key={member.id}
                      image={member.photo_url || member.avatar_url}
                      name={member.full_name}
                      role={member.job_title}
                      description={member.short_bio || member.bio?.slice(0, 150) + '...'}
                      quote={`#${member.job_title.replace(/\s+/g, '')}`}
                    />
                  ))
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
