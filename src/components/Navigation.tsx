'use client';

import React, { useState, useEffect } from 'react';
import { Home, Utensils, ShoppingBag, User, MapPin, LogOut } from 'lucide-react';
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
    { name: 'Menu', href: '/menu', icon: Utensils },
    { name: 'Dashboard', href: '/main', icon: ShoppingBag },
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
                className={`text-sm font-medium hover:text-primary transition-colors flex items-center gap-2 ${pathname === link.href ? 'text-primary' : ''}`}
              >
                <link.icon className="w-4 h-4 text-primary opacity-60" />
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/main">
                   <Button variant="ghost" className="rounded-full text-primary hover:bg-primary/10 px-4">
                     {user.displayName?.split(' ')[0] || 'Member'}
                   </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full text-muted-foreground hover:text-destructive">
                  <LogOut size={20} />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon" className="rounded-full text-primary hover:bg-primary/10">
                  <User size={24} />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Profile Link (Top Right) */}
          <div className="md:hidden flex items-center gap-2">
            {user ? (
              <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full text-muted-foreground">
                <LogOut size={24} />
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon" className="rounded-full text-primary hover:bg-primary/10">
                  <User size={28} />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-primary/10 py-3 px-6 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {bottomLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
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
