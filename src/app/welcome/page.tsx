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
      {/* Background layer set to pure white */}
      <div className="absolute inset-0 z-0 bg-[#ffffff]" />

      {/* Featured Picture - No border, no background, no shadow */}
      {welcomeImgUrl && (
        <div className="absolute top-12 right-12 w-[300px] h-[300px] z-20 transition-all duration-500">
          <Image 
            src={welcomeImgUrl} 
            alt="Welcome Image"
            fill
            className="object-contain"
            unoptimized={welcomeImgUrl.startsWith('data:') || welcomeImgUrl.includes('ftcdn.net') || welcomeImgUrl.includes('vecteezy.com')}
          />
        </div>
      )}

      {/* Decorative elements removed to ensure "only show image" with "no background" appearance */}
    </main>
  );
}
