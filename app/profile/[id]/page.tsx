'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useKlubi } from '@/context/KlubiContext';
import { UserSidebar } from '@/components/UserSidebar';
import { DegreesOfSeparation } from '@/components/DegreesOfSeparation';
import { SocialReputation } from '@/components/SocialReputation';
import { ProfileTabs } from '@/components/ProfileTabs';
import { Scrapbook } from '@/components/Scrapbook';
import { TestimonialsManager } from '@/components/TestimonialsManager';
import { FriendsGrid } from '@/components/FriendsGrid';
import { CommunitiesGrid } from '@/components/CommunitiesGrid';
import { ArrowLeft, Sparkles, UserCheck, AlertCircle } from 'lucide-react';

export default function UserProfilePage() {
  const params = useParams();
  const profileId = params.id as string;

  const { 
    currentUser, 
    getUserById,
    getScrapsForUser, 
    getTestimonialsForUser, 
    getUserFriends,
    getUserCommunities,
    getReputation,
    recordVisit,
    isFriend
  } = useKlubi();

  const targetUser = getUserById(profileId);
  const isOwnProfile = currentUser?.id === profileId;
  const alreadyFriend = isFriend(profileId);

  // Registra a visita automaticamente se não for o próprio perfil
  useEffect(() => {
    if (targetUser && !isOwnProfile) {
      recordVisit(targetUser.id);
    }
  }, [profileId, isOwnProfile, targetUser]);

  if (!targetUser) {
    return (
      <div className="klubi-card p-12 text-center flex flex-col items-center justify-center gap-3">
        <AlertCircle size={32} className="text-slate-300" />
        <h2 className="text-base font-bold text-slate-800">Perfil não encontrado</h2>
        <p className="text-xs text-slate-500">
          O usuário solicitado ainda não se cadastrou ou o link está incorreto.
        </p>
        <Link
          href="/"
          className="mt-2 bg-klubi-primary text-white text-xs font-semibold px-4 py-2 rounded-xl"
        >
          Voltar à Página Inicial
        </Link>
      </div>
    );
  }

  // Dados reais do perfil visitado
  const userScraps = getScrapsForUser(targetUser.id);
  const userTestimonials = getTestimonialsForUser(targetUser.id);
  const userFriends = getUserFriends(targetUser.id);
  const userCommunities = getUserCommunities(targetUser.id);
  const userReputation = getReputation(targetUser.id);

  // Caminho dinâmico de graus de separação
  const separationPath = isOwnProfile
    ? [{ id: currentUser?.id || 'me', name: 'Você' }]
    : [
        { id: currentUser?.id || 'visitor', name: currentUser ? currentUser.name.split(' ')[0] : 'Visitante' },
        { id: targetUser.id, name: targetUser.name },
      ];

  const scrollToScrap = () => {
    const el = document.getElementById('scraps-section');
    el?.scrollIntoView({ behavior: 'smooth' });
    const textarea = document.getElementById('scrap-text');
    textarea?.focus();
  };

  const scrollToTestimonial = () => {
    const el = document.getElementById('testimonials-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de Visita Social */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium pb-1">
        <Link
          href="/"
          className="hover:text-klubi-primary flex items-center gap-1.5 transition"
        >
          <ArrowLeft size={14} />
          <span>Voltar para {currentUser ? 'Meu Perfil' : 'Página Inicial'}</span>
        </Link>

        {!isOwnProfile && (
          <div className="flex items-center gap-2">
            <span className="text-slate-600">
              Você está visitando o perfil de <strong>{targetUser.name}</strong>
            </span>
            {alreadyFriend ? (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1">
                <UserCheck size={11} /> Seus amigos
              </span>
            ) : (
              <span className="bg-blue-50 text-klubi-primary border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                Visitante
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* =========================================
            COLUNA ESQUERDA (~25%)
           ========================================= */}
        <section className="lg:col-span-3 flex flex-col gap-4 order-1">
          <UserSidebar
            user={targetUser}
            friendsCount={userFriends.length}
            communitiesCount={userCommunities.length}
            scrapsCount={userScraps.length}
            testimonialsCount={userTestimonials.length}
            fansCount={userReputation.fansCount}
            onOpenScrapForm={scrollToScrap}
            onOpenTestimonialForm={scrollToTestimonial}
            isOwnProfile={isOwnProfile}
          />
        </section>

        {/* =========================================
            COLUNA CENTRAL (~50%)
           ========================================= */}
        <section className="lg:col-span-6 flex flex-col gap-4 order-2">
          {/* Banner do Perfil Visitado */}
          <div className="klubi-card p-4 bg-gradient-to-r from-blue-50/70 via-white to-pink-50/50">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-200/80 pb-3 mb-3 gap-1.5">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>{targetUser.name}</span>
                  <span className="text-xs font-semibold text-klubi-secondary bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    @{targetUser.nickname}
                  </span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Membro do Klubi • {targetUser.city}, {targetUser.country}
                </p>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {isOwnProfile ? 'Online agora (Você)' : 'Perfil público'}
              </span>
            </div>

            {/* Frase de Status */}
            <div className="flex items-start gap-2.5 bg-white/90 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-700 shadow-2xs">
              <Sparkles size={16} className="text-klubi-accent shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-semibold">Mensagem de {targetUser.name.split(' ')[0]}:</strong>{' '}
                <span className="italic text-slate-600">
                  &ldquo;{targetUser.statusMessage || 'Sem mensagem no momento.'}&rdquo;
                </span>
              </div>
            </div>
          </div>

          {/* 1. Graus de Conexão Reais */}
          <DegreesOfSeparation
            path={separationPath}
            targetName={targetUser.name}
          />

          {/* 2. Termômetro Social */}
          <SocialReputation
            initialReputation={userReputation}
            userName={targetUser.name}
          />

          {/* 3. Abas de Informação Pessoal */}
          <ProfileTabs user={targetUser} />

          {/* 4. Mural de Recados */}
          <Scrapbook
            initialScraps={userScraps}
            recipientId={targetUser.id}
            recipientName={targetUser.name}
          />

          {/* 5. Depoimentos */}
          <TestimonialsManager
            initialTestimonials={userTestimonials}
            recipientId={targetUser.id}
            recipientName={targetUser.name}
          />
        </section>

        {/* =========================================
            COLUNA DIREITA (~25%)
           ========================================= */}
        <section className="lg:col-span-3 flex flex-col gap-4 order-3">
          <FriendsGrid
            friends={userFriends.map((f) => ({ id: f.id, name: f.name, avatarUrl: f.avatarUrl }))}
            totalFriends={userFriends.length}
          />

          <CommunitiesGrid
            communities={userCommunities.map((c) => ({ id: c.id, title: c.title, imageUrl: c.imageUrl, membersCount: c.membersCount }))}
            totalCommunities={userCommunities.length}
          />
        </section>
      </div>
    </div>
  );
}
