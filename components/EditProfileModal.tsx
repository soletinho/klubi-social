'use client';

import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  Image as ImageIcon, 
  Check, 
  User, 
  Heart, 
  Music, 
  Film, 
  BookOpen, 
  Gamepad2, 
  Briefcase, 
  MapPin, 
  Calendar, 
  EyeOff,
  Smile,
  RefreshCw
} from 'lucide-react';
import { useKlubi } from '@/context/KlubiContext';
import { KlubiAvatar } from '@/components/KlubiAvatar';
import { RelationshipStatus } from '@/types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Avatares clássicos e retrô prontos para escolher
const RETRO_AVATARS = [
  { label: 'Robô Azul', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=KlubiBlue&colors[]=0284c7' },
  { label: 'Robô Rosa', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=KlubiPink&colors[]=e11d48' },
  { label: 'Robô Verde', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=KlubiGreen&colors[]=10b981' },
  { label: 'Robô Amarelo', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=KlubiGold&colors[]=f59e0b' },
  { label: 'Pixel Garoto', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Leo' },
  { label: 'Pixel Garota', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Mia' },
  { label: 'Pixel Gato', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix' },
  { label: 'Aventureiro RPG', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Shadow' },
  { label: 'Mago Retrô', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Merlin' },
  { label: 'Smiley Feliz', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=HappySmiley' },
  { label: 'Óculos Escuros', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=CoolVibes' },
  { label: 'Estrela Nostalgia', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=SuperStar' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile } = useKlubi();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados dos formulários
  const [activeTab, setActiveTab] = useState<'foto' | 'geral' | 'interesses' | 'privacidade'>('foto');
  const [avatarMethod, setAvatarMethod] = useState<'upload' | 'preset' | 'url'>('upload');

  // Valores dos campos
  const [name, setName] = useState(currentUser?.name || '');
  const [nickname, setNickname] = useState(currentUser?.nickname || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [statusMessage, setStatusMessage] = useState(currentUser?.statusMessage || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus>(
    currentUser?.relationshipStatus || 'single'
  );
  const [birthday, setBirthday] = useState(currentUser?.birthday || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [country, setCountry] = useState(currentUser?.country || 'Brasil');
  const [occupation, setOccupation] = useState(currentUser?.occupation || '');
  
  // Interesses (guardados como strings separadas por vírgula para fácil edição)
  const [musicText, setMusicText] = useState(currentUser?.interests?.music?.join(', ') || '');
  const [moviesText, setMoviesText] = useState(currentUser?.interests?.movies?.join(', ') || '');
  const [booksText, setBooksText] = useState(currentUser?.interests?.books?.join(', ') || '');
  const [hobbiesText, setHobbiesText] = useState(currentUser?.interests?.hobbies?.join(', ') || '');

  // Privacidade
  const [invisibleMode, setInvisibleMode] = useState(currentUser?.invisibleMode || false);

  // Status de salvamento
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !currentUser) return null;

  // Processa upload de imagem local do computador com compressão em canvas
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WebP ou GIF).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // Redimensiona para no máximo 400x400 para manter alta resolução e tamanho compacto
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
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarUrl(compressedDataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Salvar alterações
  const handleSave = () => {
    setIsSaving(true);

    const parseList = (str: string) =>
      str
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    const updatedData = {
      name: name.trim() || currentUser.name,
      nickname: nickname.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') || currentUser.nickname,
      avatarUrl: avatarUrl.trim() || currentUser.avatarUrl,
      statusMessage: statusMessage.trim(),
      bio: bio.trim(),
      relationshipStatus,
      birthday: birthday.trim() || 'Não informado',
      city: city.trim() || 'Brasil',
      country: country.trim() || 'Brasil',
      occupation: occupation.trim() || 'Membro do Klubi',
      interests: {
        music: parseList(musicText),
        movies: parseList(moviesText),
        books: parseList(booksText),
        hobbies: parseList(hobbiesText),
      },
      invisibleMode,
    };

    updateProfile(updatedData);

    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-klubi-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-klubi-primary via-blue-700 to-indigo-800 text-white px-5 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <User size={18} className="text-blue-200" />
            <h2 className="font-bold text-sm sm:text-base">Editar Meu Perfil no Klubi</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Abas de Navegação */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs px-4 pt-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('foto')}
            className={`px-3.5 py-2 font-semibold rounded-t-lg transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'foto'
                ? 'bg-white text-klubi-primary border-t-2 border-t-klubi-primary border-x border-slate-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon size={14} />
            <span>Foto & Avatar</span>
          </button>

          <button
            onClick={() => setActiveTab('geral')}
            className={`px-3.5 py-2 font-semibold rounded-t-lg transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'geral'
                ? 'bg-white text-klubi-primary border-t-2 border-t-klubi-primary border-x border-slate-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User size={14} />
            <span>Informações Gerais</span>
          </button>

          <button
            onClick={() => setActiveTab('interesses')}
            className={`px-3.5 py-2 font-semibold rounded-t-lg transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'interesses'
                ? 'bg-white text-klubi-primary border-t-2 border-t-klubi-primary border-x border-slate-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart size={14} />
            <span>Gostos & Afinidades</span>
          </button>

          <button
            onClick={() => setActiveTab('privacidade')}
            className={`px-3.5 py-2 font-semibold rounded-t-lg transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'privacidade'
                ? 'bg-white text-klubi-primary border-t-2 border-t-klubi-primary border-x border-slate-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <EyeOff size={14} />
            <span>Privacidade</span>
          </button>
        </div>

        {/* Corpo do Formulário */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* =========================================================
              ABA 1: FOTO & AVATAR
             ========================================================= */}
          {activeTab === 'foto' && (
            <div className="space-y-4">
              {/* Preview Atual */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-klubi-primary/30 shadow-md shrink-0 bg-white">
                  <KlubiAvatar src={avatarUrl} alt={name || 'Avatar'} fill />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-bold text-slate-800 text-sm">Sua foto atual de exibição</h4>
                  <p className="text-slate-500 text-xs mt-1">
                    Esta imagem aparece no seu perfil, nos seus scraps, depoimentos e nos tópicos de comunidades.
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => setAvatarMethod('upload')}
                      className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition text-xs ${
                        avatarMethod === 'upload'
                          ? 'bg-klubi-primary text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Upload size={13} />
                      <span>Do Computador</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarMethod('preset')}
                      className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition text-xs ${
                        avatarMethod === 'preset'
                          ? 'bg-klubi-primary text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Sparkles size={13} />
                      <span>Galeria Retrô</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarMethod('url')}
                      className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition text-xs ${
                        avatarMethod === 'url'
                          ? 'bg-klubi-primary text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <LinkIcon size={13} />
                      <span>Link da Web</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Opção 1: Upload Local */}
              {avatarMethod === 'upload' && (
                <div className="p-4 bg-blue-50/50 border border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center text-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-klubi-primary flex items-center justify-center mb-1">
                    <Upload size={22} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">
                      Escolha uma foto do seu computador ou celular
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Suporta JPG, PNG, WebP e GIF. A imagem é otimizada instantaneamente.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 bg-klubi-primary hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg transition shadow-xs text-xs"
                  >
                    Selecionar Arquivo
                  </button>
                </div>
              )}

              {/* Opção 2: Galeria Retrô */}
              {avatarMethod === 'preset' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 text-xs">
                      Escolha um avatar nostálgico dos anos 2000:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const randomSeed = Math.random().toString(36).substring(2, 7);
                        setAvatarUrl(`https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`);
                      }}
                      className="text-[11px] text-klubi-primary hover:underline flex items-center gap-1"
                    >
                      <RefreshCw size={11} /> Gerar Robô Aleatório
                    </button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                    {RETRO_AVATARS.map((item, idx) => {
                      const isSelected = avatarUrl === item.url;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatarUrl(item.url)}
                          className={`relative p-1.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                            isSelected
                              ? 'border-klubi-primary bg-blue-50/80 ring-2 ring-klubi-primary/30'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-50">
                            <KlubiAvatar src={item.url} alt={item.label} size={48} />
                          </div>
                          <span className="text-[10px] text-slate-600 truncate max-w-full font-medium">
                            {item.label}
                          </span>
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-klubi-primary text-white rounded-full p-0.5">
                              <Check size={10} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Opção 3: Link de Imagem */}
              {avatarMethod === 'url' && (
                <div className="space-y-2">
                  <label className="font-semibold text-slate-700 block">
                    Cole o link direto da imagem (URL terminada em .png, .jpg ou .webp):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://exemplo.com/sua-foto.jpg"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-klubi-primary/30 focus:border-klubi-primary outline-hidden"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Dica: Você pode copiar o endereço de qualquer foto sua do Instagram, WhatsApp Web, Imgur ou Pinterest.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              ABA 2: INFORMAÇÕES GERAIS
             ========================================================= */}
          {activeTab === 'geral' && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-klubi-primary/30 outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Apelido (@username)</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-klubi-primary/30 outline-hidden bg-slate-50 text-slate-600"
                    disabled
                  />
                  <span className="text-[10px] text-slate-400">O apelido não pode ser alterado após o cadastro.</span>
                </div>
              </div>

              {/* Frase de Status / Sorte de Hoje (Estilo MSN / Orkut) */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1 flex items-center justify-between">
                  <span>Frase de Status / Sorte de hoje</span>
                  <span className="text-[11px] text-slate-400 font-normal">Estilo subnick do MSN</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    placeholder="ex: ouvindo Charlie Brown Jr no Winamp... | só os loucos sabem 🛹"
                    maxLength={120}
                    className="w-full px-3 py-2 border border-amber-300 bg-amber-50/40 rounded-lg text-xs text-amber-950 focus:ring-2 focus:ring-amber-400/50 outline-hidden"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Aparece em destaque no seu card de perfil para todos os visitantes.
                </span>
              </div>

              {/* Quem sou eu (Bio) */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Quem sou eu (Biografia / Sobre você)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Conte um pouco sobre sua história, suas manias, o que gosta de fazer no final de semana..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-klubi-primary/30 outline-hidden resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Status de Relacionamento</label>
                  <select
                    value={relationshipStatus}
                    onChange={(e) => setRelationshipStatus(e.target.value as RelationshipStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-klubi-primary/30 outline-hidden bg-white"
                  >
                    <option value="single">Solteiro(a)</option>
                    <option value="dating">Namorando</option>
                    <option value="married">Casado(a)</option>
                    <option value="complicated">É complicado</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-slate-400" /> Data de Nascimento
                  </label>
                  <input
                    type="text"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    placeholder="ex: 15 de Outubro"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-klubi-primary/30 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                    <MapPin size={13} className="text-slate-400" /> Cidade
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="ex: Maceió / AL"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-klubi-primary/30 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                    <Briefcase size={13} className="text-slate-400" /> Ocupação / Trabalho
                  </label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="ex: Designer, Estudante, Programador..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-klubi-primary/30 outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              ABA 3: GOSTOS & AFINIDADES (INTERESSES)
             ========================================================= */}
          {activeTab === 'interesses' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 text-xs">
                <span className="font-bold flex items-center gap-1 mb-1">
                  <Sparkles size={13} className="text-klubi-primary" /> Como no Orkut clássico:
                </span>
                Digite seus itens separados por vírgula (ex: <em>Linkin Park, CPM 22, Pitty</em>). Eles se transformarão automaticamente em badges estilizadas no seu perfil!
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1 flex items-center gap-1.5">
                  <Music size={14} className="text-klubi-primary" /> Músicas & Bandas Favoritas:
                </label>
                <textarea
                  rows={2}
                  value={musicText}
                  onChange={(e) => setMusicText(e.target.value)}
                  placeholder="Charlie Brown Jr, Linkin Park, Blink-182, Pitty, Green Day, Evanescence..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-klubi-primary/30 outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1 flex items-center gap-1.5">
                  <Film size={14} className="text-rose-500" /> Filmes & Séries Favoritas:
                </label>
                <textarea
                  rows={2}
                  value={moviesText}
                  onChange={(e) => setMoviesText(e.target.value)}
                  placeholder="Matrix, O Senhor dos Anéis, De Volta para o Futuro, Lost, Todo Mundo Odeia o Chris..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500/30 outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-amber-600" /> Livros & Leituras:
                </label>
                <textarea
                  rows={2}
                  value={booksText}
                  onChange={(e) => setBooksText(e.target.value)}
                  placeholder="Harry Potter, O Hobbit, 1984, Percy Jackson, As Crônicas de Nárnia..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500/30 outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1 flex items-center gap-1.5">
                  <Gamepad2 size={14} className="text-emerald-600" /> Hobbies & Passatempos:
                </label>
                <textarea
                  rows={2}
                  value={hobbiesText}
                  onChange={(e) => setHobbiesText(e.target.value)}
                  placeholder="Andar de skate, jogar Tibia, ouvir música no Winamp, tirar fotos..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/30 outline-hidden"
                />
              </div>
            </div>
          )}

          {/* =========================================================
              ABA 4: PRIVACIDADE
             ========================================================= */}
          {activeTab === 'privacidade' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <input
                      id="invisibleModeToggle"
                      type="checkbox"
                      checked={invisibleMode}
                      onChange={(e) => setInvisibleMode(e.target.checked)}
                      className="w-4 h-4 text-klubi-primary border-slate-300 rounded-sm focus:ring-klubi-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="invisibleModeToggle" className="font-bold text-slate-800 cursor-pointer text-xs sm:text-sm">
                      Modo Fantasma (Invisível)
                    </label>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                      Quando ativado, você poderá visitar os perfis dos seus amigos e de outras pessoas sem deixar rastro na lista de &ldquo;Quem me viu&rdquo;. Em contrapartida, você também não verá os visitantes anônimos no seu perfil.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé de Ações */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold text-xs rounded-lg hover:bg-slate-200/60 transition"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm ${
              savedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-klubi-primary hover:bg-blue-800 text-white'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check size={14} />
                <span>Perfil Atualizado!</span>
              </>
            ) : (
              <>
                <Check size={14} />
                <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
