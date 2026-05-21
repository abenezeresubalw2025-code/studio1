"use client"

import React, { useState, useEffect } from 'react';
import { Menu, X, Utensils, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Menu', href: '#menu', icon: Utensils },
    { name: 'Location', href: '#location', icon: MapPin },
    { name: 'Member Area', href: '#member', icon: User },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center space-x-2">
          <span className="text-3xl font-headline font-bold text-primary tracking-tighter">T-Shawarma</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
            >
              <link.icon className="w-4 h-4 text-primary opacity-60" />
              {link.name}
            </a>
          ))}
          <Button variant="default" className="bg-primary hover:bg-primary/90 rounded-full px-6">
            Order Now
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t absolute top-full left-0 right-0 p-6 shadow-xl fade-in-stagger flex flex-col space-y-4">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-headline flex items-center gap-4 py-2"
            >
              <link.icon className="w-6 h-6 text-primary" />
              {link.name}
            </a>
          ))}
          <Button className="w-full bg-primary py-6 text-lg">Order Now</Button>
        </div>
      )}
    </nav>
  );
}
