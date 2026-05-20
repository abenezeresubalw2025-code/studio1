
"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, History, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export function MemberPortal() {
  const favoriteItems = [
    { id: 'fav1', name: 'The Crimson Chicken', date: 'Last ordered 2 days ago', img: 'dish-chicken' },
    { id: 'fav2', name: 'Royal Beef Shawarma', date: 'Last ordered 1 week ago', img: 'dish-beef' },
  ];

  return (
    <section id="member" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="bg-muted/20 p-8 md:p-16 rounded-[3rem] border border-primary/5">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center font-headline text-2xl font-bold shadow-lg">
                  JD
                </div>
                <div>
                  <h2 className="text-3xl font-headline font-bold">Welcome Back, John</h2>
                  <p className="text-muted-foreground">T-Shawarma Gold Member since 2024</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/5 text-center">
                <span className="text-sm text-muted-foreground uppercase tracking-widest block mb-1">Flavor Points</span>
                <span className="text-3xl font-headline font-bold text-primary">2,450</span>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/5 text-center">
                <span className="text-sm text-muted-foreground uppercase tracking-widest block mb-1">Rewards</span>
                <span className="text-3xl font-headline font-bold text-secondary">3</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-none shadow-xl bg-white/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" /> Your Favorites
                </CardTitle>
                <Button variant="link" className="text-primary font-bold">View Menu</Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {favoriteItems.map(item => {
                  const img = PlaceHolderImages.find(i => i.id === item.img);
                  return (
                    <div key={item.id} className="flex items-center gap-6 group cursor-pointer">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden relative shrink-0 shadow-md">
                        <Image src={img?.imageUrl || ''} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-headline font-bold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                      <Button className="bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full">Reorder</Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-secondary" /> Active Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-secondary/10 rounded-2xl border border-secondary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="w-5 h-5 text-secondary fill-secondary" />
                    <span className="font-bold text-secondary">Free Baklava</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Available on your next order over $20</p>
                </div>
                <div className="p-4 bg-muted rounded-2xl opacity-50 grayscale">
                  <div className="flex items-center gap-3 mb-2">
                    <History className="w-5 h-5 text-muted-foreground" />
                    <span className="font-bold">10% Off Wrap</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Expired on Oct 12, 2024</p>
                </div>
                <Button className="w-full bg-secondary hover:bg-secondary/90">Claim More Rewards</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
