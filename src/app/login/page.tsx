'use client';

import React, { useState } from 'react';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Welcome back!',
        description: 'Redirecting to your dashboard...',
      });
      router.push('/main');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error.message || 'Please check your credentials.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Account created!',
        description: 'Redirecting to your dashboard...',
      });
      router.push('/main');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Signup failed',
        description: error.message || 'Could not create account.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div 
        className="absolute top-0 left-0 w-full h-1/2 bg-primary z-0" 
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)' }} 
      />
      
      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/welcome" className="inline-block mb-4">
             <h1 className="text-4xl font-headline font-black text-white tracking-tighter drop-shadow-md">T-SHAWARMA</h1>
          </Link>
        </div>

        <Card className="shadow-2xl border-none rounded-[2rem] overflow-hidden">
          <CardHeader className="text-center space-y-1 bg-white pt-8">
            <CardTitle className="text-2xl font-headline font-bold">Member Portal</CardTitle>
            <CardDescription>Experience the art of flavor</CardDescription>
          </CardHeader>
          <CardContent className="bg-white px-8 pb-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 h-12 rounded-xl">
                <TabsTrigger value="login" className="rounded-lg h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <LogIn className="w-4 h-4 mr-2" /> Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <UserPlus className="w-4 h-4 mr-2" /> Join
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input 
                      id="login-password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <Button type="submit" className="w-full h-14 bg-primary text-lg font-bold rounded-xl mt-4" disabled={loading}>
                    {loading && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      placeholder="Create a strong password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <Button type="submit" className="w-full h-14 bg-secondary text-lg font-bold rounded-xl mt-4" disabled={loading}>
                    {loading && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="bg-muted/30 p-6 flex flex-col gap-4 text-center">
             <p className="text-xs text-muted-foreground leading-relaxed">
               By continuing, you agree to T-Shawarma's Terms of Service and Privacy Policy.
             </p>
          </CardFooter>
        </Card>

        <div className="text-center mt-8">
          <Link href="/" className="text-primary font-bold hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
