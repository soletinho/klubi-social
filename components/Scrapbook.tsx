'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MessageSquare, 
  Send, 
  Trash2, 
  Smile, 
  Bold, 
  Italic, 
  AlertCircle,
  CornerDownRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scrap } from '@/types';
import { useKlubi } from '@/context/KlubiContext';

interface ScrapbookProps {
  initialScraps: Scrap[];
  recipientId: string;
  recipientName: string;
}

export const Scrapbook: React.FC<ScrapbookProps> = ({
  initialScraps,
  recipientId,
  recipientName,
}) => {
  const { currentUser, scraps, addScrap, deleteScrap } = useKlubi();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Filtra recados para este perfil
  const profileScraps = scraps.filter((s) => s.recipientId === recipientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!currentUser) {
      alert('Você precisa estar logado para postar um recado!');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addScrap(recipientId, content.trim());
      setContent('');
      setIsSubmitting(false);
      setShowNotification(`Recado postado por ${currentUser.name}!`);
      setTimeout(() => setShowNotification(null), 3000);
    }, 250);
  };

  const handleDelete = (id: string) => {
    deleteScrap(id);
    setShowNotification('Recado removido do mural.');
    setTimeout(() => setShowNotification(null), 3000);
  };

  const insertFormatting = (tag: string) => {
    setContent((prev) => `${prev} [${tag}]texto[/${tag}]`);
  };

  return (
    <div id="scraps-section" className="klubi-card">
      <div className="klubi-card-header">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-klubi-secondary" />
          <span>Mural de Recados</span>
          <span className="bg-white text-klubi-primary font-bold px-2 py-0.5 rounded-full text-[11px] border border-blue-200">
            {profileScraps.length}
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-normal">
          Todos os recados são públicos
        </span>
      </div>

      <div className="p-4">
        {/* Formulário de Novo Recado */}
        {currentUser ? (
          <form onSubmit={handleSubmit} className="mb-5 bg-slate-50/70 border border-slate-200 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="relative w-5 h-5 rounded-full overflow-hidden border border-slate-300">
                  <Image
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    fill
                    sizes="20px"
                    className="object-cover"
                  />
                </div>
                <label htmlFor="scrap-text" className="font-semibold text-xs text-slate-700">
                  Escrever como <strong>{currentUser.name}</strong> para {recipientName}:
                </label>
              </div>

              <div className="flex items-center gap-1 text-slate-500">
                <button
                  type="button"
                  onClick={() => insertFormatting('b')}
                  className="p-1 hover:bg-slate-200 rounded text-slate-700 font-bold"
                  title="Negrito"
                >
                  <Bold size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('i')}
                  className="p-1 hover:bg-slate-200 rounded text-slate-700 italic"
                  title="Itálico"
                >
                  <Italic size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setContent((c) => `${c} :-)`)}
                  className="p-1 hover:bg-slate-200 rounded text-slate-700"
                  title="Smiley :-)"
                >
                  <Smile size={13} />
                </button>
              </div>
            </div>

            <textarea
              id="scrap-text"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Deixe um recado bem legal para ${recipientName}...`}
              className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-klubi-primary/20 focus:border-klubi-primary bg-white resize-y"
              maxLength={500}
            />

            <div className="flex items-center justify-between mt-2.5">
              <span className="text-[11px] text-slate-400">
                {500 - content.length} caracteres restantes
              </span>
              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="bg-klubi-primary hover:bg-blue-800 disabled:bg-slate-300 text-white font-semibold text-xs px-4 py-2 rounded-lg transition flex items-center gap-1.5 shadow-xs"
              >
                <Send size={13} />
                <span>{isSubmitting ? 'Publicando...' : 'Publicar Recado'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-600 flex items-center justify-between">
            <span>Você precisa entrar na sua conta para deixar um recado para {recipientName}.</span>
            <a href="/login" className="font-bold text-klubi-primary hover:underline">
              Fazer Login
            </a>
          </div>
        )}

        {/* Notificação dinâmica */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between"
            >
              <span>{showNotification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de Recados */}
        {profileScraps.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs flex flex-col items-center gap-1.5">
            <AlertCircle size={24} className="text-slate-300" />
            <p>Nenhum recado encontrado. Seja a primeira pessoa a deixar uma mensagem!</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            <AnimatePresence initial={false}>
              {profileScraps.map((scrap) => (
                <motion.div
                  key={scrap.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="py-3.5 flex gap-3.5 group"
                >
                  <div className="relative w-11 h-11 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-100 shadow-2xs">
                    <Image
                      src={scrap.senderAvatar}
                      alt={scrap.senderName}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <Link
                          href={`/profile/${scrap.senderId}`}
                          className="font-bold text-xs text-klubi-secondary hover:underline cursor-pointer"
                        >
                          {scrap.senderName}
                        </Link>
                        <span className="text-[10px] text-slate-400">
                          {scrap.createdAt}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setContent(`@${scrap.senderName} `);
                            const textarea = document.getElementById('scrap-text');
                            textarea?.focus();
                          }}
                          className="opacity-0 group-hover:opacity-100 text-[11px] text-klubi-secondary hover:underline flex items-center gap-0.5 transition"
                          title="Responder recado"
                        >
                          <CornerDownRight size={11} />
                          <span>responder</span>
                        </button>

                        <button
                          onClick={() => handleDelete(scrap.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-0.5 rounded transition"
                          title="Excluir recado"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <p className="mt-1 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {scrap.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
