'use client';

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ChefHat, Heart, Award } from 'lucide-react';

export function AboutUs() {
  const aboutImg = PlaceHolderImages.find(img => img.id === 'gallery-1');

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image Side */}
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-700">
              <Image 
                src={aboutImg?.imageUrl || ''} 
                alt="Chef preparing signature dishes" 
                width={600} 
                height={800} 
                className="object-cover w-full h-[450px]"
                data-ai-hint="chef cooking"
              />
            </div>
            {/* Decorative background element */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -z-10" />
            
            {/* Experience Badge */}
            <div className="absolute bottom-12 right-12 bg-white p-6 rounded-3xl shadow-xl z-20 animate-in zoom-in duration-1000">
              <p className="text-primary font-black text-4xl leading-none">10+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Years of<br />Tradition</p>
            </div>
          </div>

          {/* Content Side */}
          <div className="lg:w-1/2 space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-xs tracking-widest uppercase">
                <ChefHat className="w-4 h-4" /> Our Heritage
              </div>
              <h2 className="text-4xl md:text-6xl font-headline font-black text-slate-900 leading-tight">
                From Bahir Dar to <br />
                <span className="text-primary italic">Your Table</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Lake Cafe is more than just a restaurant; it's a celebration of heritage. We bring the authentic flavors of Bahir Dar to the world, staying true to our roots with every dish we serve.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 p-6 rounded-3xl border border-primary/10 bg-primary/5">
                <Heart className="w-8 h-8 text-primary" />
                <h4 className="text-xl font-bold">Made with Love</h4>
                <p className="text-sm text-muted-foreground">Every recipe is a local secret, passed down through generations and prepared with genuine passion.</p>
              </div>
              <div className="space-y-3 p-6 rounded-3xl border border-secondary/10 bg-secondary/5">
                <Award className="w-8 h-8 text-secondary" />
                <h4 className="text-xl font-bold">Quality First</h4>
                <p className="text-sm text-muted-foreground">We source only the freshest local ingredients and finest spices to ensure an unparalleled flavor experience.</p>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-slate-500 italic border-l-4 border-primary pl-6 py-2">
                "We believe that food is a universal language. Our mission is to share the rich, bold flavors of our home with every guest who walks through our doors."
              </p>
              <p className="mt-4 font-bold text-slate-900">— The Lake Cafe Family</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
