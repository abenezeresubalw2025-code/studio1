'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, useUser, useMemoFirebase } from '@/firebase';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { doc } from 'firebase/firestore';
import { useFirestore, useDoc } from '@/firebase';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
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

  // Auto-redirect if already logged in
  useEffect(() => {
    if (currentUser && !userLoading) {
      router.push('/main');
    }
  }, [currentUser, userLoading, router]);

  useEffect(() => {
    if (!auth) return;

    // Handle the redirect result when the user returns to the page
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
        // Only show error if it's not the default "no redirect" state
        if (error.code !== 'auth/no-redirect-result') {
          console.error('Redirect sign-in error:', error);
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
    // Force account selection to help with testing multiple accounts
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
            <div className="flex flex-col gap-6">
              <p className="text-sm text-center text-muted-foreground">
                Join our family or sign back in with your Google account to access your personalized flavor profile and rewards.
              </p>
              
              <Button 
                onClick={handleGoogleLogin} 
                className="w-full h-14 bg-white text-black border-2 hover:bg-muted text-lg font-bold rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95" 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
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
                    Continue with Google
                  </>
                )}
              </Button>
            </div>
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
