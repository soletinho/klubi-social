'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  Quote, 
  CheckCircle,
  Pin,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useKlubi } from '@/context/KlubiContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopicDiscussionPage() {
  const params = useParams();
  const communityId = params.id as string;
  const topicId = params.topicId as string;

  const { 
    currentUser, 
    communities, 
    topics, 
    getRepliesByTopic, 
    addReply 
  } = useKlubi();

  const community = communities.find((c) => c.id === communityId);
  const topic = topics.find((t) => t.id === topicId);
  const replies = getRepliesByTopic(topicId);

  const [newReplyContent, setNewReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  if (!community || !topic) {
    return (
      <div className="klubi-card p-12 text-center flex flex-col items-center justify-center gap-3">
        <AlertCircle size={32} className="text-slate-300" />
        <h2 className="text-base font-bold text-slate-800">Tópico não encontrado</h2>
        <p className="text-xs text-slate-500">
          Este tópico não existe ou foi removido.
        </p>
        <Link
          href="/communities"
          className="mt-2 bg-klubi-primary text-white font-semibold text-xs px-4 py-2 rounded-xl"
        >
          Voltar às Comunidades
        </Link>
      </div>
    );
  }

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReplyContent.trim()) return;

    if (!currentUser) {
      alert('Você precisa estar logado para responder ao fórum!');
      return;
    }

    setIsSubmitting(true);
    addReply(topic.id, newReplyContent.trim());
    setNewReplyContent('');
    setIsSubmitting(false);
    showNotice('Sua resposta foi publicada no debate!');
  };

  const handleQuote = (author: string, text: string) => {
    setNewReplyContent((prev) => `${prev}[citação de ${author}]: "${text}"\n\n`);
    const textarea = document.getElementById('reply-editor');
    textarea?.focus();
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/communities" className="hover:text-klubi-primary">
          Comunidades
        </Link>
        <ChevronRight size={13} className="text-slate-400" />
        <Link href={`/communities/${community.id}`} className="hover:text-klubi-primary truncate max-w-xs">
          {community.title}
        </Link>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="text-slate-900 font-semibold truncate max-w-sm">Tópico</span>
      </nav>

      {/* Cabeçalho do Tópico */}
      <div className="klubi-card p-5 bg-gradient-to-r from-blue-50/50 via-white to-pink-50/30">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold text-klubi-primary bg-blue-100/80 px-2 py-0.5 rounded-full uppercase">
                Fórum de Discussão
              </span>
              {topic.isPinned && (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Pin size={10} /> Fixado
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
              {topic.title}
            </h1>

            <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
              <span>Criado por <strong>{topic.authorName}</strong></span>
              <span>•</span>
              <span>{topic.createdAt}</span>
              <span>•</span>
              <span className="text-klubi-secondary font-semibold">
                {replies.length + 1} mensagens no total
              </span>
            </div>
          </div>

          <Link
            href={`/communities/${community.id}`}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 hover:text-klubi-primary font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-white shadow-2xs hover:bg-slate-50 transition"
          >
            <ArrowLeft size={13} />
            <span>Voltar à Comunidade</span>
          </Link>
        </div>
      </div>

      {/* Notificação toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2"
          >
            <CheckCircle size={14} className="text-emerald-600" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista Linear de Mensagens */}
      <div className="flex flex-col gap-3.5">
        {/* Mensagem 0: Abertura do Tópico */}
        <div className="klubi-card border-l-4 border-l-klubi-primary p-4 sm:p-5">
          <div className="flex items-start gap-4">
            <div className="relative w-12 h-12 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-100 shadow-2xs">
              <Image
                src={topic.authorAvatar}
                alt={topic.authorName}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                <div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900">
                    {topic.authorName}
                  </span>
                  <span className="text-[11px] text-slate-400 ml-2">
                    {topic.createdAt}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-klubi-primary bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  Tópico Original (#1)
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {topic.content}
              </p>
            </div>
          </div>
        </div>

        {/* Respostas em Ordem Cronológica */}
        {replies.map((reply, index) => (
          <div key={reply.id} className="klubi-card p-4 sm:p-5">
            <div className="flex items-start gap-4">
              <div className="relative w-11 h-11 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-100 shadow-2xs">
                <Image
                  src={reply.authorAvatar}
                  alt={reply.authorName}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      {reply.authorName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {reply.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuote(reply.authorName, reply.content)}
                      className="text-[11px] text-slate-500 hover:text-klubi-primary flex items-center gap-1 transition"
                      title="Citar resposta"
                    >
                      <Quote size={11} />
                      <span className="hidden sm:inline">citar</span>
                    </button>
                    <span className="text-[11px] font-medium text-slate-400">
                      #{index + 2}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {reply.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor de Resposta */}
      <div className="klubi-card p-4 sm:p-5">
        <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-2 flex items-center gap-2">
          <MessageSquare size={14} className="text-klubi-secondary" />
          <span>Responder a este debate</span>
        </h3>

        <form onSubmit={handleSendReply} className="flex flex-col gap-3">
          <textarea
            id="reply-editor"
            rows={4}
            required
            value={newReplyContent}
            onChange={(e) => setNewReplyContent(e.target.value)}
            placeholder={
              currentUser
                ? 'Compartilhe seu ponto de vista ou experiência com a comunidade...'
                : 'Faça login ou crie sua conta para responder...'
            }
            disabled={!currentUser}
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-klubi-primary/20 focus:border-klubi-primary bg-slate-50/50 disabled:bg-slate-100"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              No Klubi suas conversas são reais e assíncronas.
            </span>

            <button
              type="submit"
              disabled={isSubmitting || !newReplyContent.trim() || !currentUser}
              className="bg-klubi-primary hover:bg-blue-800 disabled:bg-slate-300 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-xs"
            >
              <Send size={13} />
              <span>{isSubmitting ? 'Enviando...' : 'Publicar Resposta'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
