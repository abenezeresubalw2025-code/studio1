
"use client"

import React, { useState } from 'react';
import { MENU_CATEGORIES } from '@/lib/menu-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, X } from 'lucide-react';

interface MenuSectionProps {
  cols?: 1 | 2;
  showCategories?: boolean;
}

export function MenuSection({ cols = 2, showCategories = true }: MenuSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const headImg = PlaceHolderImages.find(img => img.id === 'hero-bg');
  
  // Flatten all items from all categories
  const allItems = MENU_CATEGORIES.flatMap(cat => cat.items);

  // Filtering logic
  const filteredItems = allItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section id="menu" className="bg-background pb-24">
      {/* Head image header - acting as a Hero banner */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden mb-16">
        <Image 
          src={headImg?.imageUrl || ''} 
          alt={headImg?.description || 'Menu Banner'} 
          fill 
          className="object-cover brightness-[0.6] scale-105"
          priority
          data-ai-hint="shawarma wrap"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/10 to-black/30" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-16 md:pt-24">
          {/* Search Bar Container - Under header banner */}
          <div className="w-full max-w-xl px-6 mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 -mt-[50px]">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white/90 group-focus-within:text-white transition-colors" />
              </div>
              <Input
                type="text"
                placeholder="Find your flavor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-14 pr-14 bg-transparent border-white/40 text-white placeholder:text-white/70 rounded-full focus:bg-white/10 focus:border-white/60 focus-visible:ring-0 transition-all text-lg border-2 shadow-2xl"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Menu Items Grid */}
        <div className={`grid ${cols === 1 ? 'grid-cols-1 max-w-2xl' : 'grid-cols-2 max-w-6xl'} gap-4 md:gap-12 mx-auto fade-in-stagger`}>
          {filteredItems.map((item) => {
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
        
        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="inline-block p-10 rounded-[3rem] bg-muted/30 border-2 border-dashed border-primary/20">
              <p className="text-3xl text-muted-foreground font-headline italic mb-4">No dishes match "{searchQuery}"</p>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
                className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-white"
              >
                View all items
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
