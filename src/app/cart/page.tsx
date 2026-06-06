'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Loader2, Minus, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        setCartItems([]);
      }
    }

    const handleCartUpdate = () => {
      const updatedCart = localStorage.getItem('cart');
      if (updatedCart) {
        try {
          setCartItems(JSON.parse(updatedCart));
        } catch (e) {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    };
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  const updateQuantity = (id: string, delta: number) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    
    const newCount = updatedItems.reduce((acc, item) => acc + item.quantity, 0);
    localStorage.setItem('cartCount', newCount.toString());
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    
    const newCount = updatedItems.reduce((acc, item) => acc + item.quantity, 0);
    localStorage.setItem('cartCount', newCount.toString());
    window.dispatchEvent(new Event('cart-updated'));
  };

  const calculateItemTotal = () => {
    const total = cartItems.reduce((total, item) => {
      const priceVal = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return total + (isNaN(priceVal) ? 0 : priceVal * item.quantity);
    }, 0);
    return total.toFixed(2);
  };

  const calculateGrandTotal = () => {
    const itemsTotal = parseFloat(calculateItemTotal());
    const tax = 2.00;
    const delivery = 10.00;
    return (itemsTotal + tax + delivery).toFixed(2);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#FDFCFB] pb-32">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-24 md:pt-32 max-w-xl">
        <div className="text-center mb-6">
          <h1 className="text-xl font-black text-primary uppercase tracking-wider">My Cart</h1>
        </div>

        {cartItems.length > 0 ? (
          <div className="space-y-4">
            <div className="space-y-3">
              {cartItems.map((item) => {
                const isBase64 = item.image?.startsWith('data:image');
                const isUrl = item.image?.startsWith('http');
                const imageUrl = (isBase64 || isUrl) ? item.image : (PlaceHolderImages.find(p => p.id === item.image)?.imageUrl || '');
                const priceVal = parseFloat(item.price.replace(/[^0-9.]/g, ''));

                return (
                  <div key={item.id} className="bg-primary rounded-[1.5rem] p-3 shadow-[0_4px_20px_rgba(28,56,23,0.15)] border border-primary flex items-center gap-4 relative group">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-white shadow-md rounded-full flex items-center justify-center text-slate-300 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 z-10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="w-20 h-20 relative rounded-2xl overflow-hidden shrink-0 bg-white/10">
                      {imageUrl && (
                        <Image 
                          src={imageUrl} 
                          alt={item.name} 
                          fill 
                          className="object-contain p-2"
                          unoptimized={isBase64}
                        />
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1 h-20">
                      <h3 className="font-bold text-base text-white line-clamp-1">{item.name}</h3>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold text-sm active:scale-90 transition-transform hover:bg-white/30"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-black text-base w-4 text-center text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold text-sm active:scale-90 transition-transform hover:bg-white/30"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-between items-end py-1 h-20 text-right pr-2">
                      <span className="text-white/70 font-bold text-[10px] tracking-tight">ETB {priceVal.toFixed(2)}</span>
                      <span className="text-white font-black text-lg">ETB {(priceVal * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-[2rem] p-6 mt-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-slate-50 space-y-3">
              <div className="flex justify-between items-center text-slate-400 font-bold text-sm">
                <span>Item Total:</span>
                <span className="text-slate-800 font-black">ETB {calculateItemTotal()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 font-bold text-sm">
                <span>Tax:</span>
                <span className="text-slate-800 font-black">ETB 2.00</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 font-bold text-sm">
                <span>Delivery:</span>
                <span className="text-slate-800 font-black">ETB 10.00</span>
              </div>
              
              <div className="pt-4 mt-2 border-t border-dashed border-slate-100 flex justify-between items-end">
                <span className="text-xl font-black text-slate-800 tracking-tighter">Total:</span>
                <span className="text-2xl font-black text-slate-800 tracking-tighter">ETB {calculateGrandTotal()}</span>
              </div>
              
              <Button 
                onClick={handleCheckout}
                className="w-full h-14 bg-secondary hover:bg-secondary/90 text-white rounded-full text-lg font-black shadow-[0_10px_20px_rgba(43,125,163,0.2)] mt-6 border-none active:scale-[0.98] transition-all py-6"
              >
                Checkout <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-[2rem] shadow-sm border border-slate-50">
            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <h3 className="text-lg font-bold text-slate-400 mb-4">Your basket is empty</h3>
            <Link href="/menu">
              <Button className="rounded-full px-8 h-12 bg-primary text-sm font-bold">
                Start Ordering
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
