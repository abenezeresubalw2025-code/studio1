
'use client';

import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Navigation } from '@/components/Navigation';
import { MenuSection } from '@/components/MenuSection';
import { LocationHours } from '@/components/LocationHours';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';

export default function Home() {
  const firestore = useFirestore();
  const { data: settings } = useDoc(firestore ? doc(firestore, 'settings', 'site') : null);

  // Default fallback if no settings exist yet or while loading
  const config = settings || {
    menuEnabled: true,
    locationEnabled: true,
    announcementEnabled: false,
    customAnnouncement: ""
  };

  return (
    <main className="min-h-screen pt-20">
      <Navigation />
      
      {config.announcementEnabled && config.customAnnouncement && (
        <div className="container mx-auto px-6 pt-4 mb-8 relative z-50">
          <Alert className="bg-primary text-white border-none shadow-xl py-6 rounded-2xl animate-in slide-in-from-top duration-500">
            <Megaphone className="h-6 w-6 text-white" />
            <AlertTitle className="font-headline font-black text-xl mb-1 tracking-tight">SPECIAL ANNOUNCEMENT</AlertTitle>
            <AlertDescription className="text-lg opacity-90">{config.customAnnouncement}</AlertDescription>
          </Alert>
        </div>
      )}

      {config.menuEnabled && <MenuSection cols={1} />}
      {config.locationEnabled && <LocationHours />}
      
      <footer className="py-12 bg-background border-t border-primary/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-headline font-bold text-primary mb-4 tracking-tighter">T-Shawarma</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
            Crafting the city's most authentic shawarma experiences since 2024. 
            Passionate about flavor, dedicated to heritage.
          </p>
          <div className="flex justify-center gap-8 mb-8 text-sm font-bold uppercase tracking-widest text-primary/60">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <p className="text-xs text-muted-foreground opacity-50">
            © 2024 T-Shawarma Restaurant Group. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
