'use client';

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Navigation } from '@/components/Navigation';
import { MenuSection } from '@/components/MenuSection';
import { LocationHours } from '@/components/LocationHours';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';
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
    <main className="min-h-screen pt-20">
      <Navigation />
      
      {config.announcementEnabled && config.customAnnouncement && (
        <div className="container mx-auto px-6 pt-8 mb-8 relative z-50">
          <Alert className="bg-primary text-white border-none shadow-xl py-6 rounded-2xl animate-in slide-in-from-top duration-500">
            <Megaphone className="h-6 w-6 text-white" />
            <AlertTitle className="font-headline font-black text-xl mb-1 tracking-tight">SPECIAL ANNOUNCEMENT</AlertTitle>
            <AlertDescription className="text-lg opacity-90">{config.customAnnouncement}</AlertDescription>
          </Alert>
        </div>
      )}

      {config.menuEnabled && (
        <div className="pt-10">
          <MenuSection />
        </div>
      )}

      {config.locationEnabled && <LocationHours />}
      
      <footer className="py-20 bg-background border-t border-primary/10">
        <div className="container mx-auto px-6 text-center">
          <Link href="/" className="inline-block mb-6">
            {logoUrl ? (
              <Image src={logoUrl} alt="T-Shawarma" width={180} height={60} className="mx-auto object-contain" />
            ) : (
              <h2 className="text-4xl font-headline font-bold text-primary tracking-tighter">T-Shawarma</h2>
            )}
          </Link>
          
          <p className="text-muted-foreground text-base max-w-md mx-auto mb-10 leading-relaxed">
            Crafting the city's most authentic shawarma experiences since 2024. 
            Passionate about flavor, dedicated to heritage.
          </p>
          
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-10 text-sm font-black uppercase tracking-[0.2em] text-primary/60">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Use</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          
          <div className="pt-10 border-t border-primary/5">
            <p className="text-xs text-muted-foreground/50 font-medium">
              © 2024 T-Shawarma Restaurant Group. Hand-carved with passion.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
