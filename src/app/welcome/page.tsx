
'use client';

import React from 'react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function WelcomePage() {
  const firestore = useFirestore();
  
  const siteRef = useMemoFirebase(() => 
    firestore ? doc(firestore, 'settings', 'site') : null, 
    [firestore]
  );
  
  const { data: settings } = useDoc(siteRef);

  const brandName = "Lake Cafe";

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#ffffff]">
      {/* Background Section on the left side */}
      <div className="absolute inset-y-0 left-0 w-full md:w-[calc(35%-100px)] z-0 overflow-hidden pointer-events-none">
        <svg 
          viewBox="0 0 500 1000" 
          className="h-full w-full object-cover" 
          preserveAspectRatio="none"
        >
          <path fill="hsl(var(--primary))" d="M0,0 L0,1000 L250,1000 L250,0 Z" />
        </svg>
      </div>

      {/* Decorative Branding Text (Background layer) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <h2 className="text-[18vw] font-headline font-black text-primary/5 whitespace-nowrap leading-none uppercase tracking-tighter">
          Lake Cafe
        </h2>
      </div>

      {/* Welcome Content: Text Only */}
      <div className="absolute top-8 left-[5px] z-20 max-w-[90vw] -mr-[50px]">
        <div className="text-white mt-4 select-none">
          <h1 className="text-3xl md:text-5xl font-headline font-black leading-[0.9] tracking-tighter uppercase drop-shadow-lg flex flex-col">
            <span className="text-3xl md:text-5xl">Welcome</span>
            <span className="ml-[30px] mb-4 text-2xl md:text-4xl">To</span>
            <div className="text-xl md:text-4xl flex flex-wrap">
              {brandName.split("").map((char, index) => (
                <span 
                  key={index} 
                  className="animate-letter-bounce" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>
            {/* Enhanced Chicken Subtitle with amazing transition */}
            <div className="mt-4 ml-[10px] text-3xl md:text-5xl font-headline italic text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] animate-in fade-in slide-in-from-left-12 slide-in-from-bottom-8 zoom-in-50 duration-1000 delay-[1800ms] fill-mode-both">
              Experience
            </div>
          </h1>
        </div>
      </div>

      {/* Bottom Footer Content */}
      <div className="absolute bottom-12 left-8 z-30 max-w-[280px] md:max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-[2500ms] fill-mode-both">
        <p className="text-red-300 text-sm md:text-lg font-body italic mb-6 leading-relaxed">
          The only Bahirdar restaurant serving the finest local flavors
        </p>
        <Link 
          href="/login" 
          className="inline-block text-white font-bold uppercase tracking-[0.4em] text-xs md:text-sm hover:translate-x-2 transition-transform duration-300 mix-blend-difference"
        >
          Next
        </Link>
      </div>
    </main>
  );
}
