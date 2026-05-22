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
  TrendingUp,
  MapPin,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

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

  return (
    <main className="min-h-screen bg-background pb-24">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-32">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="fade-in-stagger">
            <h1 className="text-4xl md:text-6xl font-headline font-black text-primary mb-2 tracking-tighter">Flavor Hub</h1>
            <p className="text-lg text-muted-foreground font-medium">
              Welcome back, <span className="text-primary font-bold">{user.displayName || 'Flavor Seeker'}</span>!
            </p>
          </div>
          <div className="flex items-center gap-6 bg-white p-5 rounded-3xl shadow-xl border border-primary/5 hover:border-primary/20 transition-all group">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1">Flavor Points</p>
              <p className="text-3xl font-headline font-bold text-primary">2,450</p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Featured Promotion */}
            <Card className="border-none shadow-2xl bg-gradient-to-br from-primary via-primary to-secondary text-white overflow-hidden relative group rounded-[2rem]">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000 blur-3xl" />
              <CardContent className="p-10 relative z-10">
                <div className="max-w-lg">
                  <Badge className="bg-white/20 text-white border-none mb-6 px-4 py-1 uppercase tracking-widest text-[10px] font-bold">Limited Time Offer</Badge>
                  <h2 className="text-4xl md:text-5xl font-headline font-black mb-6 leading-tight tracking-tight">Double Points on <br/><span className="italic text-white/90">Chicken Roast</span></h2>
                  <p className="text-lg text-white/80 mb-10 leading-relaxed font-medium">Enjoy our authentic Bahirdar style special tonight and accelerate your journey to the next tier.</p>
                  <div className="flex flex-wrap gap-4">
                    <Button className="bg-white text-primary hover:bg-white/90 rounded-full px-10 h-14 text-lg font-bold shadow-lg">Order Delivery</Button>
                    <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full px-6 h-14 font-bold border border-white/30">Learn More</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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