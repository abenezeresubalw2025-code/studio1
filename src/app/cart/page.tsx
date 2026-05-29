
'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Loader2, Minus, Plus } from 'lucide-react';
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
    window.dispatchEvent('cart-updated');
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
      const priceVal = parseFloat(item.price.replace('$', ''));
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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-primary uppercase tracking-wider">My Cart</h1>
        </div>

        {cartItems.length > 0 ? (
          <div className="space-y-6">
            <div className="space-y-4">
              {cartItems.map((item) => {
                const isBase64 = item.image?.startsWith('data:image');
                const isUrl = item.image?.startsWith('http');
                const imageUrl = (isBase64 || isUrl) ? item.image : (PlaceHolderImages.find(p => p.id === item.image)?.imageUrl || '');
                const priceVal = parseFloat(item.price.replace('$', ''));

                return (
                  <div key={item.id} className="bg-white rounded-[2.5rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 flex items-center gap-5 relative group">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-slate-300 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="w-24 h-24 relative rounded-3xl overflow-hidden shrink-0 bg-slate-50">
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
                    
                    <div className="flex-1 flex flex-col justify-between py-1 h-24">
                      <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{item.name}</h3>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-lg active:scale-90 transition-transform"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-black text-lg w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-lg active:scale-90 transition-transform"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-between items-end py-1 h-24 text-right pr-2">
                      <span className="text-primary font-bold text-sm tracking-tight">${priceVal.toFixed(2)}</span>
                      <span className="text-slate-800 font-black text-xl">${(priceVal * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-[3rem] p-10 mt-12 shadow-[0_15px_50px_rgba(0,0,0,0.03)] border border-slate-50 space-y-5">
              <div className="flex justify-between items-center text-slate-400 font-bold">
                <span>Item Total:</span>
                <span className="text-slate-800 font-black">${calculateItemTotal()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 font-bold">
                <span>Tax:</span>
                <span className="text-slate-800 font-black">$2.00</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 font-bold">
                <span>Delivery Services:</span>
                <span className="text-slate-800 font-black">$10.00</span>
              </div>
              
              <div className="pt-8 mt-4 border-t border-dashed border-slate-100 flex justify-between items-end">
                <span className="text-3xl font-black text-slate-800 tracking-tighter">Total:</span>
                <span className="text-4xl font-black text-slate-800 tracking-tighter">${calculateGrandTotal()}</span>
              </div>
              
              <Button className="w-full h-18 bg-[#f9a03f] hover:bg-[#e89134] text-white rounded-full text-2xl font-black shadow-[0_15px_30px_rgba(249,160,63,0.3)] mt-10 border-none active:scale-[0.98] transition-all py-8">
                Checkout
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] shadow-sm border border-slate-50">
            <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingCart className="w-12 h-12 text-muted-foreground/30" />
            </div>
            <h3 className="text-2xl font-bold text-slate-400 mb-6">Your basket is empty</h3>
            <Link href="/menu">
              <Button className="rounded-full px-10 h-14 bg-primary text-lg font-bold">
                Start Ordering
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
