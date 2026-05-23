'use client';

import React, { useState, useEffect } from 'react';
import { Home, ShoppingBag, User, MapPin, LogOut, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Initialize cart count
    const savedCount = localStorage.getItem('cartCount');
    if (savedCount) setCartCount(parseInt(savedCount));

    // Listen for cart updates
    const handleCartUpdate = () => {
      const updatedCount = localStorage.getItem('cartCount');
      if (updatedCount) setCartCount(parseInt(updatedCount));
    };
    window.addEventListener('cart-updated', handleCartUpdate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      toast({
        title: "Signed Out",
        description: "You have been successfully logged out.",
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign Out Error",
        description: error.message,
      });
    }
  };

  const navLinks = [
    { name: 'Menu', href: '/menu', icon: Utensils },
    { name: 'Location', href: '/#location', icon: MapPin },
  ];

  const bottomLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Menu', href: '/menu', icon: Utensils },
    { name: 'Cart', href: '/cart', icon: ShoppingBag },
    { name: 'Profile', href: '/main', icon: User },
  ];

  return (
    <>
      {/* Top Navigation (Desktop) */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-3xl shadow-sm py-4" : "bg-transparent py-6"
      )}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-lg font-headline font-bold text-primary tracking-tighter transition-all">T-Shawarma</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className={cn(
                  "text-sm font-medium hover:text-primary transition-colors flex items-center gap-2 group",
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                <link.icon className={cn("w-4 h-4", pathname === link.href ? "text-primary opacity-100" : "text-primary opacity-60")} />
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/main">
                   <Button variant="ghost" className="rounded-full text-primary hover:bg-primary/10 px-4 h-10 font-bold">
                     {user.displayName?.split(' ')[0] || 'Member'}
                   </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full text-muted-foreground hover:text-destructive w-10 h-10 transition-colors">
                  <LogOut size={20} />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon" className="rounded-full text-primary hover:bg-primary/10 w-10 h-10">
                  <User size={22} />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Profile Link (Top Right) */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full text-muted-foreground w-10 h-10 active:scale-90 transition-transform">
                <LogOut size={22} />
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Modern Floating Bottom Navigation (Mobile Only) - Adjusted for premium feel */}
      <nav className="md:hidden fixed bottom-8 left-6 right-6 z-50">
        <div className="bg-black/40 backdrop-blur-[40px] border border-white/10 px-6 rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] flex items-center justify-around max-w-xl mx-auto h-[95px]">
          {bottomLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={cn(
                  "flex items-center justify-center flex-1 transition-all duration-300",
                  isActive ? "text-primary" : "text-white/60 hover:text-white"
                )}
              >
                <div className={cn(
                  "relative flex items-center justify-center w-16 h-16 transition-all duration-500",
                  isActive ? "bg-white rounded-full shadow-2xl scale-110" : "bg-transparent"
                )}>
                  <link.icon size={28} className={cn("transition-colors duration-500", isActive ? "text-black" : "text-white")} />
                  
                  {/* Cart Badge - Refined Red Circle */}
                  {link.name === 'Cart' && cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[11px] font-black w-7 h-7 flex items-center justify-center rounded-full border-[3px] border-black/20 shadow-lg animate-in zoom-in duration-500">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
