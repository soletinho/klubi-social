'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { KlubiAvatar } from '@/components/KlubiAvatar';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  UserCheck, 
  Clock, 
  Sparkles, 
  Trash2, 
  Lock, 
  Unlock, 
  AlertCircle,
  LogIn
} from 'lucide-react';
import { useKlubi } from '@/context/KlubiContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function VisitorsHistoryPage() {
  const { currentUser, visitors, clearVisitors, isFriend } = useKlubi();
  const [isInvisible, setIsInvisible] = useState(false);
  const [filterOnlyStrangers, setFilterOnlyStrangers] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="klubi-card p-12 text-center flex flex-col items-center justify-center gap-3 max-w-md mx-auto my-8">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
          <Eye size={24} />
        </div>
        <h2 className="text-base font-bold text-slate-900">Acesso Restrito</h2>
        <p className="text-xs text-slate-500">
          Você precisa estar logado para ver o histórico de quem visitou seu perfil.
        </p>
        <Link
          href="/login"
          className="mt-2 bg-klubi-primary text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5"
        >
          <LogIn size={14} />
          <span>Fazer Login</span>
        </Link>
      </div>
    );
  }

  // Filtra as visitas recebidas pelo usuário logado
  const myVisitors = visitors.filter((v) => v.profileId === currentUser.id);

  const displayedVisitors = myVisitors.filter((v) => {
    if (filterOnlyStrangers) return !isFriend(v.visitorId);
    return true;
  });

  const toggleInvisibleMode = () => {
    const nextState = !isInvisible;
    setIsInvisible(nextState);
    if (nextState) {
      showNotice('Modo Fantasma ATIVADO: Suas visitas agora são secretas, mas você não pode ver quem te visitou.');
    } else {
      showNotice('Modo Fantasma DESATIVADO: Você voltou a ser visível e a lista de visitantes foi revelada!');
    }
  };

  const handleClearHistory = () => {
    clearVisitors();
    showNotice('Histórico de visitas limpo com sucesso.');
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3800);
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto">
      {/* Breadcrumb de navegação */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-klubi-primary flex items-center gap-1">
          <ArrowLeft size={13} />
          <span>Voltar ao Meu Perfil</span>
        </Link>
        <span>•</span>
        <span className="text-slate-900 font-semibold">Quem Me Visitou</span>
      </nav>

      {/* Banner Principal e Card do Modo Fantasma */}
      <div className="klubi-card p-5 bg-gradient-to-r from-blue-50/70 via-white to-pink-50/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-klubi-primary font-bold text-sm mb-1">
              <Eye size={17} />
              <span>Histórico de Visitas</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Quem andou visitando seu perfil?
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Descubra quem passou pelo seu perfil recentemente. Mas lembre-se: se você ativar o Modo Fantasma para navegar escondido, você não poderá ver quem te visitou!
            </p>
          </div>

          {/* Controle do Modo Fantasma (Invisível) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs flex flex-col gap-2 shrink-0 max-w-xs w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isInvisible ? (
                  <EyeOff size={16} className="text-purple-600 animate-pulse" />
                ) : (
                  <Eye size={16} className="text-emerald-600" />
                )}
                <span className="text-xs font-bold text-slate-800">
                  Modo Fantasma (Invisível)
                </span>
              </div>
              <button
                type="button"
                onClick={toggleInvisibleMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  isInvisible ? 'bg-purple-600' : 'bg-slate-300'
                }`}
                title="Alternar Modo Fantasma"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isInvisible ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              {isInvisible
                ? '👻 Ativo: você não deixa rastros nos perfis alheios, mas não pode ver seus visitantes.'
                : '👁️ Desativado: você vê quem te visitou, e suas visitas também são registradas.'}
            </p>
          </div>
        </div>

        {/* Notificação dinâmica */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 px-3.5 py-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <Sparkles size={14} className="text-klubi-secondary shrink-0" />
              <span>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ÁREA DE CONTEÚDO PRINCIPAL: MODO INVISÍVEL VS. LISTA VISÍVEL */}
      {isInvisible ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="klubi-card p-8 text-center flex flex-col items-center justify-center bg-gradient-to-b from-purple-50/40 via-white to-slate-50/50 border-purple-200"
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 shadow-xs">
            <Lock size={32} />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full mb-2">
            A Regra de Ouro da Reciprocidade
          </span>

          <h2 className="text-xl font-bold text-slate-900 max-w-md">
            Você está navegando no Modo Fantasma!
          </h2>

          <p className="text-xs text-slate-600 max-w-lg mt-2 leading-relaxed">
            No Klubi acreditamos em relações transparentes: se você optar por visitar o perfil dos outros de forma invisível, você abre mão do privilégio de ver quem visitou o seu.
          </p>

          <button
            onClick={toggleInvisibleMode}
            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2"
          >
            <Unlock size={14} />
            <span>Desativar Modo Fantasma & Revelar Visitantes</span>
          </button>
        </motion.div>
      ) : (
        <div className="klubi-card">
          <div className="klubi-card-header">
            <div className="flex items-center gap-2">
              <Eye size={15} className="text-klubi-secondary" />
              <span className="font-bold text-sm">
                Visitantes Recentes ({displayedVisitors.length})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterOnlyStrangers}
                  onChange={(e) => setFilterOnlyStrangers(e.target.checked)}
                  className="rounded text-klubi-primary focus:ring-0"
                />
                <span>Apenas não amigos</span>
              </label>

              {myVisitors.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-[11px] text-rose-500 hover:underline flex items-center gap-1"
                  title="Limpar histórico"
                >
                  <Trash2 size={12} />
                  <span>Limpar</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-4">
            {displayedVisitors.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs flex flex-col items-center gap-2">
                <AlertCircle size={28} className="text-slate-300" />
                <p>Nenhuma visita registrada no seu perfil até agora.</p>
                <p className="text-[11px] text-slate-400">
                  Compartilhe o link do seu perfil com amigos para que eles comecem a visitá-lo!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                {displayedVisitors.map((visitor) => {
                  const friend = isFriend(visitor.visitorId);
                  return (
                    <motion.div
                      key={visitor.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-xl border border-slate-200/90 hover:border-klubi-secondary/60 bg-white shadow-2xs hover:shadow-card transition flex flex-col items-center text-center group"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                        <KlubiAvatar
                          src={visitor.visitorAvatar}
                          alt={visitor.visitorName}
                          fill
                        />
                      </div>

                      <h3 className="mt-2.5 font-bold text-xs text-slate-900 group-hover:text-klubi-primary transition truncate max-w-full">
                        {visitor.visitorName}
                      </h3>

                      <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                        <Clock size={11} className="text-slate-400" />
                        <span>{visitor.visitedAt}</span>
                      </div>

                      <div className="mt-2 w-full pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        {friend ? (
                          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                            <UserCheck size={11} /> Amigo(a)
                          </span>
                        ) : (
                          <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                            <Eye size={11} /> Visitante
                          </span>
                        )}

                        <Link
                          href={`/profile/${visitor.visitorId}`}
                          className="text-klubi-secondary hover:text-klubi-primary hover:underline font-semibold text-[11px]"
                        >
                          Visitar
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
