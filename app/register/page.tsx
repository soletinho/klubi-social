'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UserPlus, 
  Lock, 
  Mail, 
  User as UserIcon, 
  MapPin, 
  AlertCircle, 
  CheckCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useKlubi } from '@/context/KlubiContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useKlubi();

  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    email: '',
    password: '',
    city: 'São Paulo, SP',
    relationshipStatus: 'single' as const,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (formData.password.length < 6) {
      setErrorMsg('A senha deve ter no mínimo 6 caracteres.');
      setIsLoading(false);
      return;
    }

    const cleanNickname = formData.nickname.toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!cleanNickname) {
      setErrorMsg('Digite um apelido válido (apenas letras, números e underline).');
      setIsLoading(false);
      return;
    }

    try {
      const result = await register({
        name: formData.name,
        nickname: cleanNickname,
        email: formData.email,
        password: formData.password,
        city: formData.city,
        relationshipStatus: formData.relationshipStatus,
      });

      if (!result.success) {
        setErrorMsg(result.message || 'Erro ao criar conta.');
      } else {
        setSuccessMsg('🎉 Bem-vindo ao Klubi! Sua conta foi criada com sucesso.');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-lg">
        <div className="klubi-card p-6 sm:p-8 bg-white border border-slate-200/90 shadow-card">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-klubi-primary mb-4 transition font-medium"
          >
            <ArrowLeft size={13} />
            <span>Já tem uma conta? Fazer login</span>
          </Link>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
              <Sparkles size={20} className="text-klubi-accent" />
              <span>Entrar para o Klubi</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Crie seu perfil real e comece sua rede do zero, sem bots nem algoritmos
            </p>
          </div>

          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2"
              >
                <AlertCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-start gap-2"
              >
                <CheckCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome Completo:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-klubi-primary/20 focus:border-klubi-primary"
                  />
                  <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Apelido (@username único):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                  <input
                    type="text"
                    required
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    placeholder="ex: lucas_sp"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-klubi-primary/20 focus:border-klubi-primary"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                E-mail:
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu.email@exemplo.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-klubi-primary/20 focus:border-klubi-primary"
                />
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Senha (mínimo 6 caracteres):
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-klubi-primary/20 focus:border-klubi-primary"
                  minLength={6}
                />
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cidade e Estado:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="São Paulo, SP"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-klubi-primary/20 focus:border-klubi-primary"
                  />
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Status de Relacionamento:
                </label>
                <select
                  value={formData.relationshipStatus}
                  onChange={(e) => setFormData({ ...formData, relationshipStatus: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-klubi-primary/20 focus:border-klubi-primary bg-white"
                >
                  <option value="single">Solteiro(a)</option>
                  <option value="dating">Namorando</option>
                  <option value="married">Casado(a)</option>
                  <option value="complicated">Em um caso complicado</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-3 w-full bg-klubi-primary hover:bg-blue-800 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs"
            >
              <UserPlus size={15} />
              <span>{isLoading ? 'Criando sua conta...' : 'Finalizar Cadastro no Klubi'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
