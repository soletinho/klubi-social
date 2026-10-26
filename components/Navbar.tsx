'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { KlubiAvatar } from '@/components/KlubiAvatar';
import { 
  Search, 
  Users, 
  Compass, 
  Eye, 
  LogIn, 
  UserPlus, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useKlubi } from '@/context/KlubiContext';

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useKlubi();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <header className="bg-klubi-primary text-white sticky top-0 z-50 shadow-md">
      {/* Barra principal superior */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo Autoral Klubi */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-klubi-accent to-pink-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
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
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
            <Link
              href="/"
              className="text-white hover:text-white transition px-3 py-1.5 rounded-lg bg-white/15"
            >
              {currentUser ? 'Meu Perfil' : 'Início'}
            </Link>
            <Link
              href="/communities"
              className="text-blue-100 hover:text-white hover:bg-white/10 transition px-3 py-1.5 rounded-lg flex items-center gap-1.5"
            >
              <Compass size={13} />
              <span>Comunidades</span>
            </Link>
            {currentUser && (
              <Link
                href="/visitors"
                className="text-blue-100 hover:text-white hover:bg-white/10 transition px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                <Eye size={13} />
                <span>Quem Me Viu</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Barra de Pesquisa */}
        <div className="flex-1 max-w-sm relative hidden sm:block">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar comunidades, amigos..."
            className="w-full bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder-blue-200 focus:placeholder-slate-400 text-xs pl-8 pr-3 py-2 rounded-lg border border-white/20 focus:border-white focus:outline-none transition-all"
          />
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-blue-200 pointer-events-none"
          />
        </div>

        {/* Área de Autenticação / Perfil do Usuário */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-3">
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
                className="text-xs font-semibold bg-white/10 hover:bg-rose-600 text-white px-2.5 py-1.5 rounded-xl border border-white/20 transition flex items-center gap-1"
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
    </header>
  );
};
