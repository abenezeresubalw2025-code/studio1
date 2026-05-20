
"use client"

import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function LocationHours() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Basic logic for checking if open (11 AM to 10 PM)
    const now = new Date();
    const hour = now.getHours();
    setIsOpen(hour >= 11 && hour < 22);
  }, []);

  return (
    <section id="location" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <div className="bg-primary text-white p-12 rounded-3xl flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <MapPin className="w-64 h-64" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl font-headline font-bold mb-8">Find Us in the City</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 shrink-0 text-white/60" />
                  <div>
                    <h4 className="font-bold mb-1">Our Address</h4>
                    <p className="text-white/80">123 Culinary Boulevard, Food District<br />Gourmet Square, NY 10001</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 shrink-0 text-white/60" />
                  <div>
                    <h4 className="font-bold mb-1">Phone</h4>
                    <p className="text-white/80">+1 (555) T-SHAWARMA</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 shrink-0 text-white/60" />
                  <div>
                    <h4 className="font-bold mb-1">Email</h4>
                    <p className="text-white/80">hello@t-shawarma.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12 flex gap-4">
              <a href="#" className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><Instagram /></a>
              <a href="#" className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><Facebook /></a>
              <a href="#" className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><Twitter /></a>
            </div>
          </div>

          <div className="bg-white p-12 rounded-3xl border border-primary/5 flex flex-col shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-headline font-bold">Hours of Operation</h2>
              <Badge className={`${isOpen ? 'bg-green-500' : 'bg-red-500'} text-white px-4 py-1 animate-pulse`}>
                {isOpen ? 'Currently Open' : 'Closed Now'}
              </Badge>
            </div>

            <div className="space-y-4 flex-1">
              {[
                { day: 'Monday', hours: '11:00 AM - 10:00 PM' },
                { day: 'Tuesday', hours: '11:00 AM - 10:00 PM' },
                { day: 'Wednesday', hours: '11:00 AM - 10:00 PM' },
                { day: 'Thursday', hours: '11:00 AM - 11:00 PM' },
                { day: 'Friday', hours: '11:00 AM - Midnight' },
                { day: 'Saturday', hours: '12:00 PM - Midnight' },
                { day: 'Sunday', hours: '12:00 PM - 09:00 PM' },
              ].map((item, i) => (
                <div key={item.day} className={`flex justify-between py-2 ${i !== 6 ? 'border-b border-muted' : ''}`}>
                  <span className="font-medium">{item.day}</span>
                  <span className="text-muted-foreground">{item.hours}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-secondary/5 rounded-2xl border border-secondary/10">
              <p className="text-sm text-secondary font-medium italic">"The smell of roasting meat fills the street every day at exactly 11:00 AM."</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
