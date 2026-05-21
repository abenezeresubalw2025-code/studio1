'use client';

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function WelcomePage() {
  const firestore = useFirestore();
  const { data: settings } = useDoc(firestore ? doc(firestore, 'settings', 'site') : null);

  // Default to the roast chicken special which is transparent
  const welcomeImageId = settings?.welcomeImageId || 'roast-chicken-special';
  
  // Determine if we are using a preset ID, a custom base64 string, or a direct URL
  let welcomeImgUrl = '';
  if (welcomeImageId.startsWith('data:image') || welcomeImageId.startsWith('http')) {
    welcomeImgUrl = welcomeImageId;
  } else {
    welcomeImgUrl = PlaceHolderImages.find(img => img.id === welcomeImageId)?.imageUrl || '';
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#ffffff]">
      {/* Animated Red Wave Background on the left side with decreased width */}
      <div className="absolute inset-y-0 left-0 w-full md:w-[calc(50%-75px)] z-0 overflow-hidden pointer-events-none">
        <svg 
          viewBox="0 0 500 1000" 
          className="h-full w-full object-cover" 
          preserveAspectRatio="none"
        >
          <path fill="hsl(var(--primary))">
            <animate 
              attributeName="d" 
              dur="15s" 
              repeatCount="indefinite"
              values="
                M0,0 L0,1000 L300,1000 C450,850 150,700 300,500 C450,300 150,150 300,0 Z;
                M0,0 L0,1000 L400,1000 C250,850 550,700 400,500 C250,300 550,150 400,0 Z;
                M0,0 L0,1000 L300,1000 C450,850 150,700 300,500 C450,300 150,150 300,0 Z
              "
            />
          </path>
        </svg>
      </div>

      {/* Decorative Branding Text (Background layer) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <h2 className="text-[18vw] font-headline font-black text-primary/5 whitespace-nowrap leading-none uppercase tracking-tighter">
          T-Shawarma
        </h2>
      </div>

      {/* Featured Picture - Positioned top right, 200x200px */}
      {welcomeImgUrl && (
        <div className="absolute top-8 right-8 z-20 w-[200px] h-[200px] transition-all duration-700 ease-in-out hover:scale-110 drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <Image 
            src={welcomeImgUrl} 
            alt="Welcome Image"
            width={200}
            height={200}
            className="object-contain"
            priority
            unoptimized={welcomeImgUrl.startsWith('data:') || welcomeImgUrl.includes('ftcdn.net') || welcomeImgUrl.includes('vecteezy.com')}
          />
        </div>
      )}
    </main>
  );
}
