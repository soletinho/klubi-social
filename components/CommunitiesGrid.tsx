'use client';

import React from 'react';
import Image from 'next/image';
import { Compass } from 'lucide-react';
import { CommunitySummary } from '@/types';

interface CommunitiesGridProps {
  communities: CommunitySummary[];
  totalCommunities?: number;
}

export const CommunitiesGrid: React.FC<CommunitiesGridProps> = ({
  communities,
  totalCommunities = 9,
}) => {
  return (
    <div id="communities-section" className="klubi-card">
      <div className="klubi-card-header">
        <div className="flex items-center gap-1.5">
          <Compass size={14} className="text-klubi-secondary" />
          <span>Comunidades ({totalCommunities})</span>
        </div>
        <a href="#communities-section" className="klubi-link text-[11px] font-medium">
          ver todas
        </a>
      </div>

      <div className="p-3.5">
        <div className="grid grid-cols-3 gap-2.5">
          {communities.slice(0, 9).map((comm) => (
            <div
              key={comm.id}
              className="group flex flex-col items-center text-center cursor-pointer"
            >
              <div className="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden group-hover:border-klubi-primary transition shadow-2xs bg-slate-100">
                <Image
                  src={comm.imageUrl}
                  alt={comm.title}
                  fill
                  sizes="64px"
                  className="object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <span
                className="mt-1.5 text-[11px] font-medium leading-tight text-slate-700 group-hover:text-klubi-primary group-hover:underline line-clamp-2 max-w-full"
                title={comm.title}
              >
                {comm.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
