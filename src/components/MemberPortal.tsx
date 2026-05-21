
"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MemberPortal() {
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

          <div className="max-w-xl mx-auto">
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
                <Button className="w-full bg-secondary hover:bg-secondary/90">Claim More Rewards</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
