
'use client';

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function WelcomePage() {
  const firestore = useFirestore();
  const { data: settings, loading } = useDoc(firestore ? doc(firestore, 'settings', 'site') : null);

  // Default to the new roast chicken special if no admin setting is found
  const welcomeImageId = settings?.welcomeImageId || 'roast-chicken-special';
  
  // Determine if we are using a preset ID, a custom base64 string, or a direct URL
  let welcomeImgUrl = '';
  if (welcomeImageId.startsWith('data:image') || welcomeImageId.startsWith('http')) {
    welcomeImgUrl = welcomeImageId;
  } else {
    welcomeImgUrl = PlaceHolderImages.find(img => img.id === welcomeImageId)?.imageUrl || '';
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-white">
      {/* Background layer set to pure white */}
      <div className="absolute inset-0 z-0 bg-[#ffffff]" />

      {/* Featured Picture in top right corner - No border, managed by admin */}
      {welcomeImgUrl && (
        <div className="absolute top-12 right-12 w-[150px] h-[150px] z-20 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500">
          <Image 
            src={welcomeImgUrl} 
            alt="Welcome Image"
            fill
            className="object-cover"
            unoptimized={welcomeImgUrl.startsWith('data:') || welcomeImgUrl.includes('ftcdn.net')}
          />
        </div>
      )}

      {/* Red Wave Background Element - Positioned at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[calc(50%-100px)] z-0 pointer-events-none">
        <div className="relative w-full h-full">
          {/* Wave SVG */}
          <svg 
            className="absolute top-0 left-0 w-full h-[150px] -translate-y-full" 
            viewBox="0 0 1440 320" 
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              fill="hsl(var(--primary))" 
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
          {/* Solid block under the wave */}
          <div className="w-full h-full bg-primary" />
        </div>
      </div>
    </main>
  );
}
