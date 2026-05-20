
"use client"

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';

export function SignatureGallery() {
  const galleryImages = PlaceHolderImages.filter(img => img.id.startsWith('gallery-'));

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4">Chef's Signature Gallery</h2>
            <p className="text-lg text-muted-foreground">A visual journey through our kitchen's most stunning creations. Every wrap is a masterpiece.</p>
          </div>
          <div className="flex items-center gap-4 text-primary font-bold group cursor-pointer">
            View All Creations <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto horizontal-snap gap-8 px-6 pb-12 no-scrollbar">
        {galleryImages.map((img, i) => (
          <div 
            key={img.id} 
            className={`flex-none w-[300px] md:w-[450px] group relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-4 ${i % 2 === 0 ? 'mt-0' : 'mt-12'}`}
          >
            <div className="aspect-[3/4] relative">
              <Image 
                src={img.imageUrl} 
                alt={img.description} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                data-ai-hint={img.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                <div>
                  <h3 className="text-2xl font-headline text-white mb-2">{img.description}</h3>
                  <p className="text-white/70 text-sm">Hand-selected seasonal ingredients.</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
