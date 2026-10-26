'use client';

import React from 'react';
import Link from 'next/link';
import { UserCheck, UserX, HeartHandshake, Check, X } from 'lucide-react';
import { useKlubi } from '@/context/KlubiContext';
import { KlubiAvatar } from '@/components/KlubiAvatar';

export const FriendRequestNotifications: React.FC = () => {
  const { 
    currentUser, 
    getPendingReceivedRequests, 
    acceptFriendRequest, 
    rejectFriendRequest 
  } = useKlubi();

  if (!currentUser) return null;

  const pendingRequests = getPendingReceivedRequests();
  if (pendingRequests.length === 0) return null;

  return (
    <div className="klubi-card p-4 bg-gradient-to-r from-emerald-50/80 via-white to-blue-50/80 border border-emerald-300 shadow-sm animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-emerald-100">
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm">
          <HeartHandshake size={17} className="text-emerald-600" />
          <span>Solicitações de Amizade Pendentes ({pendingRequests.length})</span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
          Aguardando sua resposta
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {pendingRequests.map((req) => (
          <div
            key={req.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-emerald-200/80 shadow-2xs"
          >
            <Link
              href={`/profile/${req.senderId}`}
              className="flex items-center gap-3 group min-w-0"
            >
              <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50 group-hover:scale-105 transition-transform">
                <KlubiAvatar src={req.senderAvatar} alt={req.senderName} fill />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-klubi-primary transition truncate">
                  {req.senderName}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">
                  {req.senderNickname ? `@${req.senderNickname} • ` : ''}quer ser seu amigo no Klubi
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => acceptFriendRequest(req.senderId)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Check size={14} />
                <span>Aceitar</span>
              </button>

              <button
                type="button"
                onClick={() => rejectFriendRequest(req.senderId)}
                className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-300 hover:border-rose-300 font-semibold text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                <X size={14} />
                <span>Recusar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
