
"use client"

import React, { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, X, Heart, Star, Loader2, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface MenuSectionProps {
  cols?: 1 | 2;
  showCategories?: boolean;
  limit?: number;
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

export function MenuSection({ cols = 2, showCategories = true, limit }: MenuSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();

  const menuQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'menu');
  }, [firestore]);

  const categoriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'categories');
  }, [firestore]);

  const { data: menuItems, loading } = useCollection(menuQuery);
  const { data: categories } = useCollection(categoriesQuery);
  const headImg = PlaceHolderImages.find(img => img.id === 'hero-bg');

  // Filtering logic based on search and category
  const filteredItems = (menuItems || []).filter(item => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !activeCategory || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Apply limit if provided (e.g. for homepage)
  const displayedItems = limit ? filteredItems.slice(0, limit) : filteredItems;

  const handleAddToCart = (e: React.MouseEvent, itemName: string) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    const currentCount = parseInt(localStorage.getItem('cartCount') || '0');
    localStorage.setItem('cartCount', (currentCount + 1).toString());
    window.dispatchEvent(new Event('cart-updated'));
    
    toast({
      title: "Added to Cart!",
      description: `${itemName} has been added to your order.`,
    });
  };

  return (
    <section id="menu" className={cn("bg-background", limit ? "pb-12" : "pb-24")}>
      <div className="relative w-full h-[25vh] md:h-[30vh] overflow-hidden mb-8">
        <Image 
          src={headImg?.imageUrl || ''} 
          alt={headImg?.description || 'Menu Banner'} 
          fill 
          className="object-cover brightness-[0.6] scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/10 to-black/30" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-16">
          <div className="w-full max-w-xl px-6 -mt-[30px]">
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

            {/* Horizontally scrolling categories */}
            {showCategories && (
              <div className="mt-6 flex overflow-x-auto horizontal-snap gap-3 pb-2 no-scrollbar px-2">
                {categories?.map((cat: any) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                    className={cn(
                      "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border-2 flex items-center gap-2",
                      activeCategory === cat.name 
                        ? "bg-white text-primary border-white shadow-lg scale-105" 
                        : "bg-black/20 text-white/80 border-white/20 hover:bg-black/40"
                    )}
                  >
                    {cat.image ? (
                      <div className="w-4 h-4 rounded-full overflow-hidden relative border border-white/20">
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <Layers className="w-3 h-3" />
                    )}
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className={cn(
            "grid gap-4 md:gap-8 mx-auto",
            cols === 1 ? "grid-cols-1 max-w-md" : "grid-cols-2 lg:grid-cols-3 max-w-6xl"
          )}>
            {displayedItems.map((item, index) => {
              const isBase64 = item.image?.startsWith('data:image');
              const isUrl = item.image?.startsWith('http');
              const imageUrl = (isBase64 || isUrl) ? item.image : (PlaceHolderImages.find(p => p.id === item.image)?.imageUrl || '');
              const cardBg = MENU_ITEM_COLORS[index % MENU_ITEM_COLORS.length];
              
              return (
                <Link key={item.id} href={`/menu/${item.id}`} className="block transition-transform active:scale-[0.96] duration-200">
                  <Card 
                    className={cn(
                      "group border-none shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden rounded-[1.5rem] relative cursor-pointer",
                      cardBg
                    )}
                  >
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shadow-sm"
                    >
                      <Heart className="w-4 h-4" />
                    </button>

                    <div className="aspect-square relative p-0">
                      {imageUrl && (
                        <Image 
                          src={imageUrl} 
                          alt={item.name} 
                          fill 
                          className="object-contain p-0 transition-transform duration-700 group-hover:scale-110"
                          unoptimized={isBase64}
                        />
                      )}
                    </div>

                    <CardContent className="p-4 md:p-6 pt-0 pb-12">
                      <h3 className="text-xs md:text-sm font-bold tracking-tight line-clamp-1 text-slate-900 mb-1">
                        {item.name}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-black text-primary">{item.price}</p>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-tr-2xl rounded-bl-[1.5rem] flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold text-slate-700">{item.rating || '4.8'}</span>
                      </div>
                      
                      <button 
                        onClick={(e) => handleAddToCart(e, item.name)}
                        className="absolute bottom-0 right-0 w-12 h-12 bg-primary text-white flex items-center justify-center rounded-tl-2xl rounded-br-[1.5rem] hover:bg-primary/90 transition-colors active:scale-95 group-hover:shadow-lg"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
        
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="inline-block p-10 rounded-[3rem] bg-muted/30 border-2 border-dashed border-primary/20">
              <p className="text-2xl text-muted-foreground font-headline italic mb-4">No dishes found</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory(null);
                }}
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
