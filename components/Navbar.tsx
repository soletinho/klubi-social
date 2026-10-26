'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KlubiAvatar } from '@/components/KlubiAvatar';
import { 
  Search, 
  Users, 
  Compass, 
  Eye, 
  LogIn, 
  UserPlus, 
  LogOut,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { useKlubi } from '@/context/KlubiContext';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { currentUser, logout, getAllUsers, communities } = useKlubi();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown se clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanQuery = searchTerm.trim().toLowerCase();

  // Resultados rápidos ao vivo
  const allUsers = getAllUsers();
  const matchedUsers = cleanQuery
    ? allUsers
        .filter(
          (u) =>
            u.name.toLowerCase().includes(cleanQuery) ||
            u.nickname.toLowerCase().includes(cleanQuery) ||
            (u.city && u.city.toLowerCase().includes(cleanQuery))
        )
        .slice(0, 3)
    : [];

  const matchedCommunities = cleanQuery
    ? communities
        .filter(
          (c) =>
            c.title.toLowerCase().includes(cleanQuery) ||
            c.category.toLowerCase().includes(cleanQuery)
        )
        .slice(0, 3)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsDropdownOpen(false);
    setIsMobileSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <header className="bg-klubi-primary text-white sticky top-0 z-50 shadow-md">
      {/* Barra principal superior */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3 sm:gap-4">
        {/* Logo Autoral Klubi */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-klubi-accent to-pink-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
              <span className="text-white font-black text-lg tracking-tighter">k</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white leading-none font-sans">
                klubi<span className="text-klubi-accent">.</span>
              </span>
              <span className="text-[10px] text-blue-200 tracking-wider font-semibold uppercase leading-tight">
                social
              </span>
            </div>
          </Link>

          {/* Links Principais */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            <Link
              href="/"
              className="text-white hover:text-white transition px-2.5 py-1.5 rounded-lg bg-white/15"
            >
              {currentUser ? 'Meu Perfil' : 'Início'}
            </Link>
            <Link
              href="/communities"
              className="text-blue-100 hover:text-white hover:bg-white/10 transition px-2.5 py-1.5 rounded-lg flex items-center gap-1.5"
            >
              <Compass size={13} />
              <span>Comunidades</span>
            </Link>
            <Link
              href="/search"
              className="text-blue-100 hover:text-white hover:bg-white/10 transition px-2.5 py-1.5 rounded-lg flex items-center gap-1.5"
            >
              <Search size={13} />
              <span>Buscar</span>
            </Link>
            {currentUser && (
              <Link
                href="/visitors"
                className="text-blue-100 hover:text-white hover:bg-white/10 transition px-2.5 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                <Eye size={13} />
                <span>Quem Me Viu</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Barra de Pesquisa Desktop com Dropdown Instantâneo */}
        <div ref={dropdownRef} className="flex-1 max-w-sm relative hidden sm:block">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchTerm}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              placeholder="Pesquisar comunidades, amigos..."
              className="w-full bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder-blue-200 focus:placeholder-slate-400 text-xs pl-8 pr-3 py-2 rounded-lg border border-white/20 focus:border-white focus:outline-hidden transition-all"
            />
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-blue-200 pointer-events-none"
            />
          </form>

          {/* Dropdown de Resultados Rápidos */}
          {isDropdownOpen && cleanQuery && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 text-slate-900 overflow-hidden z-50 text-xs animate-in fade-in duration-150">
              {matchedUsers.length === 0 && matchedCommunities.length === 0 ? (
                <div className="p-3.5 text-center text-slate-500">
                  <p className="font-medium">Nenhum resultado rápido.</p>
                  <button
                    onClick={handleSearchSubmit}
                    className="mt-1.5 text-klubi-primary font-bold hover:underline flex items-center justify-center gap-1 mx-auto text-xs"
                  >
                    <span>Fazer busca completa por &ldquo;{searchTerm}&rdquo;</span>
                    <ArrowRight size={11} />
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {/* Pessoas */}
                  {matchedUsers.length > 0 && (
                    <div className="p-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                        <Users size={11} className="text-klubi-primary" />
                        <span>Pessoas</span>
                      </div>
                      {matchedUsers.map((u) => (
                        <Link
                          key={u.id}
                          href={currentUser?.id === u.id ? '/' : `/profile/${u.id}`}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition"
                        >
                          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                            <KlubiAvatar src={u.avatarUrl} alt={u.name} size={32} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs text-slate-800 truncate">
                              {u.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              @{u.nickname} {u.city && `• ${u.city}`}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Comunidades */}
                  {matchedCommunities.length > 0 && (
                    <div className="p-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                        <Compass size={11} className="text-klubi-secondary" />
                        <span>Comunidades</span>
                      </div>
                      {matchedCommunities.map((c) => (
                        <Link
                          key={c.id}
                          href={`/communities/${c.id}`}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition"
                        >
                          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                            <KlubiAvatar src={c.imageUrl} alt={c.title} size={32} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs text-slate-800 truncate">
                              {c.title}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {c.category} • {c.membersCount} membros
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Rodapé de Busca Geral */}
                  <div className="p-2 bg-slate-50 text-center">
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-klubi-primary hover:text-blue-800 font-bold text-xs py-1 flex items-center justify-center gap-1 transition"
                    >
                      <span>Ver todos os resultados para &ldquo;{searchTerm}&rdquo;</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botão de Busca Mobile & Área de Perfil */}
        <div className="flex items-center gap-2">
          {/* Botão de Busca Mobile */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="sm:hidden p-2 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition"
            title="Buscar"
          >
            <Search size={17} />
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-xl border border-white/20 transition"
              >
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/60 shrink-0">
                  <KlubiAvatar
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    fill
                  />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-white max-w-[120px] truncate leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-blue-200">
                    @{currentUser.nickname}
                  </span>
                </div>
              </Link>

              <button
                onClick={logout}
                className="text-xs font-semibold bg-white/10 hover:bg-rose-600 text-white px-2.5 py-1.5 rounded-xl border border-white/20 transition flex items-center gap-1 cursor-pointer"
                title="Sair da conta"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-white/15 text-white transition flex items-center gap-1"
              >
                <LogIn size={13} />
                <span>Entrar</span>
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-klubi-accent hover:bg-rose-700 text-white shadow-xs transition flex items-center gap-1"
              >
                <UserPlus size={13} />
                <span>Criar Conta</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Barra de Busca Expansível no Mobile */}
      {isMobileSearchOpen && (
        <div className="sm:hidden px-4 pb-3 pt-1 border-t border-white/10 bg-blue-900/90 animate-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-blue-300"
              />
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar pessoas ou comunidades..."
                className="w-full bg-white text-slate-900 text-xs pl-8 pr-3 py-2 rounded-lg outline-hidden font-medium"
              />
            </div>
            <button
              type="submit"
              className="bg-klubi-accent hover:bg-rose-700 text-white font-bold text-xs px-3 py-2 rounded-lg"
            >
              Buscar
            </button>
          </form>
        </div>
      )}
    </header>
  );
};
