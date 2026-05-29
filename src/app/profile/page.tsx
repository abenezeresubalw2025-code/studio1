'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Camera, Save, ArrowLeft, Loader2, Mail, User as UserIcon, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user, userLoading, router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1000000) { 
      toast({
        variant: "destructive",
        title: "Image too large",
        description: "Please select a file smaller than 1MB for your profile picture.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoURL(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth?.currentUser) return;

    setUpdating(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL
      });
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not update profile.",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-muted/30 pb-20">
      <Navigation />
      
      {/* Decorative Header */}
      <div className="relative h-64 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <Image 
            src="https://picsum.photos/seed/restaurant-view/1200/400" 
            alt="Background" 
            fill 
            className="object-cover" 
            priority
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
      </div>

      <div className="container mx-auto px-6 -mt-32 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Back Navigation */}
          <button 
            onClick={() => router.push('/main')}
            className="flex items-center gap-2 text-white mb-6 font-bold hover:underline group drop-shadow-md"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Orders
          </button>

          <Card className="shadow-2xl border-none rounded-[3rem] overflow-hidden bg-white/95 backdrop-blur-md">
            <CardHeader className="text-center pt-12">
              {/* Profile Picture Upload */}
              <div className="relative inline-block mx-auto mb-8 group">
                <Avatar className="h-44 w-44 border-8 border-white shadow-2xl transition-transform duration-500 group-hover:scale-105">
                  <AvatarImage src={photoURL} />
                  <AvatarFallback className="bg-primary/10 text-primary text-6xl font-black">
                    {displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="photo-upload" 
                  className="absolute bottom-2 right-2 p-3 bg-primary text-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform active:scale-95 border-4 border-white"
                >
                  <Camera className="w-6 h-6" />
                  <input 
                    id="photo-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              
              <CardTitle className="text-4xl font-headline font-black text-slate-900 tracking-tight">Profile Settings</CardTitle>
              <CardDescription className="text-lg font-medium text-slate-500 mt-2">Personalize your T-Shawarma experience</CardDescription>
            </CardHeader>

            <CardContent className="px-10 pb-16">
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                {/* Account Verification Badge */}
                <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 mb-2">
                  <ShieldCheck className="w-6 h-6" />
                  <span className="text-sm font-bold uppercase tracking-widest">Verified Member Account</span>
                </div>

                {/* Email Field (Disabled) */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Account Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <Input 
                      id="email" 
                      type="email" 
                      value={user.email || ''} 
                      readOnly 
                      className="h-16 pl-14 bg-slate-50 border-slate-100 rounded-2xl cursor-not-allowed font-bold text-slate-400 text-lg"
                    />
                  </div>
                </div>

                {/* Display Name Field */}
                <div className="space-y-3">
                  <Label htmlFor="displayName" className="text-xs font-black uppercase tracking-[0.2em] text-primary ml-1">Display Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/50" />
                    <Input 
                      id="displayName" 
                      type="text" 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Chef Ibrahim"
                      className="h-16 pl-14 rounded-2xl border-2 border-slate-100 hover:border-primary/20 focus:border-primary focus:ring-0 transition-all text-xl font-bold text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-8">
                  <Button 
                    type="submit" 
                    disabled={updating}
                    className="w-full h-18 bg-primary hover:bg-primary/90 text-white rounded-[2rem] text-xl font-black shadow-[0_20px_40px_rgba(200,16,46,0.2)] transition-all active:scale-95 disabled:opacity-70"
                  >
                    {updating ? (
                      <Loader2 className="w-7 h-7 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-3">
                        <Save className="w-6 h-6" /> Save Profile Details
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <p className="text-center mt-8 text-slate-400 font-medium text-sm">
            T-Shawarma members enjoy exclusive rewards and priority carving.
          </p>
        </div>
      </div>
    </main>
  );
}
