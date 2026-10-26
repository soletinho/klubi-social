'use client';

import React, { useState } from 'react';
import { Smile, Snowflake, Heart, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserReputation } from '@/types';

interface SocialReputationProps {
  initialReputation: UserReputation;
  userName?: string;
}

export const SocialReputation: React.FC<SocialReputationProps> = ({
  initialReputation,
  userName = 'Rodrigo',
}) => {
  const [reputation, setReputation] = useState<UserReputation>(initialReputation);
  const [isFan, setIsFan] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<{
    trusty: number;
    cool: number;
    sexy: number;
  }>({
    trusty: Math.min(3, Math.max(1, Math.round((initialReputation.trustyPercent / 100) * 3))),
    cool: Math.min(3, Math.max(1, Math.round((initialReputation.coolPercent / 100) * 3))),
    sexy: Math.min(3, Math.max(1, Math.round((initialReputation.sexyPercent / 100) * 3))),
  });
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleRate = (category: 'trusty' | 'cool' | 'sexy', level: number) => {
    setUserRating((prev) => ({ ...prev, [category]: level }));
    
    setReputation((prev) => {
      const field = `${category}Percent` as keyof Pick<
        UserReputation,
        'trustyPercent' | 'coolPercent' | 'sexyPercent'
      >;
      return {
        ...prev,
        [field]: Math.round((level / 3) * 100),
      };
    });

    const categoryNames = { trusty: 'Confiável', cool: 'Legal', sexy: 'Carismático' };
    showFeedback(`Você avaliou ${userName} como nível ${level} em ${categoryNames[category]}!`);
  };

  const handleToggleFan = () => {
    if (isFan) {
      setIsFan(false);
      setReputation((prev) => ({ ...prev, fansCount: Math.max(0, prev.fansCount - 1) }));
      showFeedback('Você deixou de ser fã no Klubi.');
    } else {
      setIsFan(true);
      setReputation((prev) => ({ ...prev, fansCount: prev.fansCount + 1 }));
      showFeedback(`Você agora é fã de ${userName} no Klubi! ★`);
    }
  };

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 2800);
  };

  const renderIcons = (
    type: 'trusty' | 'cool' | 'sexy',
    currentLevel: number,
    Icon: React.ElementType,
    activeColor: string,
    inactiveColor: string
  ) => {
    return (
      <div className="flex items-center gap-1.5 my-1">
        {[1, 2, 3].map((num) => {
          const isActive = num <= currentLevel;
          return (
            <motion.button
              key={num}
              type="button"
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleRate(type, num)}
              className="p-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-klubi-secondary/30"
              title={`Avaliar nível ${num}`}
            >
              <Icon
                size={18}
                className={isActive ? activeColor : inactiveColor}
                fill={isActive ? 'currentColor' : 'none'}
              />
            </motion.button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="klubi-card">
      <div className="klubi-card-header">
        <span className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-klubi-accent" />
          <span>Termômetro Social & Fãs</span>
        </span>
        <span className="text-[11px] text-slate-500 font-normal">
          Clique nos ícones para interagir
        </span>
      </div>

      <div className="p-3.5">
        <AnimatePresence>
          {feedbackMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-3 px-3 py-1.5 text-xs bg-klubi-light border border-blue-200 text-klubi-primary rounded-lg font-medium flex items-center justify-between"
            >
              <span>{feedbackMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          {/* Confiável */}
          <div className="flex sm:flex-col items-center justify-between sm:justify-center p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/60">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              Confiável
            </span>
            {renderIcons(
              'trusty',
              userRating.trusty,
              Smile,
              'text-klubi-trusty drop-shadow-xs',
              'text-amber-200'
            )}
            <span className="text-[11px] text-amber-700 font-semibold">
              {reputation.trustyPercent}%
            </span>
          </div>

          {/* Legal */}
          <div className="flex sm:flex-col items-center justify-between sm:justify-center p-2.5 rounded-xl bg-cyan-50/50 border border-cyan-200/60">
            <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider">
              Legal
            </span>
            {renderIcons(
              'cool',
              userRating.cool,
              Snowflake,
              'text-klubi-cool drop-shadow-xs',
              'text-cyan-200'
            )}
            <span className="text-[11px] text-cyan-700 font-semibold">
              {reputation.coolPercent}%
            </span>
          </div>

          {/* Carismático / Sexy */}
          <div className="flex sm:flex-col items-center justify-between sm:justify-center p-2.5 rounded-xl bg-rose-50/50 border border-rose-200/60">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
              Carismático
            </span>
            {renderIcons(
              'sexy',
              userRating.sexy,
              Heart,
              'text-klubi-sexy drop-shadow-xs',
              'text-rose-200'
            )}
            <span className="text-[11px] text-rose-700 font-semibold">
              {reputation.sexyPercent}%
            </span>
          </div>

          {/* Fãs */}
          <div className="flex sm:flex-col items-center justify-between sm:justify-center p-2.5 rounded-xl bg-pink-50/50 border border-pink-200/60">
            <span className="text-[11px] font-bold text-klubi-accent uppercase tracking-wider flex items-center gap-1">
              <Star size={12} className="text-klubi-gold fill-klubi-gold" />
              Fãs
            </span>
            <div className="flex items-center gap-1 font-bold text-sm text-slate-800 my-0.5">
              <span className="text-base text-klubi-accent font-black">{reputation.fansCount}</span>
              <span className="text-xs font-normal text-slate-500">fãs</span>
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleFan}
              className={`mt-1 px-3 py-1 rounded-lg text-xs font-semibold transition border ${
                isFan
                  ? 'bg-klubi-accent text-white border-klubi-accent'
                  : 'bg-white text-klubi-accent border-rose-200 hover:bg-rose-50'
              }`}
            >
              {isFan ? '★ Sou Fã' : '+ Virar Fã'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
