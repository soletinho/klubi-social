'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, 
  Users, 
  Compass, 
  UserCheck, 
  UserPlus, 
  ArrowRight, 
  Sparkles, 
  PlusCircle,
  MapPin
} from 'lucide-react';
import { useKlubi } from '@/context/KlubiContext';
import { KlubiAvatar } from '@/components/KlubiAvatar';
import { CreateCommunityModal } from '@/components/CreateCommunityModal';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const { 
    currentUser, 
    getAllUsers, 
    communities, 
    isFriend, 
    toggleFriendship, 
    isCommunityMember, 
    toggleCommunityMembership 
  } = useKlubi();

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'communities'>('all');
  const [isCreateCommOpen, setIsCreateCommOpen] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const cleanQ = query.trim().toLowerCase();

  // Busca em usuários
  const allUsers = getAllUsers();
  const matchedUsers = cleanQ
    ? allUsers.filter((u) => {
        return (
          u.name.toLowerCase().includes(cleanQ) ||
          u.nickname.toLowerCase().includes(cleanQ) ||
          (u.city && u.city.toLowerCase().includes(cleanQ)) ||
          (u.bio && u.bio.toLowerCase().includes(cleanQ)) ||
          (u.occupation && u.occupation.toLowerCase().includes(cleanQ))
        );
      })
    : [];

  // Busca em comunidades
  const matchedCommunities = cleanQ
    ? communities.filter((c) => {
        return (
          c.title.toLowerCase().includes(cleanQ) ||
          c.description.toLowerCase().includes(cleanQ) ||
          c.category.toLowerCase().includes(cleanQ)
        );
      })
    : [];

  const totalResults = matchedUsers.length + matchedCommunities.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Banner de Busca */}
      <div className="klubi-card p-5 bg-gradient-to-r from-blue-50/70 via-white to-pink-50/40">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-klubi-primary font-bold text-sm">
            <Search size={18} />
            <span>Busca Global no Klubi</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Encontre amigos, conhecidos e comunidades
          </h1>

          <form onSubmit={handleSearchSubmit} className="mt-2 flex gap-2">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite um nome, @apelido, cidade, interesse ou comunidade..."
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-klubi-primary/30 focus:border-klubi-primary transition shadow-2xs font-medium"
              />
            </div>
            <button
              type="submit"
              className="bg-klubi-primary hover:bg-blue-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Search size={14} />
              <span>Buscar</span>
            </button>
          </form>

          {/* Abas de Filtro */}
          {cleanQ && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeTab === 'all'
                    ? 'bg-klubi-primary text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Todos ({totalResults})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('people')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                  activeTab === 'people'
                    ? 'bg-klubi-primary text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Users size={13} />
                <span>Pessoas ({matchedUsers.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('communities')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                  activeTab === 'communities'
                    ? 'bg-klubi-primary text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Compass size={13} />
                <span>Comunidades ({matchedCommunities.length})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mensagem quando não digitou nada */}
      {!cleanQ && (
        <div className="klubi-card p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-klubi-primary flex items-center justify-center">
            <Search size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Digite algo no campo acima para começar a busca
          </h3>
          <p className="text-xs text-slate-500 max-w-md">
            Você pode pesquisar pessoas por nome, @apelido, cidade ou profissão, além de encontrar comunidades por nome e categoria.
          </p>
        </div>
      )}

      {/* Resultados da Busca */}
      {cleanQ && (
        <div className="space-y-6">
          {totalResults === 0 ? (
            <div className="klubi-card p-10 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <Search size={24} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                Nenhum resultado encontrado para &ldquo;{query}&rdquo;
              </h3>
              <p className="text-xs text-slate-500 max-w-md">
                Verifique se o nome foi digitado corretamente ou crie você mesmo uma comunidade sobre este assunto!
              </p>
              <button
                type="button"
                onClick={() => setIsCreateCommOpen(true)}
                className="mt-2 bg-klubi-primary hover:bg-blue-800 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle size={14} />
                <span>Fundar Comunidade com este nome</span>
              </button>
            </div>
          ) : (
            <>
              {/* Seção 1: Pessoas */}
              {(activeTab === 'all' || activeTab === 'people') && matchedUsers.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                      <Users size={16} className="text-klubi-primary" />
                      <span>Pessoas Encontradas ({matchedUsers.length})</span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {matchedUsers.map((user) => {
                      const isMe = currentUser?.id === user.id;
                      const alreadyFriend = isFriend(user.id);

                      return (
                        <div
                          key={user.id}
                          className="klubi-card p-3.5 flex items-center justify-between gap-3 hover:shadow-card transition group"
                        >
                          <Link
                            href={isMe ? '/' : `/profile/${user.id}`}
                            className="flex items-center gap-3 min-w-0 flex-1"
                          >
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100 shadow-2xs group-hover:scale-105 transition-transform">
                              <KlubiAvatar src={user.avatarUrl} alt={user.name} fill />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-slate-900 group-hover:text-klubi-primary truncate">
                                  {user.name}
                                </span>
                                {isMe && (
                                  <span className="text-[10px] bg-blue-100 text-klubi-primary font-bold px-1.5 py-0.2 rounded-sm shrink-0">
                                    você
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 font-medium block truncate">
                                @{user.nickname}
                              </span>
                              <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 truncate">
                                <MapPin size={10} />
                                <span>{user.city || 'Brasil'}</span>
                              </div>
                            </div>
                          </Link>

                          {!isMe && (
                            <button
                              type="button"
                              onClick={() => toggleFriendship(user.id)}
                              className={`p-2 rounded-xl text-xs font-semibold shrink-0 transition ${
                                alreadyFriend
                                  ? 'bg-slate-100 text-emerald-700 hover:bg-rose-50 hover:text-rose-700'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              }`}
                              title={alreadyFriend ? 'Amigos no Klubi (Clique para desfazer)' : 'Adicionar aos Amigos'}
                            >
                              {alreadyFriend ? <UserCheck size={16} /> : <UserPlus size={16} />}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Seção 2: Comunidades */}
              {(activeTab === 'all' || activeTab === 'communities') && matchedCommunities.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                      <Compass size={16} className="text-klubi-secondary" />
                      <span>Comunidades Encontradas ({matchedCommunities.length})</span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {matchedCommunities.map((comm) => {
                      const isMember = isCommunityMember(comm.id);

                      return (
                        <div
                          key={comm.id}
                          className="klubi-card p-3.5 flex flex-col justify-between hover:shadow-card transition group"
                        >
                          <div className="flex items-start gap-3 mb-2.5">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100 shadow-2xs group-hover:scale-105 transition-transform">
                              <KlubiAvatar src={comm.imageUrl} alt={comm.title} fill />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-bold text-klubi-secondary uppercase bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full inline-block mb-1">
                                {comm.category}
                              </span>
                              <Link
                                href={`/communities/${comm.id}`}
                                className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-klubi-primary line-clamp-2 leading-snug block"
                              >
                                {comm.title}
                              </Link>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                            {comm.description}
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                              <Users size={12} className="text-klubi-secondary" />
                              <span>{comm.membersCount} membros</span>
                            </span>

                            <Link
                              href={`/communities/${comm.id}`}
                              className="text-xs font-semibold text-klubi-primary hover:text-blue-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                            >
                              <span>Acessar</span>
                              <ArrowRight size={12} />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Modal de Criação de Comunidade */}
      <CreateCommunityModal
        isOpen={isCreateCommOpen}
        onClose={() => setIsCreateCommOpen(false)}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-klubi-primary border-t-transparent animate-spin" />
            <span className="text-xs text-slate-500 font-medium">Buscando no Klubi...</span>
          </div>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
