import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function WelcomePage() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image 
          src={heroImg?.imageUrl || ''} 
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center">
        {/* Main content removed as requested */}
      </div>

      {/* Subtle corner gradients */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
    </main>
  );
}
