'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Truck, History, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const savedCount = localStorage.getItem('cartCount');
    if (savedCount) setCartCount(parseInt(savedCount));

    const handleCartUpdate = () => {
      const updatedCount = localStorage.getItem('cartCount');
      if (updatedCount) setCartCount(parseInt(updatedCount));
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
    localStorage.removeItem('cartCount');
    setCartCount(0);
    window.dispatchEvent(new Event('cart-updated'));
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
            {cartCount > 0 ? (
              <div className="space-y-6">
                <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                  <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl font-headline font-black text-slate-800">Shopping Cart</CardTitle>
                    <Badge className="bg-primary/10 text-primary border-none font-bold px-4 py-1">{cartCount} Items</Badge>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-6 bg-muted/30 rounded-3xl group hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-primary/20">
                            {cartCount}x
                          </div>
                          <div>
                            <p className="font-black text-xl text-slate-800">Assorted Shawarma</p>
                            <p className="text-sm text-muted-foreground font-medium">Customized menu selections</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={handleClearCart} 
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-2xl w-12 h-12"
                        >
                          <Trash2 className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-10 space-y-6">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Total Estimate</p>
                          <p className="text-4xl font-headline font-black text-primary">Calculated at Payment</p>
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