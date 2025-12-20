import React from "react";
import {
  RxDiscordLogo,
  RxGithubLogo,
  RxInstagramLogo,
  RxTwitterLogo,
  RxLinkedinLogo,
} from "react-icons/rx";
import { FaYoutube, FaFacebook } from "react-icons/fa";
import { createClient } from "@/lib/supabase/server";

interface FooterLink {
  id: string;
  title: string;
  url: string;
  category: string;
  icon_name: string | null;
  visible: boolean;
  order_index: number;
}

async function getFooterLinks(): Promise<FooterLink[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('footer_links')
      .select('*')
      .eq('visible', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching footer links:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching footer links:', error);
    return [];
  }
}

const getIconComponent = (iconName: string | null) => {
  switch (iconName?.toLowerCase()) {
    case 'youtube':
      return <FaYoutube />;
    case 'github':
      return <RxGithubLogo />;
    case 'discord':
      return <RxDiscordLogo />;
    case 'instagram':
      return <RxInstagramLogo />;
    case 'twitter':
      return <RxTwitterLogo />;
    case 'linkedin':
      return <RxLinkedinLogo />;
    case 'facebook':
      return <FaFacebook />;
    default:
      return null;
  }
};

const Footer = async () => {
  const allLinks = await getFooterLinks();

  // Group links by category
  const linksByCategory = allLinks.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, FooterLink[]>);

  // Get categories in order: page, social, other
  const categories = ['page', 'social', 'other'];
  const categoryTitles: Record<string, string> = {
    page: 'About',
    social: 'Social Media',
    other: 'Community',
  };

  return (
    <div className="w-full h-full bg-transparent text-gray-200 shadow-lg p-[15px] z-10">
      <div className="w-full flex flex-col items-center justify-center m-auto">
        <div className="w-full h-full flex flex-row items-center justify-around flex-wrap">
          {categories.map((category) => {
            const links = linksByCategory[category] || [];
            if (links.length === 0) return null;

            return (
              <div
                key={category}
                className="min-w-[200px] h-auto flex flex-col items-center justify-start"
              >
                <div className="font-bold text-[16px]">
                  {categoryTitles[category] || category}
                </div>
                {links.map((link) => {
                  const Icon = getIconComponent(link.icon_name);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target={link.url.startsWith('http') ? '_blank' : '_self'}
                      rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex flex-row items-center my-[15px] cursor-pointer hover:text-purple-400 transition-colors"
                    >
                      {Icon && Icon}
                      <span className="text-[15px] ml-[6px]">{link.title}</span>
                    </a>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="mb-[20px] text-[15px] text-center">
          &copy; Kdrtech | app_developer_kdr 2024 Inc. All rights reserved
        </div>
      </div>
    </div>
  );
};

export default Footer;
