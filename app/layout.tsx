import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { ClientProvider } from '@/components/ClientProvider';

export const metadata: Metadata = {
  title: 'Klubi | A Rede Social de Conexões Reais',
  description: 'Comunidades autênticas, murais de recados, depoimentos e conexões humanas sem algoritmos de feed infinito.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-klubi-bg flex flex-col text-slate-900 antialiased font-sans">
        <ClientProvider>
          <Navbar />
          
          <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 py-5">
            {children}
          </main>

          <footer className="bg-white border-t border-klubi-border py-6 mt-10 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-klubi-primary text-sm tracking-tight">klubi.</span>
                <span className="text-slate-400">© 2026 Klubi Social — Conexões deliberadas, slow web.</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-600 font-medium">
                <a href="#sobre" className="hover:text-klubi-primary transition">Sobre o Klubi</a>
                <a href="#diretrizes" className="hover:text-klubi-primary transition">Diretrizes da Comunidade</a>
                <a href="#privacidade" className="hover:text-klubi-primary transition">Privacidade</a>
                <a href="#seguranca" className="hover:text-klubi-primary transition">Segurança</a>
              </div>
            </div>
          </footer>
        </ClientProvider>
      </body>
    </html>
  );
}
