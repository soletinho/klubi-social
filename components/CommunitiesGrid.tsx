'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, PlusCircle } from 'lucide-react';
import { CommunitySummary } from '@/types';
import { KlubiAvatar } from '@/components/KlubiAvatar';
import { CreateCommunityModal } from '@/components/CreateCommunityModal';

interface CommunitiesGridProps {
  communities: CommunitySummary[];
  totalCommunities?: number;
  canCreate?: boolean;
}

export const CommunitiesGrid: React.FC<CommunitiesGridProps> = ({
  communities,
  totalCommunities = 0,
  canCreate = true,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <div id="communities-section" className="klubi-card">
        <div className="klubi-card-header">
          <div className="flex items-center gap-1.5">
            <Compass size={14} className="text-klubi-secondary" />
            <span>Comunidades ({totalCommunities})</span>
          </div>
          <div className="flex items-center gap-2">
            {canCreate && (
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="text-klubi-primary hover:text-blue-800 text-[11px] font-bold flex items-center gap-0.5 cursor-pointer"
                title="Criar nova comunidade"
              >
                <PlusCircle size={12} />
                <span>criar</span>
              </button>
            )}
            <Link href="/communities" className="klubi-link text-[11px] font-medium">
              ver todas
            </Link>
          </div>
        </div>

        <div className="p-3.5">
          {communities.length === 0 ? (
            <div className="py-6 px-3 text-center flex flex-col items-center justify-center gap-2 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
              <Compass size={24} className="text-slate-300" />
              <p className="text-xs text-slate-500 font-medium">
                Nenhuma comunidade ainda.
              </p>
              {canCreate && (
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(true)}
                  className="mt-1 bg-klubi-primary hover:bg-blue-800 text-white font-semibold text-[11px] px-3 py-1.5 rounded-lg transition shadow-2xs flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle size={12} />
                  <span>Criar Comunidade</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              {communities.slice(0, 9).map((comm) => (
                <Link
                  key={comm.id}
                  href={`/communities/${comm.id}`}
                  className="group flex flex-col items-center text-center cursor-pointer"
                  title={`Visitar comunidade: ${comm.title}`}
                >
                  <div className="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden group-hover:border-klubi-primary transition shadow-2xs bg-slate-100">
                    <KlubiAvatar
                      src={comm.imageUrl}
                      alt={comm.title}
                      fill
                      className="group-hover:scale-110 transition duration-300"
                    />
                  </div>
                  <span
                    className="mt-1.5 text-[11px] font-medium leading-tight text-slate-700 group-hover:text-klubi-primary group-hover:underline line-clamp-2 max-w-full"
                    title={comm.title}
                  >
                    {comm.title}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateCommunityModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </>
  );
};
