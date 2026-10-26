'use client';

import React from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { FriendSummary } from '@/types';
import { KlubiAvatar } from '@/components/KlubiAvatar';

interface FriendsGridProps {
  friends: FriendSummary[];
  totalFriends?: number;
}

export const FriendsGrid: React.FC<FriendsGridProps> = ({
  friends,
  totalFriends = 9,
}) => {
  return (
    <div id="friends-section" className="klubi-card">
      <div className="klubi-card-header">
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-klubi-secondary" />
          <span>Amigos no Klubi ({totalFriends})</span>
        </div>
        <a href="#friends-section" className="klubi-link text-[11px] font-medium">
          ver todos
        </a>
      </div>

      <div className="p-3.5">
        <div className="grid grid-cols-3 gap-2.5">
          {friends.slice(0, 9).map((friend) => (
            <Link
              key={friend.id}
              href={`/profile/${friend.id}`}
              className="group flex flex-col items-center text-center cursor-pointer"
              title={`Visitar perfil de ${friend.name}`}
            >
              <div className="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden group-hover:border-klubi-primary transition shadow-2xs bg-slate-100">
                <KlubiAvatar
                  src={friend.avatarUrl}
                  alt={friend.name}
                  fill
                  className="group-hover:scale-110 transition duration-300"
                />
              </div>
              <span className="mt-1.5 text-[11px] font-medium text-slate-700 group-hover:text-klubi-primary group-hover:underline truncate max-w-full">
                {friend.name.split(' ')[0]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
