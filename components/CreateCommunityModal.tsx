'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  Compass, 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  Image as ImageIcon, 
  Check, 
  Lock, 
  Globe, 
  FolderPlus,
  Users
} from 'lucide-react';
import { useKlubi } from '@/context/KlubiContext';
import { KlubiAvatar } from '@/components/KlubiAvatar';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const COMMUNITY_CATEGORIES = [
  'Cotidiano & Humor',
  'Música & Cultura',
  'Tecnologia & Web',
  'Cidades & Bairros',
  'Hobbies & Esportes',
  'Filmes & Séries',
  'Games & Videogames',
  'Outros',
];

const PRESET_COMMUNITY_COVERS = [
  { label: 'Café & Cotidiano', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80' },
  { label: 'Música & Fones', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80' },
  { label: 'Games & Retrô', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80' },
  { label: 'Skate & Rua', url: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=400&auto=format&fit=crop&q=80' },
  { label: 'Tecnologia & Código', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80' },
  { label: 'Cinema & Séries', url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&auto=format&fit=crop&q=80' },
  { label: 'Livros & Poesia', url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Viagens & Natureza', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&auto=format&fit=crop&q=80' },
];

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { currentUser, createCommunity } = useKlubi();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Cotidiano & Humor');
  const [imageUrl, setImageUrl] = useState(PRESET_COMMUNITY_COVERS[0].url);
  const [isPrivate, setIsPrivate] = useState(false);
  const [imageMethod, setImageMethod] = useState<'preset' | 'upload' | 'url'>('preset');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setImageUrl(compressed);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!currentUser) {
      setErrorMsg('Você precisa estar logado para fundar uma comunidade!');
      return;
    }

    if (!title.trim()) {
      setErrorMsg('Digite um nome para a comunidade.');
      return;
    }

    if (!description.trim()) {
      setErrorMsg('Descreva a proposta da sua comunidade.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newComm = createCommunity(
        title.trim(),
        description.trim(),
        category,
        imageUrl
      );

      // Limpa os campos
      setTitle('');
      setDescription('');
      onClose();

      // Redireciona imediatamente para a comunidade criada
      router.push(`/communities/${newComm.id}`);
    } catch (err) {
      setErrorMsg('Ocorreu um erro ao criar a comunidade. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-klubi-border rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-klubi-primary via-blue-700 to-indigo-800 text-white px-5 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-blue-200" />
            <h2 className="font-bold text-sm sm:text-base">Fundar Nova Comunidade no Klubi</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          {/* 1. Nome da Comunidade */}
          <div>
            <label className="font-semibold text-slate-800 block mb-1">
              Nome da Comunidade: <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Eu Amo Café Antes de Falar com Pessoas | Fãs de Rock 90s"
              maxLength={70}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-klubi-primary/30 outline-hidden font-medium text-slate-800"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Escolha um nome autêntico e chamativo (máximo 70 caracteres).
            </span>
          </div>

          {/* 2. Categoria */}
          <div>
            <label className="font-semibold text-slate-800 block mb-1">
              Categoria: <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-klubi-primary/30 outline-hidden bg-white text-slate-700"
            >
              {COMMUNITY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Imagem / Foto de Capa da Comunidade */}
          <div className="space-y-2.5">
            <label className="font-semibold text-slate-800 block">
              Foto / Capa da Comunidade:
            </label>

            {/* Preview da Imagem */}
            <div className="flex items-center gap-3.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-300 bg-white shadow-2xs shrink-0">
                <KlubiAvatar src={imageUrl} alt={title || 'Comunidade'} fill />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() => setImageMethod('preset')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                      imageMethod === 'preset'
                        ? 'bg-klubi-primary text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Galeria Sugerida
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMethod('upload')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                      imageMethod === 'upload'
                        ? 'bg-klubi-primary text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Enviar do Computador
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMethod('url')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                      imageMethod === 'url'
                        ? 'bg-klubi-primary text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Link da Web
                  </button>
                </div>
                <span className="text-[10px] text-slate-500">
                  Esta foto aparece nos fóruns e na grade de comunidades dos membros.
                </span>
              </div>
            </div>

            {/* Galeria Sugerida */}
            {imageMethod === 'preset' && (
              <div className="grid grid-cols-4 gap-2 pt-1">
                {PRESET_COMMUNITY_COVERS.map((item, idx) => {
                  const isSelected = imageUrl === item.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(item.url)}
                      className={`relative p-1 rounded-xl border flex flex-col items-center gap-1 transition ${
                        isSelected
                          ? 'border-klubi-primary bg-blue-50/80 ring-2 ring-klubi-primary/30'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100">
                        <KlubiAvatar src={item.url} alt={item.label} size={40} />
                      </div>
                      <span className="text-[9px] text-slate-600 truncate max-w-full font-medium">
                        {item.label}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-klubi-primary text-white rounded-full p-0.5">
                          <Check size={8} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Upload do Computador */}
            {imageMethod === 'upload' && (
              <div className="p-3 bg-blue-50/50 border border-dashed border-blue-300 rounded-xl flex items-center justify-between gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-klubi-primary flex items-center justify-center shrink-0">
                    <Upload size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">
                      Escolha uma foto do seu dispositivo
                    </span>
                    <span className="text-[10px] text-slate-500">
                      JPG, PNG ou WebP. Redimensionada automaticamente.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-klubi-primary hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-lg transition text-xs shrink-0"
                >
                  Selecionar
                </button>
              </div>
            )}

            {/* Link da Web */}
            {imageMethod === 'url' && (
              <div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://exemplo.com/capa-comunidade.jpg"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-klubi-primary/30 outline-hidden"
                />
              </div>
            )}
          </div>

          {/* 4. Descrição */}
          <div>
            <label className="font-semibold text-slate-800 block mb-1">
              Descrição & Proposta: <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva sobre o que é esta comunidade, o que os membros podem esperar e regras de convivência..."
              maxLength={400}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-klubi-primary/30 outline-hidden resize-none"
            />
          </div>

          {/* 5. Tipo de Acesso */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isPrivate ? (
                <Lock size={16} className="text-amber-600 shrink-0" />
              ) : (
                <Globe size={16} className="text-klubi-primary shrink-0" />
              )}
              <div>
                <span className="font-bold text-slate-800 text-xs block">
                  {isPrivate ? 'Comunidade Moderada' : 'Comunidade Pública'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {isPrivate
                    ? 'Apenas membros aprovados podem ver os fóruns.'
                    : 'Qualquer usuário do Klubi pode participar e postar tópicos.'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className="text-xs text-klubi-primary hover:underline font-semibold"
            >
              {isPrivate ? 'Mudar para Pública' : 'Mudar para Moderada'}
            </button>
          </div>

          {/* Rodapé de Ações */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold text-xs rounded-lg hover:bg-slate-100 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-klubi-primary hover:bg-blue-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <FolderPlus size={15} />
              <span>{isSubmitting ? 'Fundando Comunidade...' : 'Fundar Comunidade'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
