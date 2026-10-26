'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  LogIn, 
  UserPlus, 
  Users, 
  MessageSquare, 
  Compass, 
  ShieldCheck, 
  Heart,
  ArrowRight,
  Edit3,
  Camera
} from 'lucide-react';
import { useKlubi } from '@/context/KlubiContext';
import { UserSidebar } from '@/components/UserSidebar';
import { DegreesOfSeparation } from '@/components/DegreesOfSeparation';
import { SocialReputation } from '@/components/SocialReputation';
import { ProfileTabs } from '@/components/ProfileTabs';
import { Scrapbook } from '@/components/Scrapbook';
import { TestimonialsManager } from '@/components/TestimonialsManager';
import { FriendsGrid } from '@/components/FriendsGrid';
import { CommunitiesGrid } from '@/components/CommunitiesGrid';
import { EditProfileModal } from '@/components/EditProfileModal';

export default function HomePage() {
  const { 
    currentUser, 
    isLoadingSession,
    getScrapsForUser, 
    getTestimonialsForUser,
    getUserFriends,
    getUserCommunities,
    getReputation
  } = useKlubi();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoadingSession) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-klubi-primary border-t-transparent animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Carregando o Klubi...</span>
        </div>
      </div>
    );
  }

  // ===============================================================
  // SE O USUÁRIO NÃO ESTIVER LOGADO -> TELA DE ENTRADA / BOAS-VINDAS
  // ===============================================================
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-8">
        {/* Banner Hero */}
        <div className="klubi-card p-8 sm:p-12 text-center bg-gradient-to-b from-blue-50/70 via-white to-pink-50/40 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 mb-4 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
            <Sparkles size={14} className="text-klubi-accent" />
            <span className="text-xs font-semibold text-slate-700">
              A internet dos anos 2000, do seu jeito e do zero
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-2xl mx-auto">
            Conecte-se com amigos e comunidades de verdade.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Sem feeds infinitos de dopamina rápida, sem anúncios invasivos. No Klubi você tem seu mural de recados, depoimentos com moderação, fóruns e laços genuínos.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-klubi-primary hover:bg-blue-800 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <UserPlus size={16} />
              <span>Criar Minha Conta Grátis</span>
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm px-6 py-3 rounded-xl border border-slate-300 transition flex items-center justify-center gap-2 shadow-2xs"
            >
              <LogIn size={16} />
              <span>Já Tenho Conta (Entrar)</span>
            </Link>
          </div>
        </div>

        {/* Pilares da Rede */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="klubi-card p-5 flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-klubi-primary flex items-center justify-center mb-1">
              <MessageSquare size={20} />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Mural de Recados & Depoimentos</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mural público para os amigos deixarem scraps carinhosos e área de depoimentos com aprovação prévia.
            </p>
          </div>

          <div className="klubi-card p-5 flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-klubi-accent flex items-center justify-center mb-1">
              <Compass size={20} />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Comunidades & Fóruns Reais</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Crie comunidades temáticas sobre o que você ama, abra debates assíncronos e crie enquetes com votação.
            </p>
          </div>

          <div className="klubi-card p-5 flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-1">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Quem Me Viu & Modo Fantasma</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Saiba quem visitou seu perfil com a clássica regra de reciprocidade: quer ficar invisível? Não verá quem te viu!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===============================================================
  // USUÁRIO LOGADO -> MEU PERFIL REAL (DO ZERO)
  // ===============================================================
  const userScraps = getScrapsForUser(currentUser.id);
  const userTestimonials = getTestimonialsForUser(currentUser.id);
  const userFriends = getUserFriends(currentUser.id);
  const userCommunities = getUserCommunities(currentUser.id);
  const userReputation = getReputation(currentUser.id);

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* =========================================
          COLUNA ESQUERDA (~25%)
         ========================================= */}
      <section className="lg:col-span-3 flex flex-col gap-4 order-1">
        <UserSidebar
          user={currentUser}
          friendsCount={userFriends.length}
          communitiesCount={userCommunities.length}
          scrapsCount={userScraps.length}
          testimonialsCount={userTestimonials.length}
          fansCount={userReputation.fansCount}
          onOpenScrapForm={scrollToScrap}
          onOpenTestimonialForm={scrollToTestimonial}
          isOwnProfile={true}
        />
      </section>

      {/* =========================================
          COLUNA CENTRAL (~50%)
         ========================================= */}
      <section className="lg:col-span-6 flex flex-col gap-4 order-2">
        {/* Banner do Perfil Real */}
        <div className="klubi-card p-4 bg-gradient-to-r from-blue-50/70 via-white to-pink-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 pb-3 mb-3 gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>{currentUser.name}</span>
                <span className="text-xs font-semibold text-klubi-secondary bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  @{currentUser.nickname}
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Membro do Klubi • {currentUser.city}, {currentUser.country}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="bg-klubi-primary hover:bg-blue-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 size={13} />
                <span>Editar Perfil</span>
              </button>
              <span className="text-xs text-emerald-600 font-medium hidden sm:flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Online
              </span>
            </div>
          </div>

          {/* Pensamento / Sorte de Hoje ou Chamada para Completar Perfil */}
          {(!currentUser.interests?.music?.length && !currentUser.interests?.movies?.length) ? (
            <div className="flex items-start justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <Sparkles size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Complete seu perfil no Klubi!</strong>{' '}
                  <span className="text-amber-800">
                    Assim como no Orkut clássico, adicione sua foto, suas bandas favoritas, filmes e seu status de hoje.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition"
              >
                Completar agora
              </button>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 bg-white/90 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-700 shadow-2xs">
              <Sparkles size={16} className="text-klubi-accent shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-semibold">Status de hoje:</strong>{' '}
                <span className="italic text-slate-600">
                  &ldquo;{currentUser.statusMessage || 'Conectado no Klubi!'}&rdquo;
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 1. Graus de Conexão */}
        <DegreesOfSeparation
          path={[{ id: currentUser.id, name: 'Você' }]}
          targetName={currentUser.name}
        />

        {/* 2. Termômetro Social (Começa do zero) */}
        <SocialReputation
          initialReputation={userReputation}
          userName={currentUser.name}
        />

        {/* 3. Abas de Informação Pessoal */}
        <ProfileTabs user={currentUser} />

        {/* 4. Mural de Recados Real */}
        <Scrapbook
          initialScraps={userScraps}
          recipientId={currentUser.id}
          recipientName={currentUser.name}
        />

        {/* 5. Depoimentos Reais */}
        <TestimonialsManager
          initialTestimonials={userTestimonials}
          recipientId={currentUser.id}
          recipientName={currentUser.name}
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

      {/* Modal de Edição de Perfil */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
