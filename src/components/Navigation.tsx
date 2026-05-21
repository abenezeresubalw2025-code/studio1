
"use client"

import React, { useState, useEffect } from 'react';
import { Home, Utensils, ShoppingBag, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { MENU_CATEGORIES } from '@/lib/menu-data';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Menu', href: '/#menu', icon: Utensils },
    { name: 'Location', href: '/#location', icon: MapPin },
  ];

  const bottomLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Menu', type: 'sheet', icon: Utensils },
    { name: 'Orders', href: '/main', icon: ShoppingBag },
  ];

  return (
    <>
      {/* Top Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl md:text-3xl font-headline font-bold text-primary tracking-tighter">T-Shawarma</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <link.icon className="w-4 h-4 text-primary opacity-60" />
                {link.name}
              </Link>
            ))}
            <Link href="/login">
              <Button variant="ghost" size="icon" className="rounded-full text-primary hover:bg-primary/10">
                <User size={24} />
              </Button>
            </Link>
          </div>

          {/* Mobile Profile Link (Top Right) */}
          <div className="md:hidden">
            <Link href="/login">
              <Button variant="ghost" size="icon" className="rounded-full text-primary hover:bg-primary/10">
                <User size={28} />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-primary/10 py-3 px-6 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {bottomLinks.map((link) => {
            if (link.type === 'sheet') {
              return (
                <Sheet key={link.name} open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-all">
                      <div className="p-2 rounded-2xl bg-transparent">
                        <link.icon size={22} className={isMenuOpen ? 'text-primary' : 'text-muted-foreground'} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{link.name}</span>
                    </button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[85vh] rounded-t-[3rem] px-0 border-primary/20 bg-white/95 backdrop-blur-xl">
                    <SheetHeader className="px-8 mb-8">
                      <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />
                      <SheetTitle className="text-4xl font-headline font-black text-primary tracking-tighter">
                        The Full <span className="italic">Menu</span>
                      </SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="h-full px-8 pb-32">
                      <div className="space-y-16">
                        {MENU_CATEGORIES.map((cat) => (
                          <div key={cat.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-4 mb-8">
                              <h3 className="text-2xl font-headline font-bold text-foreground">
                                {cat.name}
                              </h3>
                              <div className="h-px flex-1 bg-primary/10" />
                            </div>
                            <div className="space-y-8">
                              {cat.items.map((item) => {
                                const itemImg = PlaceHolderImages.find(img => img.id === item.image);
                                return (
                                  <div key={item.id} className="flex gap-6 group">
                                    <div className="w-24 h-24 relative shrink-0 rounded-2xl overflow-hidden shadow-lg ring-1 ring-primary/5">
                                      <Image 
                                        src={itemImg?.imageUrl || ''} 
                                        alt={item.name} 
                                        fill 
                                        className="object-cover group-hover:scale-110 transition-transform duration-500" 
                                      />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                      <div className="flex justify-between items-baseline mb-2">
                                        <h4 className="font-bold text-lg text-foreground leading-tight tracking-tight">{item.name}</h4>
                                        <span className="text-primary font-bold text-sm ml-2">{item.price}</span>
                                      </div>
                                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium italic">
                                        {item.description}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              );
            }

            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href!} 
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-muted-foreground hover:text-primary'}`}
              >
                <div className={`p-2 rounded-2xl ${isActive ? 'bg-primary/10' : 'bg-transparent'}`}>
                  <link.icon size={22} className={isActive ? 'text-primary' : 'text-muted-foreground'} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
