'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { KlubiAvatar } from '@/components/KlubiAvatar';
import { useParams } from 'next/navigation';
import { 
  Users, 
  MessageSquare, 
  CheckCircle, 
  PlusCircle, 
  BarChart2, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Send,
  AlertCircle
} from 'lucide-react';
import { useKlubi } from '@/context/KlubiContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommunityDetailPage() {
  const params = useParams();
  const communityId = params.id as string;

  const { 
    currentUser, 
    communities, 
    isCommunityMember, 
    toggleCommunityMembership,
    getCommunityMembers,
    getTopicsByCommunity,
    createTopic,
    getPollByCommunity,
    votePoll
  } = useKlubi();

  const community = communities.find((c) => c.id === communityId);
  const isMember = isCommunityMember(communityId);
  const members = getCommunityMembers(communityId);
  const topics = getTopicsByCommunity(communityId);
  const poll = getPollByCommunity(communityId);

  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  if (!community) {
    return (
      <div className="klubi-card p-12 text-center flex flex-col items-center justify-center gap-3">
        <AlertCircle size={32} className="text-slate-300" />
        <h2 className="text-base font-bold text-slate-800">Comunidade não encontrada</h2>
        <p className="text-xs text-slate-500">
          Esta comunidade não existe ou foi removida.
        </p>
        <Link
          href="/communities"
          className="mt-2 bg-klubi-primary text-white font-semibold text-xs px-4 py-2 rounded-xl"
        >
          Voltar ao Catálogo de Comunidades
        </Link>
      </div>
    );
  }

  const handleToggleMembership = () => {
    if (!currentUser) {
      alert('Faça login ou crie sua conta para participar desta comunidade!');
      return;
    }
    const joined = toggleCommunityMembership(community.id);
    if (joined) {
      showNotice('Você agora faz parte desta comunidade! 🎉');
    } else {
      showNotice('Você saiu da comunidade.');
    }
  };

  const handleCreateTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !newTopicContent.trim()) return;

    if (!currentUser) {
      alert('Faça login para abrir um tópico de discussão!');
      return;
    }

    createTopic(community.id, newTopicTitle, newTopicContent);
    setNewTopicTitle('');
    setNewTopicContent('');
    setIsCreatingTopic(false);
    showNotice('Novo debate aberto no fórum da comunidade!');
  };

  const handleVote = (optionId: string) => {
    if (votedOptionId || !poll) return;
    votePoll(poll.id, optionId);
    setVotedOptionId(optionId);
    showNotice('Seu voto na enquete foi computado!');
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/communities" className="hover:text-klubi-primary flex items-center gap-1">
          <ArrowLeft size={13} />
          <span>Comunidades</span>
        </Link>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="text-slate-900 font-semibold truncate max-w-sm">{community.title}</span>
      </nav>

      {/* Hero da Comunidade */}
      <div className="klubi-card p-5 bg-gradient-to-r from-blue-50/60 via-white to-pink-50/40">
        <div className="flex flex-col md:flex-row items-start gap-5">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-slate-200 shrink-0 shadow-md bg-slate-100">
            <Image
              src={community.imageUrl}
              alt={community.title}
              fill
              sizes="(max-width: 768px) 128px, 128px"
              className="object-cover"
              priority
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold text-klubi-secondary bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {community.category}
              </span>
              <span className="text-[11px] text-slate-500">
                Criada em {community.createdAt}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {community.title}
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {community.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs pt-3 border-t border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Users size={14} className="text-klubi-secondary" />
                <span className="font-semibold text-slate-900">{community.membersCount}</span>
                <span>membros</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-600">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Fundador(a):</span>
                <span className="font-semibold text-slate-900">{community.ownerName}</span>
              </div>

              <button
                onClick={handleToggleMembership}
                className={`ml-auto px-4 py-2 rounded-xl text-xs font-semibold transition shadow-xs flex items-center gap-1.5 ${
                  isMember
                    ? 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700 border border-slate-300'
                    : 'bg-klubi-primary hover:bg-blue-800 text-white'
                }`}
              >
                {isMember ? (
                  <>
                    <CheckCircle size={14} className="text-emerald-600" />
                    <span>Membro da Comunidade ✓</span>
                  </>
                ) : (
                  <>
                    <PlusCircle size={14} />
                    <span>Participar da Comunidade</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notificação toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-semibold flex items-center justify-between"
          >
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Principal: Fórum de Discussões (Esquerda) + Enquete & Membros (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Coluna do Fórum (8 colunas) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="klubi-card">
            <div className="klubi-card-header">
              <div className="flex items-center gap-2">
                <MessageSquare size={15} className="text-klubi-secondary" />
                <span className="font-bold text-sm">Fórum de Tópicos ({topics.length})</span>
              </div>
              <button
                onClick={() => {
                  if (!currentUser) {
                    alert('Faça login para abrir um novo tópico!');
                    return;
                  }
                  setIsCreatingTopic(!isCreatingTopic);
                }}
                className="bg-klubi-primary hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
              >
                <PlusCircle size={13} />
                <span>{isCreatingTopic ? 'Fechar' : 'Novo Tópico'}</span>
              </button>
            </div>

            <div className="p-4">
              {/* Formulário de Criação de Tópico */}
              <AnimatePresence>
                {isCreatingTopic && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleCreateTopicSubmit}
                    className="mb-5 bg-slate-50/80 border border-slate-200 rounded-xl p-4 flex flex-col gap-3"
                  >
                    <h3 className="font-bold text-xs text-slate-800">Criar Novo Tópico de Discussão</h3>
                    <div>
                      <input
                        type="text"
                        required
                        value={newTopicTitle}
                        onChange={(e) => setNewTopicTitle(e.target.value)}
                        placeholder="Título do tópico..."
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-klubi-primary/20 focus:border-klubi-primary bg-white"
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <textarea
                        rows={4}
                        required
                        value={newTopicContent}
                        onChange={(e) => setNewTopicContent(e.target.value)}
                        placeholder="Escreva a mensagem de abertura do debate..."
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-klubi-primary/20 focus:border-klubi-primary bg-white"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCreatingTopic(false)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg transition"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-semibold bg-klubi-primary hover:bg-blue-800 text-white rounded-lg transition flex items-center gap-1.5"
                      >
                        <Send size={12} />
                        <span>Publicar Tópico</span>
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Lista Linear de Tópicos */}
              {topics.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs flex flex-col items-center gap-2">
                  <MessageSquare size={24} className="text-slate-300" />
                  <p>Ainda não há tópicos criados nesta comunidade.</p>
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        alert('Faça login para abrir um novo tópico!');
                        return;
                      }
                      setIsCreatingTopic(true);
                    }}
                    className="text-klubi-primary font-semibold hover:underline"
                  >
                    + Criar o primeiro tópico
                  </button>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-slate-100">
                  {topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="py-3.5 flex items-start gap-3.5 group hover:bg-slate-50/50 px-2 rounded-xl transition"
                    >
                      <div className="relative w-10 h-10 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-100 shadow-2xs mt-0.5">
                        <KlubiAvatar
                          src={topic.authorAvatar}
                          alt={topic.authorName}
                          fill
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/communities/${community.id}/topics/${topic.id}`}
                            className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-klubi-primary hover:underline leading-snug line-clamp-2"
                          >
                            {topic.title}
                          </Link>

                          <div className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1">
                            <MessageSquare size={12} className="text-klubi-secondary" />
                            <span>{topic.repliesCount}</span>
                          </div>
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                          <span>Por <strong>{topic.authorName}</strong></span>
                          <span>•</span>
                          <span>{topic.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Lateral: Enquete + Membros (4 colunas) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Enquete Interativa */}
          {poll && (
            <div className="klubi-card">
              <div className="klubi-card-header">
                <div className="flex items-center gap-1.5">
                  <BarChart2 size={14} className="text-klubi-accent" />
                  <span>Enquete Oficial</span>
                </div>
                <span className="text-[10px] text-slate-500">{poll.totalVotes} votos</span>
              </div>

              <div className="p-4 text-xs">
                <h4 className="font-bold text-slate-900 mb-3 leading-snug">
                  {poll.question}
                </h4>

                <div className="flex flex-col gap-2.5">
                  {poll.options.map((opt) => {
                    const percent =
                      poll.totalVotes > 0
                        ? Math.round((opt.votes / poll.totalVotes) * 100)
                        : 0;
                    const isSelected = votedOptionId === opt.id;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleVote(opt.id)}
                        disabled={votedOptionId !== null}
                        className={`text-left p-2.5 rounded-xl border transition flex flex-col gap-1.5 ${
                          isSelected
                            ? 'bg-rose-50/80 border-klubi-accent/50 text-slate-900 font-medium'
                            : 'bg-slate-50/70 border-slate-200 hover:border-klubi-secondary'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="leading-tight">{opt.text}</span>
                          <span className="font-bold text-slate-700 ml-2">{percent}%</span>
                        </div>

                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isSelected ? 'bg-klubi-accent' : 'bg-klubi-secondary'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {votedOptionId && (
                  <p className="mt-2.5 text-[11px] text-emerald-700 font-medium text-center">
                    ✓ Obrigado pelo seu voto!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Membros Ativos */}
          <div className="klubi-card">
            <div className="klubi-card-header">
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-klubi-secondary" />
                <span>Membros ({members.length})</span>
              </div>
            </div>

            <div className="p-3.5">
              {members.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-4">
                  Seja o primeiro membro desta comunidade!
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {members.slice(0, 9).map((member) => (
                    <Link
                      key={member.id}
                      href={`/profile/${member.id}`}
                      className="flex flex-col items-center text-center cursor-pointer group"
                    >
                      <div className="relative w-14 h-14 rounded-xl border border-slate-200 overflow-hidden shadow-2xs group-hover:border-klubi-primary transition">
                        <KlubiAvatar
                          src={member.avatarUrl}
                          alt={member.name}
                          fill
                          className="group-hover:scale-105 transition"
                        />
                      </div>
                      <span className="mt-1 text-[10px] text-slate-600 truncate max-w-full font-medium">
                        {member.name.split(' ')[0]}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
