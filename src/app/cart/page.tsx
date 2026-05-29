'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Truck, History, Trash2, ArrowRight, Loader2, Minus, Plus } from 'lucide-react';
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

  const handleClearCart = () => {
    localStorage.removeItem('cart');
    localStorage.removeItem('cartCount');
    setCartItems([]);
    window.dispatchEvent(new Event('cart-updated'));
  };

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

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const priceVal = parseFloat(item.price.replace('$', ''));
      return total + (isNaN(priceVal) ? 0 : priceVal * item.quantity);
    }, 0).toFixed(2);
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
    <main className="min-h-screen bg-background pb-32">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-24 md:pt-32">
        <div className="fade-in-stagger mb-12">
          <h1 className="text-4xl md:text-6xl font-headline font-black text-primary tracking-tighter mb-2">My Orders</h1>
          <p className="text-lg text-muted-foreground font-medium">Manage your flavor journey</p>
        </div>
        
        <Tabs defaultValue="cart" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-16 bg-muted/50 p-1.5 rounded-[2rem] mb-12 border border-primary/5">
            <TabsTrigger value="cart" className="rounded-3xl flex items-center gap-2 h-full text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-lg">
              <ShoppingCart className="w-4 h-4" /> Cart
            </TabsTrigger>
            <TabsTrigger value="delivery" className="rounded-3xl flex items-center gap-2 h-full text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-lg">
              <Truck className="w-4 h-4" /> Delivery
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-3xl flex items-center gap-2 h-full text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-lg">
              <History className="w-4 h-4" /> History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cart" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {cartItems.length > 0 ? (
              <div className="space-y-6">
                <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                  <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl font-headline font-black text-slate-800">Shopping Cart</CardTitle>
                    <Badge className="bg-primary/10 text-primary border-none font-bold px-4 py-1">
                      {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      {cartItems.map((item) => {
                        const isBase64 = item.image?.startsWith('data:image');
                        const isUrl = item.image?.startsWith('http');
                        const imageUrl = (isBase64 || isUrl) ? item.image : (PlaceHolderImages.find(p => p.id === item.image)?.imageUrl || '');

                        return (
                          <div key={item.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-muted/30 rounded-3xl group hover:bg-muted/50 transition-colors gap-6">
                            <div className="flex items-center gap-6 w-full">
                              <div className="w-24 h-24 bg-white rounded-2xl relative overflow-hidden border-2 border-primary/5 flex-shrink-0">
                                {imageUrl && (
                                  <Image 
                                    src={imageUrl} 
                                    alt={item.name} 
                                    fill 
                                    className="object-cover"
                                    unoptimized={isBase64}
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-black text-xl text-slate-800">{item.name}</p>
                                <p className="text-primary font-bold">{item.price}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                              <div className="flex items-center gap-4 bg-white p-1 rounded-full border shadow-sm">
                                <button 
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-bold w-4 text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeItem(item.id)} 
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-2xl w-12 h-12"
                              >
                                <Trash2 className="w-6 h-6" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="pt-10 space-y-6">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Estimated Total</p>
                          <p className="text-4xl font-headline font-black text-primary">${calculateTotal()}</p>
                        </div>
                      </div>
                      <Button className="w-full h-16 bg-[#f9a03f] hover:bg-[#e89134] text-white rounded-3xl text-xl font-black shadow-xl shadow-orange-200 border-none active:scale-95 transition-all">
                        Complete Order <ArrowRight className="w-6 h-6 ml-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-24 bg-white/50 border-4 border-dashed border-primary/10 rounded-[3rem] animate-in zoom-in-95 duration-700">
                <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground/30" />
                </div>
                <h3 className="text-3xl font-headline font-black text-slate-400 mb-6">Your basket is waiting</h3>
                <Link href="/menu">
                  <Button className="rounded-full px-10 h-14 bg-primary text-lg font-bold shadow-xl shadow-primary/20">
                    Explore Our Flavors
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="delivery" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center py-24 bg-white/50 border-4 border-dashed border-secondary/10 rounded-[3rem]">
              <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Truck className="w-12 h-12 text-muted-foreground/30" />
              </div>
              <h3 className="text-3xl font-headline font-black text-slate-400 mb-4">No active deliveries</h3>
              <p className="text-lg text-muted-foreground font-medium max-w-sm mx-auto">Once your feast is on its way, you can track your courier here in real-time.</p>
            </div>
          </TabsContent>

          <TabsContent value="history" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center py-24 bg-white/50 border-4 border-dashed border-slate-200 rounded-[3rem]">
              <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-8">
                <History className="w-12 h-12 text-muted-foreground/30" />
              </div>
              <h3 className="text-3xl font-headline font-black text-slate-400 mb-4">No past orders yet</h3>
              <p className="text-lg text-muted-foreground font-medium max-w-sm mx-auto">Your delicious history will be stored here for quick and easy re-ordering.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
