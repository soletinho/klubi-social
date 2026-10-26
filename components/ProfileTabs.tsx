'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { Music, Film, BookOpen, Briefcase, Info, Gamepad2, Sparkles } from 'lucide-react';

interface ProfileTabsProps {
  user: User;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'gostos' | 'profissional'>('geral');

  const musicList = user.interests?.music || [];
  const moviesList = user.interests?.movies || [];
  const booksList = user.interests?.books || [];
  const hobbiesList = user.interests?.hobbies || [];

  return (
    <div className="klubi-card">
      {/* Abas */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 text-xs px-3 pt-2.5 gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('geral')}
          className={`px-3.5 py-2 font-semibold rounded-t-lg transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'geral'
              ? 'bg-white text-klubi-primary border-t-2 border-t-klubi-primary border-x border-slate-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Info size={14} />
          <span>Geral</span>
        </button>

        <button
          onClick={() => setActiveTab('gostos')}
          className={`px-3.5 py-2 font-semibold rounded-t-lg transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'gostos'
              ? 'bg-white text-klubi-primary border-t-2 border-t-klubi-primary border-x border-slate-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Music size={14} />
          <span>Gostos & Afinidades</span>
        </button>

        <button
          onClick={() => setActiveTab('profissional')}
          className={`px-3.5 py-2 font-semibold rounded-t-lg transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'profissional'
              ? 'bg-white text-klubi-primary border-t-2 border-t-klubi-primary border-x border-slate-200 shadow-2xs'
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
                {user.bio || 'Nenhuma descrição adicionada ainda.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 text-slate-700">
              <div>
                <span className="text-slate-400">Aniversário:</span>{' '}
                <span className="font-semibold text-slate-800">{user.birthday || 'Não informado'}</span>
              </div>
              <div>
                <span className="text-slate-400">Cidade atual:</span>{' '}
                <span className="font-semibold text-slate-800">{user.city || 'Brasil'}</span>
              </div>
              <div>
                <span className="text-slate-400">Membro do Klubi desde:</span>{' '}
                <span className="font-semibold text-klubi-primary">{user.createdAt || 'Usuário Fundador'}</span>
              </div>
              <div>
                <span className="text-slate-400">Privacidade:</span>{' '}
                <span className="font-semibold text-slate-800">
                  {user.invisibleMode ? 'Modo Fantasma ativado' : 'Perfil público no Klubi'}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gostos' && (
          <div className="flex flex-col gap-3.5 text-slate-700">
            {/* Músicas */}
            <div>
              <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <Music size={13} className="text-klubi-secondary" /> Músicas Favoritas:
              </span>
              {musicList.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {musicList.map((item, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-50 text-klubi-primary border border-blue-200/80 px-2.5 py-1 rounded-full text-xs font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 italic">Nenhuma música adicionada ainda. Adicione em &ldquo;Editar Perfil&rdquo;!</span>
              )}
            </div>

            {/* Filmes */}
            <div>
              <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <Film size={13} className="text-rose-500" /> Filmes:
              </span>
              {moviesList.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {moviesList.map((item, idx) => (
                    <span
                      key={idx}
                      className="bg-rose-50 text-rose-800 border border-rose-200/80 px-2.5 py-1 rounded-full text-xs font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 italic">Nenhum filme ou série adicionado ainda.</span>
              )}
            </div>

            {/* Livros */}
            <div>
              <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <BookOpen size={13} className="text-amber-600" /> Livros:
              </span>
              {booksList.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {booksList.map((item, idx) => (
                    <span
                      key={idx}
                      className="bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-1 rounded-full text-xs font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 italic">Nenhum livro adicionado ainda.</span>
              )}
            </div>

            {/* Hobbies */}
            <div>
              <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <Gamepad2 size={13} className="text-emerald-600" /> Hobbies & Passatempos:
              </span>
              {hobbiesList.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {hobbiesList.map((item, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-full text-xs font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 italic">Nenhum passatempo adicionado ainda.</span>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profissional' && (
          <div className="flex flex-col gap-2.5 text-slate-700">
            <div>
              <span className="text-slate-400">Ocupação Atual:</span>{' '}
              <span className="font-bold text-slate-800">{user.occupation || 'Membro do Klubi'}</span>
            </div>
            <div>
              <span className="text-slate-400">Localização:</span>{' '}
              <span>{user.city}, {user.country}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
