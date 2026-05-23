'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MENU_CATEGORIES } from '@/lib/menu-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Clock, Flame, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function DishDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

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

  const handleAddToCart = () => {
    const currentCount = parseInt(localStorage.getItem('cartCount') || '0');
    localStorage.setItem('cartCount', (currentCount + 1).toString());
    window.dispatchEvent(new Event('cart-updated'));
    
    toast({
      title: "Added to Cart!",
      description: `${dish.name} has been added to your order.`,
    });
  };

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
              <h1 className="text-2xl md:text-3xl font-headline font-black text-primary leading-tight tracking-tighter mb-4">
                {dish.name}
              </h1>
              <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground/60 mb-6 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-secondary text-secondary" /> 4.9 (120+)</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 15-20 Min</span>
                <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-primary" /> 450 Cal</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic border-l-4 border-primary/20 pl-6 py-2">
                "{dish.description}"
              </p>

              {/* Action Area */}
              <div className="mt-8 flex items-center justify-between p-6 bg-white rounded-3xl shadow-sm border border-primary/5">
                <div>
                  <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mb-1">Price</p>
                  <p className="text-3xl font-headline font-bold text-primary">{dish.price}</p>
                </div>
                <Button 
                  size="icon" 
                  onClick={handleAddToCart}
                  className="bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg shadow-primary/20 w-14 h-14"
                >
                  <ShoppingCart className="w-6 h-6" />
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
