'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Compass } from 'lucide-react';
import { CreateCommunityModal } from '@/components/CreateCommunityModal';

export default function CreateCommunityPage() {
  const router = useRouter();

  return (
    <div className="max-w-xl mx-auto py-4">
      <Link
        href="/communities"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-klubi-primary font-medium mb-3"
      >
        <ArrowLeft size={14} />
        <span>Voltar ao Diretório de Comunidades</span>
      </Link>

      <CreateCommunityModal
        isOpen={true}
        onClose={() => router.push('/communities')}
      />
    </div>
  );
}
