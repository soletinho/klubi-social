'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { User as UserIcon } from 'lucide-react';

interface KlubiAvatarProps {
  src?: string | null;
  alt: string;
  size?: number; // em pixels (ex: 40, 64, 176)
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

export const KlubiAvatar: React.FC<KlubiAvatarProps> = ({
  src,
  alt,
  size = 48,
  className = '',
  priority = false,
  fill = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(src || null);

  useEffect(() => {
    setHasError(false);
    setCurrentSrc(src || null);
  }, [src]);

  // Fallback seguro estilo retrô Orkut
  const defaultFallback = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(alt || 'klubi')}`;
  const effectiveSrc = hasError || !currentSrc ? defaultFallback : currentSrc;

  // Verifica se é Data URL, blob ou SVG para desativar otimizador do Next e evitar erro 400
  const isDataUrl = effectiveSrc.startsWith('data:') || effectiveSrc.startsWith('blob:');
  const isSvg = effectiveSrc.includes('.svg') || effectiveSrc.startsWith('data:image/svg');
  const isUnoptimized = isDataUrl || isSvg;

  if (fill) {
    return (
      <div className="relative w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={effectiveSrc}
          alt={alt}
          onError={() => {
            if (!hasError) setHasError(true);
          }}
          className={`w-full h-full object-cover ${className}`}
        />
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative shrink-0 overflow-hidden bg-slate-100 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={effectiveSrc}
        alt={alt}
        width={size}
        height={size}
        onError={() => {
          if (!hasError) setHasError(true);
        }}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
