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

async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('visible', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

const Team = async () => {
  const members = await getTeamMembers();

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
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Our Team
            </h2>
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
                      image={member.photo_url}
                      name={member.full_name}
                      role={member.job_title}
                      description={member.short_bio || member.bio.slice(0, 150) + '...'}
                      quote={`#${member.job_title.replace(/\s+/g, '')}`}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-gray-400">Loading team members...</p>
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
