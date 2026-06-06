'use client';

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { MenuSection } from '@/components/MenuSection';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';

export default function MenuPage() {
  const firestore = useFirestore();
  const siteRef = useMemoFirebase(() => 
    firestore ? doc(firestore, 'settings', 'site') : null, 
    [firestore]
  );
  const { data: settings } = useDoc(siteRef);
  const logoUrl = settings?.logoId;

  return (
    <main className="min-h-screen pt-20">
      <Navigation />
      <div className="pt-10">
        <MenuSection />
      </div>
      
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
