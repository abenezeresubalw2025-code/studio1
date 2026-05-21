
"use client"

import React, { useState } from 'react';
import { MENU_CATEGORIES } from '@/lib/menu-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0].id);
  const headImg = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <section id="menu" className="bg-background pb-24">
      {/* Head image header with integrated category menu */}
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
          <div className="text-center px-6 mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
            <h2 className="text-5xl md:text-8xl font-headline font-black text-white tracking-tighter drop-shadow-2xl mb-4">
              Top <span className="text-primary italic">Menu</span>
            </h2>
            <p className="text-white/80 text-lg md:text-xl font-medium tracking-wide max-w-xl mx-auto drop-shadow-md">
              Discover our hand-carved perfection, curated for the true flavor enthusiast.
            </p>
          </div>

          {/* Integrated Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 bg-white/10 backdrop-blur-xl p-3 md:p-4 rounded-[2rem] border border-white/20 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 md:px-10 py-3 rounded-full text-[10px] md:text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 ${
                  activeCategory === cat.id 
                  ? 'bg-primary text-white shadow-[0_0_30px_rgba(200,16,46,0.4)] scale-105' 
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Menu Items Grid - Updated to 2 columns on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto fade-in-stagger">
          {MENU_CATEGORIES.find(c => c.id === activeCategory)?.items.map((item) => {
            const itemImg = PlaceHolderImages.find(img => img.id === item.image);
            return (
              <Card key={item.id} className="group border-none shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white rounded-[2.5rem]">
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image 
                    src={itemImg?.imageUrl || ''} 
                    alt={item.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint={itemImg?.imageHint}
                  />
                  <div className="absolute top-6 right-6">
                    <Badge className="bg-white/95 text-primary font-black px-5 py-2 text-xl shadow-xl border-none rounded-2xl">
                      {item.price}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-10">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-black uppercase tracking-[0.15em] text-secondary bg-secondary/10 px-3 py-1 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-3xl font-headline font-black mb-4 group-hover:text-primary transition-colors tracking-tight">{item.name}</h3>
                  <p className="text-muted-foreground line-clamp-2 leading-relaxed font-medium">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
