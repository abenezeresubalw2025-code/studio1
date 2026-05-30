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
import { MapPin, User as UserIcon, Phone, Home, Loader2, CheckCircle2, ArrowLeft, Navigation as NavIcon } from 'lucide-react';
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

    // This operation "reports" the order to the admin page by adding it to the Firestore collection
    // The Admin page is set up with a real-time listener (onSnapshot) to this same collection.
    addDoc(collection(firestore, 'orders'), orderData)
      .then(() => {
        localStorage.removeItem('cart');
        localStorage.setItem('cartCount', '0');
        window.dispatchEvent(new Event('cart-updated'));
        
        setSuccess(true);
        toast({
          title: "Order Placed Successfully!",
          description: "Your order has been reported to the kitchen.",
        });
        
        setTimeout(() => {
          router.push('/main');
        }, 3000);
      })
      .catch(async (err: any) => {
        const permissionError = new FirestorePermissionError({
          path: 'orders',
          operation: 'create',
          requestResourceData: orderData
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: "destructive",
          title: "Order Failed",
          description: "Could not report order to admin. Please try again.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
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
          <p className="text-xl text-muted-foreground">Thank you for choosing T-Shawarma. Your order has been sent to our dashboard.</p>
          <div className="pt-8">
            <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mb-2" />
            <p className="text-sm font-bold text-primary uppercase tracking-widest">Returning to Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFCFB] pb-32">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-24 md:pt-32 max-w-4xl">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary font-bold mb-6 hover:underline group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Cart
        </button>

        <h1 className="text-3xl font-headline font-black text-slate-900 mb-8 tracking-tight">Delivery Details</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Google Maps Integration */}
              <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white h-80 relative group">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15655.45265008544!2d37.38048675!3d11.5946162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1644d21223e7456d%3A0xb9e4745408660e22!2sBahir%20Dar%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1715852345678!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale-[0.2] brightness-95 group-hover:brightness-100 transition-all"
                />
                
                <div className="absolute top-6 left-6 z-10">
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 border border-white/50">
                    <NavIcon className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">Bahir Dar, Ethiopia</span>
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="bg-primary/10 p-3 rounded-full animate-ping absolute -inset-2" />
                  <div className="bg-white p-2 rounded-full shadow-2xl relative">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
                <CardHeader className="bg-primary/5 pb-4">
                  <CardTitle className="text-lg flex items-center gap-2 text-primary">
                    <Home className="w-5 h-5" /> Delivery Information
                  </CardTitle>
                  <CardDescription>All fields are required to report your order accurately</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        placeholder="Near the main square, building with blue windows..."
                        className="h-16 pl-12 pt-1 rounded-xl border-2 border-slate-50 focus:border-primary/20 bg-slate-50/50 font-bold"
                        required
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
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirm & Place Order"}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-none shadow-xl rounded-[2rem] bg-slate-900 text-white overflow-hidden sticky top-32">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-headline font-black">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-[30vh] overflow-y-auto space-y-3 border-b border-white/10 pb-4 no-scrollbar">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-xs">
                      <div className="flex flex-col">
                        <span className="text-white font-bold">{item.name}</span>
                        <span className="text-white/40 text-[10px]">Qty: {item.quantity}</span>
                      </div>
                      <span className="font-black text-white/80">${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/50 font-bold">
                    <span>Subtotal</span>
                    <span>${(parseFloat(calculateTotal()) - 12).toFixed(2)}</span>
                  </div>
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
                  <span className="text-xl font-black text-white uppercase tracking-tighter">Grand Total</span>
                  <span className="text-3xl font-black text-[#f9a03f] tracking-tighter">${calculateTotal()}</span>
                </div>
                
                <div className="bg-white/5 rounded-2xl p-4 mt-6 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Loader2 className="w-5 h-5 text-white/40 animate-spin" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Status</p>
                    <p className="text-xs font-bold">Waiting to be reported...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
