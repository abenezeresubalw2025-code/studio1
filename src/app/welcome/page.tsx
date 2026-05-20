import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, UtensilsCrossed } from 'lucide-react';

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
        <div className="max-w-3xl mx-auto space-y-12 fade-in-stagger">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-3xl border border-primary/20 mb-4">
            <UtensilsCrossed className="w-12 h-12 text-primary" />
          </div>
          
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-headline font-black text-foreground tracking-tighter">
              T-SHAWARMA
            </h1>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
            <p className="text-2xl md:text-3xl text-muted-foreground font-light leading-relaxed">
              Where Ancient Spices Meet <span className="text-primary italic font-serif">Modern Craft</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Button asChild size="lg" className="h-20 px-12 rounded-full text-xl font-headline shadow-2xl shadow-primary/30 transition-all hover:scale-105">
              <Link href="/" className="flex items-center gap-3">
                Experience the Flavor <ArrowRight className="w-6 h-6" />
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground uppercase tracking-[0.4em] pt-12">
            Hand-Carved • Flame-Roasted • Chef-Inspired
          </p>
        </div>
      </div>

      {/* Subtle corner gradients */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
    </main>
  );
}
