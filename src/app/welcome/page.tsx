
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
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#ffffff]">
      {/* Background Split: Main white area with a bold red accent on the right */}
      <div className="absolute inset-0 z-0 flex">
        <div className="w-full md:w-3/4 bg-[#ffffff]" />
        <div className="hidden md:block md:w-1/4 bg-primary" />
      </div>

      {/* Decorative Branding Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <h2 className="text-[20vw] font-headline font-black text-muted/10 whitespace-nowrap leading-none">
          T-SHAWARMA
        </h2>
      </div>

      {/* Featured Picture - Centered, no border, no background on image itself */}
      {welcomeImgUrl && (
        <div className="relative z-10 w-[80vw] h-[80vh] max-w-[650px] max-h-[650px] transition-all duration-1000 ease-in-out hover:scale-105">
          <Image 
            src={welcomeImgUrl} 
            alt="Welcome Image"
            fill
            className="object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.25)]"
            priority
            unoptimized={welcomeImgUrl.startsWith('data:') || welcomeImgUrl.includes('ftcdn.net') || welcomeImgUrl.includes('vecteezy.com')}
          />
        </div>
      )}

      {/* Red accent for mobile view */}
      <div className="md:hidden absolute top-0 right-0 w-2 h-full bg-primary z-20" />
    </main>
  );
}
