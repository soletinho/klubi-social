'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';
import { useKlubi } from '@/context/KlubiContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useKlubi();

  const [emailOrNick, setEmailOrNick] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await login(emailOrNick, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Erro ao realizar login.');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-md">
        {/* Card de Login Clássico */}
        <div className="klubi-card p-6 sm:p-8 bg-white border border-slate-200/90 shadow-card">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-klubi-accent to-pink-500 flex items-center justify-center shadow-md">
                <span className="text-white font-black text-2xl tracking-tighter">k</span>
              </div>
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                klubi<span className="text-klubi-accent">.</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Conecte-se com seus amigos e comunidades reais
            </p>
          </div>

          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2"
              >
                <AlertCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="flex flex-col gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                E-mail ou @Apelido:
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={emailOrNick}
                  onChange={(e) => setEmailOrNick(e.target.value)}
                  placeholder="ex: seu.email@exemplo.com ou @nickname"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-klubi-primary/20 focus:border-klubi-primary bg-white"
                />
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">
                  Senha:
                </label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-klubi-primary/20 focus:border-klubi-primary bg-white"
                />
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                defaultChecked
                className="rounded border-slate-300 text-klubi-primary focus:ring-0"
              />
              <label htmlFor="remember" className="text-xs text-slate-600 cursor-pointer">
                Lembrar de mim neste computador
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full bg-klubi-primary hover:bg-blue-800 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs"
            >
              <LogIn size={15} />
              <span>{isLoading ? 'Entrando no Klubi...' : 'Entrar'}</span>
            </button>
          </form>

          {/* Divisor */}
          <div className="my-5 flex items-center gap-2 text-[11px] text-slate-400">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span>Ainda não tem uma conta?</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <Link
            href="/register"
            className="w-full bg-white hover:bg-rose-50/60 text-klubi-accent border border-rose-200 font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 text-xs text-center"
          >
            <Sparkles size={14} />
            <span>Criar Minha Conta no Klubi</span>
          </Link>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Rede social autêntica • Sem anúncios invasivos • Comunidades reais
        </p>
      </div>
    </div>
  );
}
