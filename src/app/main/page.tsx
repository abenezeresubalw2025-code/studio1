'use client';

import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { 
  Utensils, 
  Award, 
  Star,
  MapPin,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function MainDashboard() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const promoImg = PlaceHolderImages.find(img => img.id === 'roast-chicken-special');

  return (
    <main className="min-h-screen bg-background pb-24">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-32">
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* New Promo Banner (Matching Picture Style) */}
            <div className="relative h-[280px] md:h-[350px] w-full bg-[#f1f9f2] rounded-[2.5rem] overflow-visible shadow-xl border border-white/50">
              {/* Background Large Text */}
              <div className="absolute inset-0 flex items-center justify-between px-12 md:px-20 pointer-events-none overflow-hidden rounded-[2.5rem]">
                <span className="text-[120px] md:text-[200px] font-black text-black/[0.04] select-none translate-y-8">70%</span>
                <span className="text-[120px] md:text-[200px] font-black text-black/[0.04] select-none translate-y-8">25%</span>
              </div>

              {/* Foreground Content */}
              <div className="relative h-full w-full flex items-center justify-between px-8 md:px-16 z-20">
                {/* Left Side Info */}
                <div className="flex flex-col gap-2 max-w-[120px] md:max-w-none">
                  <h3 className="text-2xl md:text-4xl font-black text-slate-800 leading-tight">Free Delivery</h3>
                  <Link href="/menu">
                    <Button className="mt-4 bg-[#f9a03f] hover:bg-[#e89134] text-white rounded-full px-6 py-6 h-auto text-sm md:text-lg font-black shadow-lg shadow-orange-200 border-none active:scale-95 transition-all">
                      Order Now
                    </Button>
                  </Link>
                </div>

                {/* Right Side Info */}
                <div className="flex flex-col items-end gap-2 text-right max-w-[120px] md:max-w-none">
                  <span className="text-sm md:text-xl font-bold text-slate-400">T-Shawarma</span>
                  <Link href="/menu">
                    <Button className="mt-4 bg-[#f9a03f] hover:bg-[#e89134] text-white rounded-full px-6 py-6 h-auto text-sm md:text-lg font-black shadow-lg shadow-orange-200 border-none active:scale-95 transition-all">
                      Order Now
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Center Overflowing Image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] md:w-[380px] h-[220px] md:h-[380px] z-10 transition-transform hover:scale-105 duration-500">
                <Image 
                  src={promoImg?.imageUrl || ''} 
                  alt="Special Dish" 
                  fill 
                  className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.15)]"
                  priority
                />
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-xl bg-white rounded-[2rem] p-8 group hover:bg-primary transition-all duration-500">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-white/20 group-hover:text-white">
                    <Star className="w-8 h-8" />
                  </div>
                  <Badge className="bg-primary/10 text-primary group-hover:bg-white/20 group-hover:text-white border-none font-bold">New Perk</Badge>
                </div>
                <h3 className="text-2xl font-headline font-black mb-2 group-hover:text-white transition-colors">Elite Status</h3>
                <p className="text-muted-foreground group-hover:text-white/80 transition-colors">You're just 3 orders away from unlocking priority carving!</p>
              </Card>

              <Card className="border-none shadow-xl bg-white rounded-[2rem] p-8 group hover:bg-secondary transition-all duration-500">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-secondary/5 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-white/20 group-hover:text-white">
                    <Utensils className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-2xl font-headline font-black mb-2 group-hover:text-white transition-colors">Daily Special</h3>
                <p className="text-muted-foreground group-hover:text-white/80 transition-colors">Try our new saffron-infused garlic whip, available today only.</p>
              </Card>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Rewards Card */}
            <Card className="border-none shadow-2xl rounded-[2rem] bg-secondary/5 border-2 border-secondary/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 -rotate-12 translate-x-4 -translate-y-4">
                <Award className="w-48 h-48" />
              </div>
              <CardHeader className="p-8">
                <CardTitle className="flex items-center gap-3 text-2xl font-headline font-black text-secondary">
                  <Award className="w-7 h-7" /> Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-8">
                <div className="p-6 bg-white rounded-2xl border border-secondary/10 shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-black uppercase tracking-widest">Free Baklava</span>
                    <span className="text-xs font-black text-secondary bg-secondary/10 px-3 py-1 rounded-full">80% Done</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[80%] rounded-full shadow-[0_0_15px_rgba(191,25,114,0.4)]" />
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-white/60 rounded-2xl border-2 border-dashed border-secondary/20">
                  <Star className="w-6 h-6 text-secondary fill-secondary" />
                  <p className="text-xs text-muted-foreground font-bold">
                    Next Tier: <span className="text-primary uppercase tracking-widest ml-1">Diamond Elite</span>
                  </p>
                </div>
                <Button className="w-full h-16 bg-secondary hover:bg-secondary/90 text-white rounded-2xl text-lg font-bold shadow-xl shadow-secondary/20">
                  Redeem Rewards
                </Button>
              </CardContent>
            </Card>

            {/* Quick Access Menu */}
            <div className="grid grid-cols-1 gap-4">
              <Link href="/menu">
                <Button variant="outline" className="w-full h-32 flex flex-col gap-3 rounded-3xl border-primary/10 hover:border-primary/40 bg-white hover:shadow-xl transition-all group">
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Full Menu</span>
                </Button>
              </Link>
              <Link href="/#location">
                <Button variant="outline" className="w-full h-32 flex flex-col gap-3 rounded-3xl border-primary/10 hover:border-primary/40 bg-white hover:shadow-xl transition-all group">
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Location</span>
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}