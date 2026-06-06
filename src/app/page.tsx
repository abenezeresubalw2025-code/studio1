
'use client';

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { MenuSection } from '@/components/MenuSection';
import { LocationHours } from '@/components/LocationHours';
import { AboutUs } from '@/components/AboutUs';
import { AIRecommendations } from '@/components/AIRecommendations';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Megaphone, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const firestore = useFirestore();
  
  const siteRef = useMemoFirebase(() => 
    firestore ? doc(firestore, 'settings', 'site') : null, 
    [firestore]
  );
  
  const { data: settings } = useDoc(siteRef);

  const config = settings || {
    menuEnabled: true,
    locationEnabled: true,
    announcementEnabled: false,
    customAnnouncement: "",
    logoId: ""
  };

  const logoUrl = config.logoId;

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Cinematic Hero Section - The First Impression */}
      <Hero />

      {config.announcementEnabled && config.customAnnouncement && (
        <div className="container mx-auto px-6 pt-12 mb-8 relative z-50">
          <Alert className="bg-primary text-white border-none shadow-xl py-6 rounded-2xl animate-in slide-in-from-top duration-500">
            <Megaphone className="h-6 w-6 text-white" />
            <AlertTitle className="font-headline font-black text-xl mb-1 tracking-tight">SPECIAL ANNOUNCEMENT</AlertTitle>
            <AlertDescription className="text-lg opacity-90">{config.customAnnouncement}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* About Section - Brand Story */}
      <AboutUs />

      {/* AI Navigator - Unique Feature */}
      <AIRecommendations />

      {config.menuEnabled && (
        <div className="py-20 bg-background">
          <div className="container mx-auto px-6 mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4">Our Menu</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Explore our hand-crafted selection of authentic local flavors and modern favorites.</p>
          </div>
          <MenuSection limit={6} />
          <div className="container mx-auto px-6 mt-12 flex justify-center">
            <Link href="/menu">
              <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold px-12 h-16 shadow-2xl shadow-primary/20 group text-lg transition-all active:scale-95">
                View Full Menu <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {config.locationEnabled && <LocationHours />}
      
      <footer className="py-20 bg-background border-t border-primary/10">
        <div className="container mx-auto px-6 text-center">
          <Link href="/" className="inline-block mb-6">
            {logoUrl ? (
              <Image src={logoUrl} alt="Lake Cafe" width={180} height={60} className="mx-auto object-contain" />
            ) : (
              <h2 className="text-4xl font-headline font-bold text-primary tracking-tighter">Lake Cafe</h2>
            )}
          </Link>
          
          <p className="text-muted-foreground text-base max-w-md mx-auto mb-10 leading-relaxed">
            Crafting the city's most authentic culinary experiences since 2024. 
            Passionate about flavor, dedicated to heritage.
          </p>
          
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-10 text-sm font-black uppercase tracking-[0.2em] text-primary/60">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Use</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          
          <div className="pt-10 border-t border-primary/5">
            <p className="text-xs text-muted-foreground/50 font-medium">
              © 2024 Lake Cafe Restaurant Group. Hand-crafted with passion.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
