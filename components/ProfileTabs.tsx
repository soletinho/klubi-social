'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { Music, Film, BookOpen, Briefcase, Info } from 'lucide-react';

interface ProfileTabsProps {
  user: User;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'gostos' | 'profissional'>('geral');

  return (
    <div className="klubi-card">
      {/* Abas */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 text-xs px-3 pt-2.5 gap-1.5">
        <button
          onClick={() => setActiveTab('geral')}
          className={`px-3.5 py-2 font-semibold rounded-t-lg transition flex items-center gap-1.5 ${
            activeTab === 'geral'
              ? 'bg-white text-klubi-primary border-t-2 border-t-klubi-primary border-x border-slate-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Info size={14} />
          <span>Geral</span>
        </button>

        <button
          onClick={() => setActiveTab('gostos')}
          className={`px-3.5 py-2 font-semibold rounded-t-lg transition flex items-center gap-1.5 ${
            activeTab === 'gostos'
              ? 'bg-white text-klubi-primary border-t-2 border-t-klubi-primary border-x border-slate-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Music size={14} />
          <span>Gostos & Afinidades</span>
        </button>

        <button
          onClick={() => setActiveTab('profissional')}
          className={`px-3.5 py-2 font-semibold rounded-t-lg transition flex items-center gap-1.5 ${
            activeTab === 'profissional'
              ? 'bg-white text-klubi-primary border-t-2 border-t-klubi-primary border-x border-slate-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase size={14} />
          <span>Profissional</span>
        </button>
      </div>

      <div className="p-4 text-xs">
        {activeTab === 'geral' && (
          <div className="flex flex-col gap-3">
            <div>
              <span className="font-bold text-slate-800 text-xs">Quem sou eu:</span>
              <p className="mt-1 text-slate-600 leading-relaxed bg-slate-50/80 p-3 rounded-lg border border-slate-200">
                {user.bio}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 text-slate-700">
              <div>
                <span className="text-slate-400">Aniversário:</span>{' '}
                <span className="font-semibold text-slate-800">{user.birthday}</span>
              </div>
              <div>
                <span className="text-slate-400">Cidade atual:</span>{' '}
                <span className="font-semibold text-slate-800">{user.city}</span>
              </div>
              <div>
                <span className="text-slate-400">Membro do Klubi desde:</span>{' '}
                <span className="font-semibold text-klubi-primary">Usuário Fundador</span>
              </div>
              <div>
                <span className="text-slate-400">Privacidade:</span>{' '}
                <span className="font-semibold text-slate-800">Perfil público para amigos</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gostos' && (
          <div className="flex flex-col gap-3.5 text-slate-700">
            <div>
              <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <Music size={13} className="text-klubi-secondary" /> Músicas Favoritas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {user.interests.music.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-50 text-klubi-primary border border-blue-200/80 px-2.5 py-1 rounded-full text-xs font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <Film size={13} className="text-rose-500" /> Filmes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {user.interests.movies.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-rose-50 text-rose-800 border border-rose-200/80 px-2.5 py-1 rounded-full text-xs font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <BookOpen size={13} className="text-amber-600" /> Livros:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {user.interests.books.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-1 rounded-full text-xs font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profissional' && (
          <div className="flex flex-col gap-2.5 text-slate-700">
            <div>
              <span className="text-slate-400">Ocupação Atual:</span>{' '}
              <span className="font-bold text-slate-800">{user.occupation}</span>
            </div>
            <div>
              <span className="text-slate-400">Especialidades:</span>{' '}
              <span>Design de interfaces, design systems, front-end moderno e comunidades digitais</span>
            </div>
            <div>
              <span className="text-slate-400">Escolaridade:</span>{' '}
              <span>Graduação em Tecnologia e Mídias Digitais</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
