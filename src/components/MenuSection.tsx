
"use client"

import React from 'react';
import { MENU_CATEGORIES } from '@/lib/menu-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface MenuSectionProps {
  cols?: 1 | 2;
  showCategories?: boolean;
}

export function MenuSection({ cols = 2, showCategories = true }: MenuSectionProps) {
  const headImg = PlaceHolderImages.find(img => img.id === 'hero-bg');
  
  // Flatten all items from all categories since tabs are removed
  const allItems = MENU_CATEGORIES.flatMap(cat => cat.items);

  return (
    <section id="menu" className="bg-background pb-24">
      {/* Head image header */}
      <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden mb-16">
        <Image 
          src={headImg?.imageUrl || ''} 
          alt={headImg?.description || 'Menu Banner'} 
          fill 
          className="object-cover brightness-[0.7] scale-105"
          priority
          data-ai-hint="shawarma wrap"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-black/40" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-20">
          <div className="text-center px-6 animate-in fade-in slide-in-from-top-8 duration-700">
            <h2 className="text-5xl md:text-8xl font-headline font-black text-white tracking-tighter drop-shadow-2xl mb-4">
              Top <span className="text-primary italic">Menu</span>
            </h2>
            <p className="text-white/80 text-lg md:text-xl font-medium tracking-wide max-w-xl mx-auto drop-shadow-md">
              Discover our hand-carved perfection, curated for the true flavor enthusiast.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Menu Items Grid */}
        <div className={`grid ${cols === 1 ? 'grid-cols-1 max-w-2xl' : 'grid-cols-2 max-w-6xl'} gap-4 md:gap-12 mx-auto fade-in-stagger`}>
          {allItems.map((item) => {
            const itemImg = PlaceHolderImages.find(img => img.id === item.image);
            return (
              <Card key={item.id} className="group border-none shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white rounded-[1.5rem] md:rounded-[2.5rem]">
                <div className="aspect-[4/3] md:aspect-[16/10] relative overflow-hidden">
                  <Image 
                    src={itemImg?.imageUrl || ''} 
                    alt={item.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint={itemImg?.imageHint}
                  />
                  <div className="absolute top-2 right-2 md:top-6 md:right-6">
                    <Badge className="bg-white/95 text-primary font-black px-2 py-1 md:px-5 md:py-2 text-[10px] md:text-xl shadow-xl border-none rounded-lg md:rounded-2xl">
                      {item.price}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4 md:p-10 flex flex-col h-full">
                  <div className="hidden md:flex flex-wrap gap-2 mb-6">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-black uppercase tracking-[0.15em] text-secondary bg-secondary/10 px-3 py-1 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-sm md:text-3xl font-headline font-black mb-1 md:mb-4 group-hover:text-primary transition-colors tracking-tight line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-[10px] md:text-base text-muted-foreground line-clamp-2 leading-tight md:leading-relaxed font-medium mb-4 md:mb-8">
                    {item.description}
                  </p>
                  
                  <div className="mt-auto flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 h-8 md:h-14 text-[10px] md:text-sm font-black uppercase tracking-widest rounded-lg md:rounded-2xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all active:scale-95 group/btn"
                    >
                      <Plus className="w-4 h-4 md:w-6 md:h-6 mr-1 group-hover/btn:rotate-90 transition-transform" />
                      Add to Cart
                    </Button>
                    <Button 
                      className="h-8 w-8 md:h-14 md:w-14 rounded-lg md:rounded-2xl bg-primary text-white shadow-xl hover:scale-105 transition-all active:scale-90 font-bold text-xl"
                    >
                      +
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
