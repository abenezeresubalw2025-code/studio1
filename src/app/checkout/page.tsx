
'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { MapPin, User as UserIcon, Phone, Home, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function CheckoutPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    kebele: '',
    specialAddress: '',
  });

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
    
    if (user) {
      setFormData(prev => ({ ...prev, name: user.displayName || '' }));
    }
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        setCartItems([]);
      }
    }
  }, [user, userLoading, router]);

  const calculateTotal = () => {
    const itemsTotal = cartItems.reduce((total, item: any) => {
      const priceVal = parseFloat(item.price.replace('$', ''));
      return total + (isNaN(priceVal) ? 0 : priceVal * item.quantity);
    }, 0);
    const tax = 2.00;
    const delivery = 10.00;
    return (itemsTotal + tax + delivery).toFixed(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user || cartItems.length === 0) return;

    setLoading(true);
    const orderData = {
      userId: user.uid,
      customerName: formData.name,
      phoneNumber: formData.phone,
      kebele: formData.kebele,
      specialAddress: formData.specialAddress,
      items: cartItems,
      totalAmount: parseFloat(calculateTotal()),
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(firestore, 'orders'), orderData);
      
      // Clear cart
      localStorage.removeItem('cart');
      localStorage.setItem('cartCount', '0');
      window.dispatchEvent(new Event('cart-updated'));
      
      setSuccess(true);
      toast({
        title: "Order Placed!",
        description: "Your delicious meal is on its way.",
      });
      
      setTimeout(() => {
        router.push('/main');
      }, 3000);
      
    } catch (err: any) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: 'orders',
        operation: 'create',
        requestResourceData: orderData
      }));
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: err.message || "Could not place order. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-headline font-black text-slate-900">Order Successful!</h1>
          <p className="text-xl text-muted-foreground">Thank you for choosing T-Shawarma. We're preparing your order with passion.</p>
          <div className="pt-8">
            <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mb-2" />
            <p className="text-sm font-bold text-primary uppercase tracking-widest">Redirecting to Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFCFB] pb-32">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-24 md:pt-32 max-w-2xl">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary font-bold mb-6 hover:underline group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Cart
        </button>

        <h1 className="text-3xl font-headline font-black text-slate-900 mb-8 tracking-tight">Delivery Details</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
                <CardHeader className="bg-primary/5 pb-4">
                  <CardTitle className="text-lg flex items-center gap-2 text-primary">
                    <MapPin className="w-5 h-5" /> Delivery Address
                  </CardTitle>
                  <CardDescription>Where should we bring your feast?</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                      <Input 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Ibrahim Ahmed"
                        className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:border-primary/20 bg-slate-50/50 font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                      <Input 
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+251 ..."
                        className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:border-primary/20 bg-slate-50/50 font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kebele</Label>
                    <div className="relative">
                      <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                      <Input 
                        name="kebele"
                        value={formData.kebele}
                        onChange={handleInputChange}
                        placeholder="e.g. Kebele 04"
                        className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:border-primary/20 bg-slate-50/50 font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Special Address / Landmarks</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-4 h-4 text-primary/50" />
                      <Input 
                        name="specialAddress"
                        value={formData.specialAddress}
                        onChange={handleInputChange}
                        placeholder="Near the main square..."
                        className="h-16 pl-12 pt-1 rounded-xl border-2 border-slate-50 focus:border-primary/20 bg-slate-50/50 font-bold"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full h-16 bg-[#f9a03f] hover:bg-[#e89134] text-white rounded-2xl text-lg font-black shadow-2xl transition-all active:scale-[0.98]"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Place Order Now"}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl rounded-[2rem] bg-slate-900 text-white overflow-hidden sticky top-32">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-headline font-black">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 border-b border-white/10 pb-4">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-white/60 font-bold">{item.quantity}x {item.name}</span>
                      <span className="font-black">${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/50 font-bold">
                    <span>Tax</span>
                    <span>$2.00</span>
                  </div>
                  <div className="flex justify-between text-white/50 font-bold">
                    <span>Delivery</span>
                    <span>$10.00</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-end">
                  <span className="text-xl font-black text-white uppercase tracking-tighter">Total</span>
                  <span className="text-3xl font-black text-[#f9a03f] tracking-tighter">${calculateTotal()}</span>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 mt-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Estimated Delivery</p>
                  <p className="text-sm font-bold">25 - 35 Minutes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
