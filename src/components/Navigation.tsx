'use client';

import React, { useState, useEffect } from 'react';
import { Home, ShoppingBag, User, LogOut, Utensils, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const siteRef = useMemoFirebase(() => 
    firestore ? doc(firestore, 'settings', 'site') : null, 
    [firestore]
  );
  
  const { data: settings } = useDoc(siteRef);

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

  const bottomLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Menu', href: '/menu', icon: Utensils },
    { name: 'Cart', href: '/cart', icon: ShoppingBag },
    { name: 'Orders', href: '/main', icon: ClipboardList },
  ];

  const logoUrl = settings?.logoId;

  return (
    <>
      {/* Top Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-3xl shadow-sm py-4 h-20" : "bg-transparent py-6 h-24"
      )}>
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            {logoUrl ? (
              <div className="h-12 w-auto relative">
                <Image 
                  src={logoUrl} 
                  alt="T-Shawarma Logo" 
                  width={150} 
                  height={50} 
                  className="object-contain h-full w-auto" 
                  priority
                />
              </div>
            ) : (
              <span className="text-xl font-headline font-bold text-primary tracking-tighter transition-all">
                {user ? (user.displayName || 'Flavor Seeker') : 'T-Shawarma'}
              </span>
            )}
          </Link>

          {/* User Profile Section (Right) */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/main" className="hidden md:block">
                   <Button variant="ghost" className="rounded-full text-primary hover:bg-primary/10 px-4 h-10 font-bold">
                     Dashboard
                   </Button>
                </Link>
                <Link href="/profile">
                  <Avatar className="h-12 w-12 border-2 border-primary shadow-lg transition-transform hover:scale-110 cursor-pointer">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full text-muted-foreground hover:text-destructive w-10 h-10 transition-colors">
                  <LogOut size={20} />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Avatar className="h-11 w-11 border-2 border-primary/20 hover:border-primary/50 transition-all cursor-pointer shadow-sm">
                  <AvatarFallback className="bg-muted text-primary">
                    <User size={22} />
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Modern Floating Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-8 left-6 right-6 z-50">
        <div className="bg-black/50 backdrop-blur-[40px] border border-white/10 px-8 rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] flex items-center justify-around max-w-xl mx-auto h-[90px]">
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
                <div className="relative flex items-center justify-center w-16 h-16 transition-all duration-500">
                  <link.icon 
                    size={isActive ? 28 : 24} 
                    className={cn(
                      "transition-colors duration-500", 
                      isActive ? "text-primary" : "text-white"
                    )} 
                  />
                  
                  {/* Cart Badge */}
                  {link.name === 'Cart' && cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-[2px] border-black/20 shadow-lg animate-in zoom-in duration-500">
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
