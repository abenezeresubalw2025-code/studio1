import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function WelcomePage() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background">
      {/* Background image base with very low opacity */}
      <div className="absolute inset-0 z-0 opacity-10">
        <Image 
          src={heroImg?.imageUrl || ''} 
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-background/50" />
      </div>

      {/* Red Wave Background Element - Covers the bottom half */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 z-0 pointer-events-none">
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

      <div className="container relative z-10 mx-auto px-6 text-center">
        {/* Main content removed as requested */}
      </div>

      {/* Subtle decorative accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
    </main>
  );
}
