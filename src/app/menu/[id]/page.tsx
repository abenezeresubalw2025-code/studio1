'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MoreVertical, Minus, Plus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function DishDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const firestore = useFirestore();

  const dishRef = useMemoFirebase(() => {
    if (!firestore || typeof id !== 'string') return null;
    return doc(firestore, 'menu', id);
  }, [firestore, id]);

  const { data: dish, loading } = useDoc(dishRef);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Dish not found</h1>
          <Button onClick={() => router.push('/menu')}>Back to Menu</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const currentCount = parseInt(localStorage.getItem('cartCount') || '0');
    localStorage.setItem('cartCount', (currentCount + quantity).toString());
    window.dispatchEvent(new Event('cart-updated'));
    
    toast({
      title: "Added to Cart!",
      description: `${quantity}x ${dish.name} added to your order.`,
    });
  };

  const isBase64 = dish.image?.startsWith('data:image');
  const isUrl = dish.image?.startsWith('http');
  const imageUrl = (isBase64 || isUrl) ? dish.image : (PlaceHolderImages.find(p => p.id === dish.image)?.imageUrl || '');

  return (
    <main className="min-h-screen bg-white pb-32 relative">
      <div className="relative h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-primary" style={{ clipPath: 'ellipse(100% 60% at 50% 10%)' }}></div>
        
        <div className="relative z-20 flex items-center justify-between p-6">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-transform active:scale-90"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-white">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[280px] h-[280px] z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-50 duration-1000 ease-out fill-mode-both">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={dish.name || 'Dish'}
              fill
              className="object-contain"
              priority
              unoptimized={isBase64}
            />
          )}
        </div>
      </div>

      <div className="px-6 -mt-4 relative z-20 bg-white rounded-t-[3rem] pt-8 animate-in slide-in-from-bottom-8 duration-500">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{dish.name}</h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{dish.category}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-primary">{dish.price}</p>
          </div>
        </div>

        <div className="flex gap-3 my-6">
          <Badge className="bg-primary hover:bg-primary text-white px-5 py-1.5 rounded-full border-none text-[10px] font-bold uppercase tracking-widest">All</Badge>
          <Badge variant="outline" className="text-slate-400 border-slate-100 bg-slate-50 px-5 py-1.5 rounded-full font-medium text-[10px] uppercase tracking-widest">Extra Spice</Badge>
        </div>

        <div className="space-y-4">
          <p className="text-slate-500 leading-relaxed text-xs">
            {dish.description}
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-6 pb-10 flex items-center gap-4 z-50 border-t border-slate-50 animate-in fade-in duration-700">
        <div className="flex items-center gap-4 bg-slate-50 p-1 rounded-full border border-slate-100">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center active:scale-90 transition-transform"
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="text-xl font-bold text-slate-800 w-6 text-center">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center active:scale-90 transition-transform"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-full text-lg shadow-xl shadow-primary/20 transition-transform active:scale-95"
        >
          Add to Cart
        </Button>
      </div>
    </main>
  );
}
