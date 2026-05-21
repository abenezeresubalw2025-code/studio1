
"use client"

import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export function LocationHours() {
  return (
    <section id="location" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary text-white p-12 md:p-20 rounded-[3rem] flex flex-col justify-between overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <MapPin className="w-64 h-64" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-5xl font-headline font-bold mb-12">Find Us in the City</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-12">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2">Our Address</h4>
                      <p className="text-white/80 text-lg leading-relaxed">
                        123 Culinary Boulevard<br />
                        Food District, Gourmet Square<br />
                        New York, NY 10001
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2">Phone</h4>
                      <p className="text-white/80 text-lg">+1 (555) T-SHAWARMA</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-12">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2">Email</h4>
                      <p className="text-white/80 text-lg">hello@t-shawarma.com</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-xl mb-6">Connect With Us</h4>
                    <div className="flex gap-4">
                      <a href="#" className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all hover:scale-110"><Instagram className="w-6 h-6" /></a>
                      <a href="#" className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all hover:scale-110"><Facebook className="w-6 h-6" /></a>
                      <a href="#" className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all hover:scale-110"><Twitter className="w-6 h-6" /></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-20 pt-12 border-t border-white/10 relative z-10 text-center">
              <p className="text-white/60 italic text-lg">"The heart of Bahirdar flavor, right in the center of the city."</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
