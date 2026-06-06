"use client"

import React, { useState, useMemo } from 'react';
import { aiDishRecommender, AiDishRecommenderOutput } from '@/ai/flows/ai-dish-recommender';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, ChefHat, Loader2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function AIRecommendations() {
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiDishRecommenderOutput | null>(null);
  const firestore = useFirestore();

  const menuQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'menu');
  }, [firestore]);

  const { data: menuItems } = useCollection(menuQuery);

  const menuString = useMemo(() => {
    if (!menuItems) return "";
    return menuItems.map(item => `${item.name}: ${item.description}`).join('\n');
  }, [menuItems]);

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferences.trim() || !menuString) return;

    setLoading(true);
    try {
      const output = await aiDishRecommender({
        userPreferences: preferences,
        menu: menuString
      });
      setResult(output);
    } catch (error) {
      console.error('AI Recommendation Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-navigator" className="py-24 bg-secondary/5 border-y border-secondary/10">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-6 font-bold text-sm tracking-widest uppercase">
            <Sparkles className="w-4 h-4" /> Lake Cafe AI Flavor Navigator
          </div>
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6">Not sure what you crave?</h2>
          <p className="text-xl text-muted-foreground">Tell our AI assistant your mood, dietary needs, or flavor preferences, and we'll craft the perfect suggestion for you.</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleRecommend} className="relative mb-12">
            <Input 
              placeholder="E.g., 'I want something spicy' or 'Looking for a light lunch'" 
              className="h-16 pl-6 pr-32 rounded-full border-2 border-secondary/20 focus-visible:ring-secondary text-lg"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              disabled={loading}
            />
            <Button 
              type="submit" 
              className="absolute right-2 top-2 h-12 px-6 rounded-full bg-secondary hover:bg-secondary/90"
              disabled={loading || !preferences.trim() || !menuString}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Inspire Me"}
            </Button>
          </form>

          {loading && (
            <div className="flex flex-col items-center gap-4 animate-pulse">
              <ChefHat className="w-12 h-12 text-secondary opacity-50" />
              <p className="text-secondary font-medium italic">Our Flavor Navigator is thinking...</p>
            </div>
          )}

          {result && (
            <div className="grid gap-6 fade-in-stagger">
              {result.recommendations.length > 0 ? (
                result.recommendations.map((rec, i) => (
                  <Card key={i} className="border-secondary/20 overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-background/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-headline font-bold text-primary mb-3 flex items-center gap-2">
                            {rec.dishName}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed italic">
                            "{rec.reason}"
                          </p>
                        </div>
                        <Button variant="ghost" className="text-secondary group p-0">
                          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center p-8 bg-muted rounded-2xl">
                  <p className="text-muted-foreground">We couldn't find a perfect match. Try describing a different craving!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
