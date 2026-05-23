"use client"

import React, { useState } from 'react';
import { MENU_CATEGORIES } from '@/lib/menu-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, X, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface MenuSectionProps {
  cols?: 1 | 2;
  showCategories?: boolean;
}

const MENU_ITEM_COLORS = [
  'bg-orange-100',
  'bg-red-100',
  'bg-rose-100',
  'bg-amber-100',
  'bg-emerald-100',
  'bg-sky-100',
  'bg-violet-100',
  'bg-indigo-100',
  'bg-teal-100',
  'bg-fuchsia-100',
  'bg-cyan-100',
];

export function MenuSection({ cols = 2, showCategories = true }: MenuSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const headImg = PlaceHolderImages.find(img => img.id === 'hero-bg');
  
  // Flatten all items from all categories and filter to only those with valid images
  const allItemsWithImages = MENU_CATEGORIES.flatMap(cat => cat.items).filter(item => 
    PlaceHolderImages.some(img => img.id === item.image)
  );

  // Filtering logic based on search
  const filteredItems = allItemsWithImages.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddToCart = (e: React.MouseEvent, itemName: string) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the link to the detail page from triggering
    
    const currentCount = parseInt(localStorage.getItem('cartCount') || '0');
    localStorage.setItem('cartCount', (currentCount + 1).toString());
    window.dispatchEvent(new Event('cart-updated'));
    
    toast({
      title: "Added to Cart!",
      description: `${itemName} has been added to your order.`,
    });
  };

  return (
    <section id="menu" className="bg-background pb-24">
      {/* Head image header */}
      <div className="relative w-full h-[25vh] md:h-[30vh] overflow-hidden mb-8">
        <Image 
          src={headImg?.imageUrl || ''} 
          alt={headImg?.description || 'Menu Banner'} 
          fill 
          className="object-cover brightness-[0.6] scale-105"
          priority
          data-ai-hint="shawarma wrap"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/10 to-black/30" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-16">
          <div className="w-full max-w-xl px-6 -mt-[50px] animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white/90" />
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
        <div className={cn(
          "grid gap-4 md:gap-8 mx-auto",
          cols === 1 ? "grid-cols-1 max-w-md" : "grid-cols-2 lg:grid-cols-3 max-w-6xl"
        )}>
          {filteredItems.map((item, index) => {
            const itemImg = PlaceHolderImages.find(img => img.id === item.image);
            const cardBg = MENU_ITEM_COLORS[index % MENU_ITEM_COLORS.length];
            
            return (
              <Link key={item.id} href={`/menu/${item.id}`}>
                <Card 
                  className={cn(
                    "group border-none shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden rounded-[1.5rem] relative cursor-pointer",
                    cardBg
                  )}
                >
                  {/* Heart/Favorite Icon */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shadow-sm"
                  >
                    <Heart className="w-4 h-4" />
                  </button>

                  <div className="aspect-square relative p-0">
                    <Image 
                      src={itemImg?.imageUrl || ''} 
                      alt={item.name} 
                      fill 
                      className="object-contain p-0 transition-transform duration-700 group-hover:scale-110"
                      data-ai-hint={itemImg?.imageHint}
                    />
                  </div>

                  <CardContent className="p-6 pt-0">
                    <h3 className="text-lg md:text-xl font-bold mb-1 tracking-tight line-clamp-1 text-slate-900">
                      {item.name}
                    </h3>
                    
                    <div className="flex flex-col mb-4">
                      <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Starting From</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-slate-900">{item.price}</span>
                        <span className="text-xs text-slate-300 line-through">
                          ${(parseFloat(item.price.replace('$', '')) + 2).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Plus/Add Button - Swapped to High Contrast (Primary Red on Light) */}
                    <button 
                      onClick={(e) => handleAddToCart(e, item.name)}
                      className="absolute bottom-0 right-0 w-14 h-14 bg-primary text-white flex items-center justify-center rounded-tl-2xl rounded-br-[1.5rem] hover:bg-primary/90 transition-colors active:scale-95 group-hover:shadow-lg"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
        
        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="inline-block p-10 rounded-[3rem] bg-muted/30 border-2 border-dashed border-primary/20">
              <p className="text-2xl text-muted-foreground font-headline italic mb-4">No dishes found</p>
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