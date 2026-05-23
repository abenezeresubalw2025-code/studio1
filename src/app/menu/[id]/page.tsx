'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MENU_CATEGORIES } from '@/lib/menu-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Clock, Flame, Info } from 'lucide-react';
import Image from 'next/image';

export default function DishDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  // Find the item in our menu data
  const dish = MENU_CATEGORIES.flatMap(cat => cat.items).find(item => item.id === id);

  if (!dish) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Dish not found</h1>
          <Button onClick={() => router.push('/menu')}>Back to Menu</Button>
        </div>
      </div>
    );
  }

  const itemImg = PlaceHolderImages.find(img => img.id === dish.image);

  return (
    <main className="min-h-screen bg-background pb-24">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-32 max-w-5xl">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="mb-8 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Menu
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Dish Image Section */}
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-muted/30 shadow-2xl border-4 border-white">
            <Image
              src={itemImg?.imageUrl || ''}
              alt={dish.name}
              fill
              className="object-contain p-8"
              priority
            />
            <div className="absolute top-6 right-6">
              <Badge className="bg-white/90 backdrop-blur-sm text-primary font-bold px-4 py-2 rounded-full shadow-lg border-none text-lg">
                {dish.price}
              </Badge>
            </div>
          </div>

          {/* Dish Details Section */}
          <div className="space-y-8 fade-in-stagger">
            <div>
              <div className="flex items-center gap-2 mb-4">
                {dish.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-secondary/10 text-secondary border-none px-3 py-1 font-bold tracking-wider uppercase text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-headline font-black text-primary leading-tight tracking-tighter mb-4">
                {dish.name}
              </h1>
              <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground/60 mb-6 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-secondary text-secondary" /> 4.9 (120+ Reviews)</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 15-20 Min</span>
                <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-primary" /> 450 Cal</span>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed italic border-l-4 border-primary/20 pl-6 py-2">
                "{dish.description}"
              </p>
            </div>

            <div className="p-8 bg-white rounded-[2rem] border border-primary/5 shadow-xl space-y-6">
              <h3 className="text-xl font-headline font-bold flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" /> Why you'll love it
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Prepared with the freshest ingredients sourced daily from local Bahirdar markets. Our chef uses a heritage family spice blend roasted to perfection, ensuring every bite is a journey through authentic Ethiopian flavors.
              </p>
              
              <div className="pt-6 border-t flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Price</span>
                  <span className="text-3xl font-black text-primary">{dish.price}</span>
                </div>
                <Button className="h-16 px-12 rounded-2xl bg-primary text-white text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                  Add to Order
                </Button>
              </div>
            </div>

            {/* Visual "Pictures" Hint Section */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Gallery</h4>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-square relative rounded-2xl overflow-hidden bg-muted hover:opacity-80 transition-opacity cursor-pointer border-2 border-transparent hover:border-primary/20">
                     <Image 
                      src={`https://picsum.photos/seed/${dish.id}-${i}/400/400`} 
                      alt={`Gallery view ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
