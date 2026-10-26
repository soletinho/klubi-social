'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Search, 
  PlusCircle, 
  Users, 
  Check, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useKlubi } from '@/context/KlubiContext';
import { KlubiAvatar } from '@/components/KlubiAvatar';
import { CreateCommunityModal, COMMUNITY_CATEGORIES } from '@/components/CreateCommunityModal';

const FILTER_CATEGORIES = ['Todas', ...COMMUNITY_CATEGORIES];

export default function CommunitiesCatalogPage() {
  const { currentUser, communities } = useKlubi();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCommunities = communities.filter((comm) => {
    const matchesCategory =
      selectedCategory === 'Todas' || comm.category === selectedCategory;
    const matchesSearch =
      comm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner do Catálogo */}
      <div className="klubi-card p-5 bg-gradient-to-r from-blue-50/70 via-white to-pink-50/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-klubi-primary font-bold text-sm mb-1">
              <Compass size={18} />
              <span>Diretório de Comunidades</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Onde o Klubi se reúne por afinidade
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Crie ou participe de comunidades reais. Debata ideias em fóruns assíncronos e conheça pessoas que compartilham dos seus interesses.
            </p>
          </div>

          <button
            onClick={() => {
              if (!currentUser) {
                alert('Faça login ou crie sua conta para fundar uma comunidade!');
                return;
              }
              setIsModalOpen(true);
            }}
            className="self-start md:self-auto bg-klubi-primary hover:bg-blue-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>Criar Nova Comunidade</span>
          </button>
        </div>

        {/* Barra de Busca e Filtro de Categorias */}
        <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar comunidade por título ou assunto..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-klubi-primary/20 focus:border-klubi-primary transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-klubi-primary text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Comunidades */}
      {filteredCommunities.length === 0 ? (
        <div className="klubi-card p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-klubi-primary flex items-center justify-center">
            <Compass size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {communities.length === 0 ? 'Nenhuma comunidade criada ainda' : 'Nenhuma comunidade encontrada nesta busca'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md">
            {communities.length === 0
              ? 'Esta rede foi iniciada do zero! Seja o primeiro membro pioneiro a criar uma comunidade temática para reunir seus amigos.'
              : 'Tente buscar por outro termo ou selecione a categoria "Todas".'}
          </p>
          <button
            onClick={() => {
              if (!currentUser) {
                alert('Faça login ou crie sua conta para fundar uma comunidade!');
                return;
              }
              setIsModalOpen(true);
            }}
            className="mt-2 bg-klubi-primary hover:bg-blue-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>Fundar Comunidade</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCommunities.map((comm) => (
            <div
              key={comm.id}
              className="klubi-card p-4 flex flex-col justify-between hover:shadow-card hover:-translate-y-0.5 transition-all group"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100 shadow-2xs">
                    <KlubiAvatar
                      src={comm.imageUrl}
                      alt={comm.title}
                      fill
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-klubi-secondary bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      {comm.category}
                    </span>
                    <Link
                      href={`/communities/${comm.id}`}
                      className="mt-1 block font-bold text-sm text-slate-900 group-hover:text-klubi-primary leading-snug line-clamp-2"
                    >
                      {comm.title}
                    </Link>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {comm.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Users size={13} className="text-klubi-secondary" />
                  <span>{comm.membersCount.toLocaleString('pt-BR')} membros</span>
                </div>

                <Link
                  href={`/communities/${comm.id}`}
                  className="text-xs font-semibold text-klubi-primary hover:text-blue-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Acessar</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Reutilizável de Criar Comunidade */}
      <CreateCommunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
