'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FileHeart, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Send, 
  HeartHandshake, 
  ShieldCheck,
  AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Testimonial } from '@/types';
import { useKlubi } from '@/context/KlubiContext';

interface TestimonialsManagerProps {
  initialTestimonials: Testimonial[];
  recipientId: string;
  recipientName: string;
}

export const TestimonialsManager: React.FC<TestimonialsManagerProps> = ({
  initialTestimonials,
  recipientId,
  recipientName,
}) => {
  const { 
    currentUser, 
    testimonials, 
    addTestimonial, 
    acceptTestimonial, 
    rejectTestimonial 
  } = useKlubi();

  const [activeTab, setActiveTab] = useState<'approved' | 'pending' | 'new'>('approved');
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Filtra depoimentos para este destinatário
  const recipientTestimonials = testimonials.filter((t) => t.recipientId === recipientId);
  const approvedList = recipientTestimonials.filter((t) => t.status === 'ACCEPTED');
  const pendingList = recipientTestimonials.filter((t) => t.status === 'PENDING');

  const handleAccept = (id: string) => {
    acceptTestimonial(id);
    showFeedback('Depoimento aprovado com sucesso! Agora é público no perfil.');
  };

  const handleReject = (id: string) => {
    rejectTestimonial(id);
    showFeedback('Depoimento recusado e removido da moderação.');
  };

  const handleSendTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    if (!currentUser) {
      alert('Você precisa estar logado para enviar um depoimento!');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addTestimonial(recipientId, newContent.trim());
      setNewContent('');
      setIsSubmitting(false);
      setActiveTab('pending');
      showFeedback(`Depoimento enviado por ${currentUser.name}! Aguardando moderação de ${recipientName}.`);
    }, 250);
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div id="testimonials-section" className="klubi-card">
      <div className="klubi-card-header">
        <div className="flex items-center gap-2">
          <FileHeart size={14} className="text-klubi-accent" />
          <span>Depoimentos</span>
        </div>
        <span className="text-[11px] text-slate-500 font-normal">
          Declarações autênticas de carinho e amizade
        </span>
      </div>

      {/* Abas */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 text-xs px-3 pt-2.5 gap-1.5">
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-3.5 py-2 font-semibold rounded-t-lg transition flex items-center gap-1.5 ${
            activeTab === 'approved'
              ? 'bg-white text-klubi-primary border-t-2 border-t-klubi-primary border-x border-slate-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Aprovados</span>
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
            {approvedList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3.5 py-2 font-semibold rounded-t-lg transition flex items-center gap-1.5 ${
            activeTab === 'pending'
              ? 'bg-white text-klubi-accent border-t-2 border-t-klubi-accent border-x border-slate-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock size={12} className={pendingList.length > 0 ? 'text-klubi-accent animate-pulse' : 'text-slate-400'} />
          <span>Fila de Moderação</span>
          {pendingList.length > 0 && (
            <span className="bg-klubi-accent text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
              {pendingList.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('new')}
          className={`px-3.5 py-2 font-semibold rounded-t-lg transition flex items-center gap-1.5 ${
            activeTab === 'new'
              ? 'bg-white text-klubi-secondary border-t-2 border-t-klubi-secondary border-x border-slate-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Escrever Depoimento</span>
        </button>
      </div>

      <div className="p-4">
        {/* Notificação dinâmica */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg text-xs flex items-center gap-2"
            >
              <ShieldCheck size={14} className="text-klubi-secondary shrink-0" />
              <span>{feedback}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab 1: Aprovados */}
        {activeTab === 'approved' && (
          <div>
            {approvedList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs flex flex-col items-center gap-1.5">
                <AlertCircle size={22} className="text-slate-300" />
                <p>Nenhum depoimento aprovado no momento.</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-slate-100">
                {approvedList.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-3.5 flex gap-3.5"
                  >
                    <div className="relative w-11 h-11 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-100 shadow-2xs">
                      <Image
                        src={item.senderAvatar}
                        alt={item.senderName}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between">
                        <Link
                          href={`/profile/${item.senderId}`}
                          className="font-bold text-xs text-klubi-secondary hover:underline cursor-pointer"
                        >
                          {item.senderName}
                        </Link>
                        <span className="text-[10px] text-slate-400">{item.createdAt}</span>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-700 leading-relaxed bg-rose-50/40 border border-rose-100 rounded-xl p-3 italic">
                        &ldquo;{item.content}&rdquo;
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Moderação */}
        {activeTab === 'pending' && (
          <div>
            <div className="mb-3 bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-lg text-xs flex items-center gap-2">
              <ShieldCheck size={14} className="text-amber-700 shrink-0" />
              <span>
                <strong>Painel de Moderação:</strong> Apenas o dono do perfil pode aceitar para publicar ou recusar.
              </span>
            </div>

            {pendingList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                🎉 Sem depoimentos pendentes! Todos os enviados já foram moderados.
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-slate-100">
                <AnimatePresence>
                  {pendingList.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="py-3.5 flex gap-3.5"
                    >
                      <div className="relative w-11 h-11 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-100 shadow-2xs">
                        <Image
                          src={item.senderAvatar}
                          alt={item.senderName}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between">
                          <Link
                            href={`/profile/${item.senderId}`}
                            className="font-bold text-xs text-slate-800 hover:text-klubi-primary hover:underline"
                          >
                            {item.senderName}
                          </Link>
                          <span className="text-[10px] text-amber-700 bg-amber-100 font-semibold px-2 py-0.5 rounded-full">
                            Pendente de aprovação
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg p-2.5 italic">
                          &ldquo;{item.content}&rdquo;
                        </p>

                        <div className="flex items-center gap-2 mt-2.5">
                          <button
                            onClick={() => handleAccept(item.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition shadow-2xs"
                          >
                            <CheckCircle size={14} />
                            <span>Aceitar Depoimento</span>
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition"
                          >
                            <XCircle size={14} />
                            <span>Recusar</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Escrever Novo */}
        {activeTab === 'new' && (
          currentUser ? (
            <form onSubmit={handleSendTestimonial} className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-bold mb-2">
                <HeartHandshake size={15} className="text-klubi-accent" />
                <span>Escrever depoimento como <strong>{currentUser.name}</strong> para {recipientName}:</span>
              </div>

              <p className="text-[11px] text-slate-500 mb-2.5">
                Depoimentos são mensagens profundas e duradouras. {recipientName} poderá ler e aprovar no painel de moderação.
              </p>

              <textarea
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={`O que dizer de ${recipientName}?...`}
                className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-klubi-accent/20 focus:border-klubi-accent bg-white"
                maxLength={800}
              />

              <div className="flex items-center justify-between mt-3">
                <span className="text-[11px] text-slate-400">
                  {800 - newContent.length} caracteres restantes
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting || !newContent.trim()}
                  className="bg-klubi-accent hover:bg-klubi-accent-hover disabled:bg-slate-300 text-white font-semibold text-xs px-4 py-2 rounded-lg transition flex items-center gap-1.5 shadow-xs"
                >
                  <Send size={13} />
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar para Moderação'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-600 flex items-center justify-between">
              <span>Você precisa entrar na sua conta para escrever um depoimento para {recipientName}.</span>
              <a href="/login" className="font-bold text-klubi-accent hover:underline">
                Fazer Login
              </a>
            </div>
          )
        )}
      </div>
    </div>
  );
};
