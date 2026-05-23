'use client';

import React, { useState, useEffect } from 'react';
import { Home, Heart, ShoppingBag, User, MapPin, LogOut, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
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
    return () => window.removeEventListener('scroll', handleScroll);
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
    { name: 'Favorite', href: '#', icon: Heart },
    { name: 'Cart', href: '#', icon: ShoppingBag },
    { name: 'Profile', href: '/main', icon: User },
  ];

  return (
    <>
      {/* Top Navigation (Desktop) */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-3'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-headline font-bold text-primary tracking-tighter">T-Shawarma</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`text-sm font-medium hover:text-primary transition-colors flex items-center gap-2 ${pathname === link.href ? 'text-primary' : ''}`}
              >
                <link.icon className="w-4 h-4 text-primary opacity-60" />
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/main">
                   <Button variant="ghost" className="rounded-full text-primary hover:bg-primary/10 px-4 h-8">
                     {user.displayName?.split(' ')[0] || 'Member'}
                   </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full text-muted-foreground hover:text-destructive w-8 h-8">
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon" className="rounded-full text-primary hover:bg-primary/10 w-8 h-8">
                  <User size={20} />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Profile Link (Top Right - Optional redundant, but good for quick logout) */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full text-muted-foreground w-8 h-8">
                <LogOut size={20} />
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom Navigation (Mobile Only - Matching Image Structure) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/20 backdrop-blur-xl border-t border-white/10 pt-2 pb-6 px-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="flex items-end justify-around max-w-md mx-auto relative">
          {bottomLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`flex flex-col items-center justify-center gap-1.5 transition-all duration-300 flex-1 ${isActive ? 'text-primary' : 'text-white/60 hover:text-white'}`}
              >
                <div className={`relative flex items-center justify-center w-12 h-12 transition-all duration-500 ${isActive ? 'bg-white rounded-full shadow-lg scale-110 -translate-y-1' : 'bg-transparent'}`}>
                  <link.icon size={24} className={isActive ? 'text-black' : 'inherit'} />
                </div>
                <span className={`text-[10px] font-bold tracking-tight transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
