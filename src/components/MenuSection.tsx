
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
      {/* Head image only header */}
      <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden mb-16">
        <Image 
          src={headImg?.imageUrl || ''} 
          alt={headImg?.description || 'Menu Banner'} 
          fill 
          className="object-cover brightness-[0.85]"
          priority
          data-ai-hint="shawarma meat"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <h2 className="text-5xl md:text-8xl font-headline font-black text-white tracking-tighter drop-shadow-2xl">
              Explore Our <span className="text-primary italic">Menu</span>
            </h2>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all ${
                activeCategory === cat.id 
                ? 'bg-primary text-white shadow-xl scale-105' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-in-stagger">
          {MENU_CATEGORIES.find(c => c.id === activeCategory)?.items.map((item) => {
            const itemImg = PlaceHolderImages.find(img => img.id === item.image);
            return (
              <Card key={item.id} className="group border-none shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white/50 backdrop-blur-sm">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image 
                    src={itemImg?.imageUrl || ''} 
                    alt={item.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint={itemImg?.imageHint}
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-primary font-bold px-4 py-1 text-lg shadow-md border-none">
                      {item.price}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-3 group-hover:text-primary transition-colors">{item.name}</h3>
                  <p className="text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
