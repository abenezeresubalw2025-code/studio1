
import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Parallax-style background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={heroImg?.imageUrl || ''} 
          alt={heroImg?.description || ''}
          fill
          className="object-cover opacity-80"
          priority
          data-ai-hint="shawarma meat"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl fade-in-stagger">
          <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Est. 2024 • Authentic Flavor</span>
          <h1 className="text-6xl md:text-8xl font-headline font-black text-foreground leading-[1.1] mb-6">
            The Soul of <span className="text-primary italic">Shawarma</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg">
            Experience a symphony of spices and textures. Hand-carved perfection, 
            marinated in secret traditions, served for the modern palate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-10 h-16 rounded-full">
              Explore Menu
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 text-lg px-10 h-16 rounded-full">
              Our Story
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative vertical line */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50 animate-bounce">
        <span className="text-xs uppercase tracking-[0.3em] vertical-text">Scroll</span>
        <div className="w-px h-16 bg-primary" />
      </div>
    </section>
  );
}
