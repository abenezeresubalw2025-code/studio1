"use client"

import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export function LocationHours() {
  return (
    <section id="location" className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-primary text-white p-8 md:p-12 rounded-[2rem] overflow-hidden relative shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <MapPin className="w-32 h-32" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-headline font-bold mb-8">Find Us</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Address */}
                <div className="flex flex-col gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Address</h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                      123 Lakeside Boulevard<br />
                      Bahir Dar, Ethiopia
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Phone</h4>
                    <p className="text-white/80 text-sm">+251 (555) LAKE-CAFE</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Email</h4>
                    <p className="text-white/80 text-sm">hello@lakecafe.com</p>
                  </div>
                </div>

                {/* Socials */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Follow Us</h4>
                  <div className="flex gap-2">
                    <a href="#" className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all hover:scale-105"><Instagram className="w-4 h-4" /></a>
                    <a href="#" className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all hover:scale-105"><Facebook className="w-4 h-4" /></a>
                    <a href="#" className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all hover:scale-105"><Twitter className="w-4 h-4" /></a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 relative z-10 text-center">
              <p className="text-white/60 italic text-sm">"The heart of Bahir Dar flavor, right by the lake."</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
