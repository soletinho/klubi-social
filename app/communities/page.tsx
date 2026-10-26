'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import { Community } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'Todas',
  'Cotidiano & Humor',
  'Música & Cultura',
  'Tecnologia & Web',
  'Cidades & Bairros',
  'Hobbies & Esportes',
];

export default function CommunitiesCatalogPage() {
  const { currentUser, communities, createCommunity } = useKlubi();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('Cotidiano & Humor');
  const [notification, setNotification] = useState<string | null>(null);

  const filteredCommunities = communities.filter((comm) => {
    const matchesCategory =
      selectedCategory === 'Todas' || comm.category === selectedCategory;
    const matchesSearch =
      comm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    if (!currentUser) {
      alert('Você precisa estar logado para criar uma comunidade!');
      return;
    }

    const created = createCommunity(newTitle, newDescription, newCategory);
    setNewTitle('');
    setNewDescription('');
    setIsModalOpen(false);
    showNotice(`Comunidade "${created.title}" criada com sucesso!`);
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

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
            className="self-start md:self-auto bg-klubi-primary hover:bg-blue-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 shrink-0"
          >
            <PlusCircle size={15} />
            <span>Criar Nova Comunidade</span>
          </button>
        </div>

        {/* Notificação dinâmica */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2"
            >
              <Check size={14} className="text-emerald-600" />
              <span>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Barra de Filtros e Busca */}
        <div className="mt-5 flex flex-col md:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200/80">
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-klubi-primary text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar comunidade pelo nome..."
              className="w-full bg-white text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-klubi-primary/20 focus:border-klubi-primary"
            />
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Grid de Comunidades Reais */}
      {filteredCommunities.length === 0 ? (
        <div className="klubi-card p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-klubi-primary flex items-center justify-center">
            <Compass size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Nenhuma comunidade encontrada
          </h3>
          <p className="text-xs text-slate-500 max-w-md">
            Esta rede foi iniciada do zero! Seja o primeiro membro pioneiro a criar uma comunidade temática para reunir seus amigos.
          </p>
          <button
            onClick={() => {
              if (!currentUser) {
                alert('Faça login ou crie sua conta para fundar uma comunidade!');
                return;
              }
              setIsModalOpen(true);
            }}
            className="mt-2 bg-klubi-primary hover:bg-blue-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2"
          >
            <PlusCircle size={15} />
            <span>Fundar a Primeira Comunidade</span>
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
                    <Image
                      src={comm.imageUrl}
                      alt={comm.title}
                      fill
                      sizes="64px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação de Comunidade */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Compass size={17} className="text-klubi-primary" />
                  <span>Criar Nova Comunidade</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="mt-4 flex flex-col gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome da Comunidade:
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Eu amo café antes de falar com pessoas"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-klubi-primary/20 focus:border-klubi-primary"
                    maxLength={70}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Categoria:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-klubi-primary/20 focus:border-klubi-primary bg-white"
                  >
                    {CATEGORIES.filter((c) => c !== 'Todas').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Descrição & Proposta da Comunidade:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Conte sobre o que é esta comunidade, regras de convivência e quem deve participar..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-klubi-primary/20 focus:border-klubi-primary"
                    maxLength={300}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-klubi-primary hover:bg-blue-800 text-white rounded-lg shadow-xs transition"
                  >
                    Fundar Comunidade
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
