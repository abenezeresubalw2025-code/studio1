
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, useUser, useMemoFirebase } from '@/firebase';
import { 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { doc } from 'firebase/firestore';
import { useFirestore, useDoc } from '@/firebase';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const auth = useAuth();
  const firestore = useFirestore();
  const { user: currentUser, loading: userLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const siteRef = useMemoFirebase(() => 
    firestore ? doc(firestore, 'settings', 'site') : null, 
    [firestore]
  );
  
  const { data: settings } = useDoc(siteRef);

  useEffect(() => {
    if (currentUser && !userLoading) {
      router.push('/main');
    }
  }, [currentUser, userLoading, router]);

  useEffect(() => {
    if (!auth) return;

    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          toast({
            title: `Welcome back!`,
            description: 'Successfully signed in with Google.',
          });
          router.push('/main');
        }
      })
      .catch((error: any) => {
        if (error.code !== 'auth/no-redirect-result') {
          toast({
            variant: 'destructive',
            title: 'Authentication failed',
            description: error.message || 'Could not complete Google sign-in redirect.',
          });
        }
        setLoading(false);
      });
  }, [auth, router, toast]);

  const handleGoogleLogin = async () => {
    if (!auth) return;
    setLoading(true);

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      setLoading(false);
      toast({
        variant: 'destructive',
        title: 'Authentication failed',
        description: error.message || 'Could not initiate Google sign-in.',
      });
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome back!",
        description: "Successfully signed in with email.",
      });
      router.push('/main');
    } catch (error: any) {
      setLoading(false);
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error.message || 'Invalid email or password.',
      });
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      toast({
        title: "Account created!",
        description: "Welcome to the T-Shawarma family.",
      });
      router.push('/main');
    } catch (error: any) {
      setLoading(false);
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: error.message || 'Could not create account.',
      });
    }
  };

  const logoUrl = settings?.logoId;

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-6 relative overflow-hidden">
      <div 
        className="absolute top-0 left-0 w-full h-1/2 bg-primary z-0" 
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)' }} 
      />
      
      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/welcome" className="inline-block mb-4">
             {logoUrl ? (
               <div className="flex justify-center mb-4 transition-transform hover:scale-105 duration-300">
                 <Image 
                   src={logoUrl} 
                   alt="T-Shawarma Logo" 
                   width={120} 
                   height={120} 
                   className="object-contain drop-shadow-2xl" 
                   priority
                 />
               </div>
             ) : (
               <h1 className="text-4xl md:text-5xl font-headline font-black text-white tracking-tighter drop-shadow-md">T-SHAWARMA</h1>
             )}
          </Link>
        </div>

        <Card className="shadow-2xl border-none rounded-[2rem] overflow-hidden">
          <CardHeader className="text-center space-y-1 bg-white pt-8">
            <CardTitle className="text-2xl font-headline font-bold">Member Portal</CardTitle>
            <CardDescription>Experience the art of flavor</CardDescription>
          </CardHeader>
          <CardContent className="bg-white px-8 pb-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 rounded-xl p-1">
                <TabsTrigger value="login" className="rounded-lg">Login</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="chef@tshawarma.com" 
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 bg-primary font-bold text-lg" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleEmailRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="John Doe" 
                        className="pl-10"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="chef@tshawarma.com" 
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signup-password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 bg-primary font-bold text-lg" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground font-bold">Or continue with</span>
              </div>
            </div>
            
            <Button 
              onClick={handleGoogleLogin} 
              className="w-full h-14 bg-white text-black border-2 hover:bg-muted text-lg font-bold rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95" 
              disabled={loading}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M0 0h24v24H0z" />
              </svg>
              Google
            </Button>
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
