'use client';

import React from 'react';
import { ChevronRight, GitFork, User as UserIcon } from 'lucide-react';

interface SeparationNode {
  id: string;
  name: string;
}

interface DegreesOfSeparationProps {
  path?: SeparationNode[];
  targetName?: string;
}

export const DegreesOfSeparation: React.FC<DegreesOfSeparationProps> = ({
  path = [
    { id: 'me', name: 'Você' },
    { id: 'carlos', name: 'Carlos Lima' },
    { id: 'ana', name: 'Ana Paula' },
    { id: 'rodrigo', name: 'Rodrigo Nostálgico' },
  ],
  targetName = 'Rodrigo Nostálgico',
}) => {
  const degrees = Math.max(1, path.length - 1);

  return (
    <div className="klubi-card overflow-hidden">
      <div className="klubi-card-header">
        <span className="flex items-center gap-1.5">
          <GitFork size={14} className="text-klubi-secondary" />
          <span>Graus de Conexão</span>
        </span>
        <span className="bg-klubi-primary text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
          {degrees}º grau
        </span>
      </div>

      <div className="p-3.5 bg-gradient-to-r from-blue-50/40 via-white to-pink-50/30">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {path.map((node, index) => {
            const isFirst = index === 0;
            const isLast = index === path.length - 1;

            return (
              <React.Fragment key={node.id}>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    isFirst
                      ? 'bg-blue-100/90 text-blue-900 border border-blue-200 shadow-2xs'
                      : isLast
                      ? 'bg-rose-100/90 text-klubi-accent font-bold border border-rose-200 shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-200 shadow-2xs hover:border-klubi-secondary'
                  }`}
                >
                  <UserIcon size={13} className={isLast ? 'text-klubi-accent' : isFirst ? 'text-blue-700' : 'text-slate-400'} />
                  <span>{node.name}</span>
                </div>

                {!isLast && (
                  <ChevronRight
                    size={14}
                    className="text-slate-400 shrink-0"
                    strokeWidth={2.5}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <p className="mt-2 text-[11px] text-slate-500">
          Você e <strong>{targetName}</strong> estão a {degrees} laços de proximidade. No Klubi, sua rede se conecta por laços reais!
        </p>
      </div>
    </div>
  );
};
