'use client'
import React from 'react';
import Image from 'next/image';

interface ProfileCardProps {
  image: string;
  name: string;
  role: string;
  description: string;
  quote: string;
  profileUrl?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ image, name, role, description, quote, profileUrl }) => {
  const handleClick = () => {
    if (profileUrl) {
      window.open(profileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`max-w-sm bg-[#1A1A2E] rounded-lg shadow-md overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-xl border-4 border-transparent hover:border-indigo-600 ${profileUrl ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
      title={profileUrl ? `Visit ${name}'s profile` : ''}
    >
      <div className="flex justify-center mt-4">
        <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-indigo-600 transition duration-500">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="128px"
          />
        </div>
      </div>
      <div className="p-6 flex flex-col items-center ">
        <h3 className="text-lg leading-6 font-medium text-white mb-2">{name}</h3>
        <div className='py-2 px-4 button-primary text-center text-white cursor-pointer rounded-lg max-w-[200px]'><p className="text-base text-gray-400">{role}</p></div>
        <p className="mt-2 text-sm text-gray-400">{description}</p>
        <p className="mt-2 text-sm text-indigo-400">{quote}</p>
        {profileUrl && (
          <p className="mt-2 text-xs text-purple-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Click to view profile
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
