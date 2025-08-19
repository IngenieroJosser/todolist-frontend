'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function NotFoundPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShowParticles(true);
    setIsVisible(true);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#0e1a26] to-[#0f1a27] text-white transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Head>
        <title>Página no encontrada | Taskly</title>
        <meta name="description" content="La página que buscas no existe" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Efecto de partículas */}
      <div className="fixed inset-0 overflow-hidden z-0">
        {showParticles && (
          <>
            {[...Array(30)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-white animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 8 + 2}px`,
                  height: `${Math.random() * 8 + 2}px`,
                  animationDuration: `${Math.random() * 10 + 5}s`,
                  opacity: Math.random() * 0.1 + 0.05,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0e1a26]/30 via-[#0f1a27]/10 to-[#0e1a26]"></div>
          </>
        )}
      </div>

      <main className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center relative z-10">
        <div className="text-center max-w-2xl">
          {/* Animación de número 404 */}
          <div className="relative mb-8">
            <div className="text-[180px] md:text-[240px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] leading-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[180px] md:text-[240px] font-bold text-[#0e1a26] opacity-10 leading-none">
                404
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            ¡Ups! Página no encontrada
          </h1>
          
          <p className="text-lg text-[#a9c7d8] mb-10 max-w-lg mx-auto">
            La página que estás buscando no existe o ha sido movida. 
            Vuelve al inicio o explora nuestras funcionalidades.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] text-[#0e1a26] font-bold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#5ab9ea]/30 group relative overflow-hidden"
            >
              <span className="relative z-10">Volver al inicio</span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button
              onClick={() => router.push('/features')}
              className="px-8 py-3 rounded-xl bg-[#1a2a3a] border border-[#2a3a4a] text-white font-bold text-lg hover:bg-[#2a3a4a] transition-all duration-300 group relative overflow-hidden"
            >
              <span className="relative z-10">Ver características</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
        
        {/* Ilustración espacial */}
        <div className="mt-16 relative">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 rounded-full bg-[#5ab9ea] opacity-20 blur-2xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-[#a9c7d8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            {/* Planetas flotantes */}
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className={`absolute rounded-full bg-gradient-to-br ${
                  i === 1 ? 'from-[#5ab9ea] to-[#84ceeb] w-10 h-10 top-8 left-4 animate-float' : 
                  i === 2 ? 'from-[#ff7eb3] to-[#ff758c] w-6 h-6 bottom-10 right-8 animate-float animation-delay-2000' : 
                  'from-[#7af9a9] to-[#84eeb7] w-8 h-8 top-20 right-4 animate-float animation-delay-4000'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}