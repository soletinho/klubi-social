'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  UserPlus, 
  UserCheck,
  MessageSquare, 
  FileHeart, 
  Eye, 
  Users, 
  Compass, 
  ShieldAlert, 
  HeartHandshake,
  MapPin,
  Edit3,
  Camera,
  UserX
} from 'lucide-react';
import { User } from '@/types';
import { useKlubi } from '@/context/KlubiContext';
import { KlubiAvatar } from '@/components/KlubiAvatar';
import { EditProfileModal } from '@/components/EditProfileModal';

interface UserSidebarProps {
  user: User;
  friendsCount?: number;
  communitiesCount?: number;
  scrapsCount?: number;
  testimonialsCount?: number;
  fansCount?: number;
  onOpenScrapForm?: () => void;
  onOpenTestimonialForm?: () => void;
  isOwnProfile?: boolean;
}

const statusMap: Record<User['relationshipStatus'], { label: string; color: string }> = {
  single: { label: 'Solteiro(a)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  dating: { label: 'Namorando', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  married: { label: 'Casado(a)', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  complicated: { label: 'Em um caso complicado', color: 'bg-amber-50 text-amber-800 border-amber-200' },
};

export const UserSidebar: React.FC<UserSidebarProps> = ({
  user,
  friendsCount = 0,
  communitiesCount = 0,
  scrapsCount = 0,
  testimonialsCount = 0,
  fansCount = 0,
  onOpenScrapForm,
  onOpenTestimonialForm,
  isOwnProfile = true,
}) => {
  const { isFriend, toggleFriendship } = useKlubi();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const alreadyFriend = isFriend(user.id);

  const handleToggleFriend = () => {
    const isNow = toggleFriendship(user.id);
    if (isNow) {
      alert(`Você e ${user.name} agora são amigos no Klubi! 🎉`);
    } else {
      alert(`Você desfez a amizade com ${user.name}.`);
    }
  };

  return (
    <>
      <aside className="w-full flex flex-col gap-3.5">
        {/* Card Principal: Avatar e Perfil */}
        <div className="klubi-card p-4 flex flex-col items-center text-center">
          <div className="relative w-44 h-44 rounded-xl overflow-hidden border border-klubi-border shadow-md bg-slate-100 group">
            <KlubiAvatar
              src={user.avatarUrl}
              alt={user.name}
              fill
              className="group-hover:scale-105 transition-transform duration-300"
              priority
            />
            {isOwnProfile && (
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="absolute inset-x-0 bottom-0 py-2 bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity backdrop-blur-2xs cursor-pointer"
              >
                <Camera size={13} />
                <span>Trocar foto / avatar</span>
              </button>
            )}
          </div>

          <h2 className="mt-3.5 font-bold text-base text-slate-900 leading-tight">
            {user.name}
          </h2>
          <span className="text-xs text-slate-500 font-medium mt-0.5">@{user.nickname}</span>

          {/* Status de relacionamento */}
          <div className="mt-2.5 w-full flex items-center justify-center">
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                statusMap[user.relationshipStatus]?.color || 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              {statusMap[user.relationshipStatus]?.label || 'Não informado'}
            </span>
          </div>

          {/* Localização e Frase de Status */}
          <div className="mt-3 w-full flex flex-col gap-1.5 text-xs text-slate-600">
            <div className="flex items-center justify-center gap-1 text-slate-500">
              <MapPin size={12} className="text-slate-400" />
              <span>{user.city}, {user.country}</span>
            </div>
            {user.statusMessage && (
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2 text-[11px] text-amber-900 italic leading-snug">
                &ldquo;{user.statusMessage}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Card de Contadores & Navegação Social */}
        <div className="klubi-card">
          <div className="klubi-card-header">
            <span>{isOwnProfile ? 'Minha Rede no Klubi' : `Rede de ${user.name.split(' ')[0]}`}</span>
            <Users size={14} className="text-klubi-primary" />
          </div>
          <ul className="divide-y divide-slate-100 text-xs font-medium">
            <li>
              <a
                href="#scraps-section"
                className="flex items-center justify-between px-3.5 py-2.5 text-slate-700 hover:bg-slate-50/80 transition"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-klubi-secondary" />
                  <span>Mural de Recados</span>
                </div>
                <span className="bg-klubi-light text-klubi-primary px-2 py-0.5 rounded-full font-bold text-[11px]">
                  {scrapsCount}
                </span>
              </a>
            </li>
            <li>
              <a
                href="#testimonials-section"
                className="flex items-center justify-between px-3.5 py-2.5 text-slate-700 hover:bg-slate-50/80 transition"
              >
                <div className="flex items-center gap-2">
                  <FileHeart size={14} className="text-klubi-accent" />
                  <span>Depoimentos</span>
                </div>
                <span className="bg-rose-50 text-klubi-accent px-2 py-0.5 rounded-full font-bold text-[11px]">
                  {testimonialsCount}
                </span>
              </a>
            </li>
            <li>
              <a
                href="#friends-section"
                className="flex items-center justify-between px-3.5 py-2.5 text-slate-700 hover:bg-slate-50/80 transition"
              >
                <div className="flex items-center gap-2">
                  <HeartHandshake size={14} className="text-klubi-primary" />
                  <span>Amigos</span>
                </div>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold text-[11px]">
                  {friendsCount}
                </span>
              </a>
            </li>
            <li>
              <Link
                href="/communities"
                className="flex items-center justify-between px-3.5 py-2.5 text-slate-700 hover:bg-slate-50/80 transition"
              >
                <div className="flex items-center gap-2">
                  <Compass size={14} className="text-klubi-secondary" />
                  <span>Comunidades</span>
                </div>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold text-[11px]">
                  {communitiesCount}
                </span>
              </Link>
            </li>
            {isOwnProfile && (
              <li>
                <a
                  href="/visitors"
                  className="flex items-center justify-between px-3.5 py-2.5 text-slate-700 hover:bg-slate-50/80 transition"
                >
                  <div className="flex items-center gap-2">
                    <Eye size={14} className="text-emerald-600" />
                    <span>Quem me visitou</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                    Ativo
                  </span>
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Ações Rápidas de Perfil */}
        <div className="klubi-card p-3 flex flex-col gap-2 text-xs">
          {/* Botão de Amizade para Perfil de Terceiros */}
          {!isOwnProfile && (
            <button
              onClick={handleToggleFriend}
              className={`w-full py-2 px-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                alreadyFriend
                  ? 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700 border border-slate-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              {alreadyFriend ? (
                <>
                  <UserCheck size={14} className="text-emerald-600" />
                  <span>Amigos no Klubi ✓</span>
                </>
              ) : (
                <>
                  <UserPlus size={14} />
                  <span>Adicionar aos Amigos</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onOpenScrapForm}
            className="w-full bg-klubi-primary hover:bg-blue-800 text-white py-2 px-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition shadow-xs"
          >
            <MessageSquare size={14} />
            <span>{isOwnProfile ? 'Escrever no Meu Mural' : `Deixar Recado para ${user.name.split(' ')[0]}`}</span>
          </button>

          <button
            onClick={onOpenTestimonialForm}
            className="w-full bg-white hover:bg-rose-50/60 text-klubi-accent border border-rose-200 py-2 px-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
          >
            <FileHeart size={14} />
            <span>Escrever Depoimento</span>
          </button>

          {isOwnProfile ? (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400 px-1">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="hover:text-klubi-primary text-slate-600 font-medium cursor-pointer flex items-center gap-1 transition"
              >
                <Edit3 size={11} /> Editar Perfil
              </button>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="hover:text-slate-700 text-slate-400 cursor-pointer flex items-center gap-1 transition"
              >
                <ShieldAlert size={11} /> Privacidade
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400 px-1">
              <span className="hover:text-slate-600 cursor-pointer flex items-center gap-1">
                <Compass size={11} /> Ver Comunidades em Comum
              </span>
              <span className="hover:text-rose-500 cursor-pointer flex items-center gap-1">
                <ShieldAlert size={11} /> Denunciar Perfil
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* Modal de Edição de Perfil */}
      {isOwnProfile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
};
