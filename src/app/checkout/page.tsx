
'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { MapPin, User as UserIcon, Phone, Home, Loader2, CheckCircle2, ArrowLeft, Navigation as NavIcon, Banknote, CreditCard } from 'lucide-react';
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
  const [cartItems, setCartItems] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    kebele: '',
    specialAddress: '',
  });

  const siteRef = useMemoFirebase(() => 
    firestore ? doc(firestore, 'settings', 'site') : null, 
    [firestore]
  );
  const { data: settings } = useDoc(siteRef);

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
      const priceVal = parseFloat(item.price.replace(/[^0-9.]/g, ''));
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

    addDoc(collection(firestore, 'orders'), orderData)
      .then(() => {
        localStorage.removeItem('cart');
        localStorage.setItem('cartCount', '0');
        window.dispatchEvent(new Event('cart-updated'));
        setSuccess(true);
        toast({ title: "Order Placed!", description: "Reporting to dashboard." });
        setTimeout(() => router.push('/main'), 3000);
      })
      .catch(async (err: any) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'orders',
          operation: 'create',
          requestResourceData: orderData
        }));
      })
      .finally(() => setLoading(false));
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
          <CheckCircle2 className="w-24 h-24 text-emerald-500 mx-auto animate-bounce" />
          <h1 className="text-4xl font-black text-slate-900">Success!</h1>
          <p className="text-xl text-muted-foreground">Order reported to kitchen.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFCFB] pb-32">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-24 md:pt-32 max-w-6xl">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-primary font-bold mb-6 hover:underline group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <h1 className="text-3xl font-black text-slate-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Map Selection */}
              <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white h-80 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15655.45265008544!2d37.38048675!3d11.5946162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1644d21223e7456d%3A0xb9e4745408660e22!2sBahir%20Dar%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1715852345678!5m2!1sen!2sus"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" className="brightness-95"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="bg-primary/20 p-4 rounded-full animate-ping absolute -inset-2" />
                  <MapPin className="w-8 h-8 text-primary relative" />
                </div>
              </Card>

              {/* Delivery Info */}
              <Card className="border-none shadow-xl rounded-[2rem] bg-white">
                <CardHeader className="bg-primary/5"><CardTitle className="text-lg flex items-center gap-2 text-primary"><Home className="w-5 h-5" /> Delivery Info</CardTitle></CardHeader>
                <CardContent className="p-8 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                      <Input name="name" value={formData.name} onChange={handleInputChange} required className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone</Label>
                      <Input name="phone" value={formData.phone} onChange={handleInputChange} required className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kebele</Label>
                    <Input name="kebele" value={formData.kebele} onChange={handleInputChange} required className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Special Instructions</Label>
                    <Input name="specialAddress" value={formData.specialAddress} onChange={handleInputChange} required className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
                <CardHeader className="bg-secondary/5">
                  <CardTitle className="text-lg flex items-center gap-2 text-secondary">
                    <Banknote className="w-5 h-5" /> Payment Method
                  </CardTitle>
                  <CardDescription>Please transfer to one of the accounts below</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['telebirr', 'cbe', 'abyssinia'].map((bank) => {
                      const account = settings?.[`${bank}Account`];
                      const name = settings?.[`${bank}Name`];
                      if (!account) return null;
                      return (
                        <div key={bank} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">{bank}</span>
                          <span className="text-base font-black text-slate-800 mb-1">{account}</span>
                          <span className="text-[10px] font-bold text-slate-400">{name}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" disabled={loading} className="w-full h-16 bg-[#f9a03f] text-white rounded-2xl text-lg font-black shadow-2xl">
                {loading ? <Loader2 className="animate-spin" /> : "Confirm & Place Order"}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-none shadow-xl rounded-[2rem] bg-slate-900 text-white sticky top-32">
              <CardHeader><CardTitle className="text-xl font-black">Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-[30vh] overflow-y-auto space-y-3 border-b border-white/10 pb-4">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-xs font-bold">
                      <span>{item.quantity}x {item.name}</span>
                      <span>ETB {(parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-sm font-black text-white/50 uppercase">Total</span>
                  <span className="text-3xl font-black text-[#f9a03f]">ETB {calculateTotal()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
