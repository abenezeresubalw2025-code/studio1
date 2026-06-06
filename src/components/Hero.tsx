'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export function Hero() {
  const firestore = useFirestore();

  const siteRef = useMemoFirebase(() => 
    firestore ? doc(firestore, 'settings', 'site') : null, 
    [firestore]
  );
  
  const { data: settings } = useDoc(siteRef);
  
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg');
  const heroVideoUrl = settings?.heroVideoId;

  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-muted">
      {/* Background Section */}
      <div className="absolute inset-0 z-0">
        {heroVideoUrl ? (
          <video
            src={heroVideoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-60 brightness-75"
          />
        ) : (
          <Image 
            src={heroImg?.imageUrl || ''} 
            alt={heroImg?.description || ''}
            fill
            className="object-cover opacity-60 brightness-75"
            priority
            data-ai-hint="restaurant interior"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl fade-in-stagger">
          <div className="inline-flex items-center gap-3 bg-primary/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-primary/20">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-primary font-bold tracking-widest uppercase text-xs">Welcome to Lake Cafe</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-headline font-black text-foreground leading-[1] mb-8 tracking-tighter">
            The Art of <br />
            <span className="text-primary italic">Hand-Crafted</span> Flavor
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-xl">
            Experience a symphony of local spices and heritage. Authentic recipes meet modern craft in the heart of Bahir Dar.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-12 h-16 rounded-full shadow-2xl shadow-primary/20">
              Explore Our Menu
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary/5 text-lg px-12 h-16 rounded-full">
              Reserve a Table
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative vertical line */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 opacity-30 animate-bounce">
        <span className="text-xs uppercase tracking-[0.5em] vertical-text font-bold">Discover</span>
        <div className="w-px h-24 bg-primary" />
      </div>
    </section>
  );
}
