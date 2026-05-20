
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { SignatureGallery } from '@/components/SignatureGallery';
import { MenuSection } from '@/components/MenuSection';
import { AIRecommendations } from '@/components/AIRecommendations';
import { TableBooking } from '@/components/TableBooking';
import { LocationHours } from '@/components/LocationHours';
import { MemberPortal } from '@/components/MemberPortal';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <SignatureGallery />
      <MenuSection />
      <AIRecommendations />
      <TableBooking />
      <MemberPortal />
      <LocationHours />
      
      {/* Simple Footer */}
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
