'use client';

import React, { useState } from 'react';
import { useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, setDoc, updateDoc, addDoc, deleteDoc, collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Utensils, LayoutDashboard, LogOut, Plus, Trash2, Save, Globe, Image as ImageIcon, Upload } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const firestore = useFirestore();
  const { data: settings, loading: settingsLoading } = useDoc(firestore ? doc(firestore, 'settings', 'site') : null);
  const { data: services, loading: servicesLoading } = useCollection(firestore ? collection(firestore, 'services') : null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Use admin/admin.');
    }
  };

  const handleToggleSetting = (key: string, value: any) => {
    if (!firestore) return;
    const ref = doc(firestore, 'settings', 'site');
    setDoc(ref, { [key]: value }, { merge: true })
      .catch(async (e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: ref.path,
          operation: 'update',
          requestResourceData: { [key]: value }
        }));
      });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !firestore) return;

    if (file.size > 800000) {
      alert("The image is too large. Please select a file smaller than 800KB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const ref = doc(firestore, 'settings', 'site');
      setDoc(ref, { welcomeImageId: base64String }, { merge: true })
        .catch(async (e) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: ref.path,
            operation: 'update',
            requestResourceData: { welcomeImageId: 'base64_data' }
          }));
        });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAnnouncement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) return;
    const formData = new FormData(e.currentTarget);
    const text = formData.get('announcement') as string;
    const ref = doc(firestore, 'settings', 'site');
    updateDoc(ref, { customAnnouncement: text })
      .catch(async (e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: ref.path,
          operation: 'update',
          requestResourceData: { customAnnouncement: text }
        }));
      });
  };

  const handleAddService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) return;
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    
    const newService = { name, description, isActive: true, iconName: 'Utensils' };
    addDoc(collection(firestore, 'services'), newService)
      .catch(async (e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'services',
          operation: 'create',
          requestResourceData: newService
        }));
      });
    e.currentTarget.reset();
  };

  const handleDeleteService = (id: string) => {
    if (!firestore) return;
    const ref = doc(firestore, 'services', id);
    deleteDoc(ref)
      .catch(async (e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: ref.path,
          operation: 'delete'
        }));
      });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
        <Card className="w-full max-w-md shadow-2xl border-primary/10">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
              <Settings className="text-white w-8 h-8" />
            </div>
            <CardTitle className="text-3xl font-headline font-bold text-primary">Admin Access</CardTitle>
            <CardDescription>Enter credentials to manage T-Shawarma</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" className="h-12" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-12" />
              </div>
              {loginError && <p className="text-destructive text-sm font-bold animate-bounce">{loginError}</p>}
              <Button type="submit" className="w-full bg-primary h-12 text-lg font-bold">Login to Dashboard</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const siteConfig = settings || {
    heroEnabled: true,
    galleryEnabled: true,
    menuEnabled: true,
    aiNavigatorEnabled: true,
    bookingEnabled: true,
    memberPortalEnabled: true,
    locationEnabled: true,
    announcementEnabled: false,
    customAnnouncement: "",
    welcomeImageId: "gallery-1"
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg">
              <LayoutDashboard className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-headline font-bold text-primary">T-Shawarma Admin</h1>
          </div>
          <Button variant="ghost" onClick={() => setIsAuthenticated(false)} className="text-muted-foreground hover:text-primary">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <Tabs defaultValue="sections" className="space-y-8">
          <TabsList className="bg-muted p-1 rounded-xl h-14">
            <TabsTrigger value="sections" className="rounded-lg px-8 h-12 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Globe className="w-4 h-4 mr-2" /> Web Sections
            </TabsTrigger>
            <TabsTrigger value="services" className="rounded-lg px-8 h-12 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Utensils className="w-4 h-4 mr-2" /> Services
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sections" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Hero Section', key: 'heroEnabled' },
                { label: 'Signature Gallery', key: 'galleryEnabled' },
                { label: 'Menu Section', key: 'menuEnabled' },
                { label: 'AI Navigator', key: 'aiNavigatorEnabled' },
                { label: 'Booking System', key: 'bookingEnabled' },
                { label: 'Member Portal', key: 'memberPortalEnabled' },
                { label: 'Location & Hours', key: 'locationEnabled' },
              ].map((item) => (
                <Card key={item.key} className="border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center justify-between">
                    <Label className="text-lg font-medium">{item.label}</Label>
                    <Switch 
                      checked={siteConfig[item.key as keyof typeof siteConfig] as boolean} 
                      onCheckedChange={(val) => handleToggleSetting(item.key, val)}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-primary/10 shadow-xl overflow-hidden">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Settings className="w-5 h-5" /> Custom Announcement
                  </CardTitle>
                  <CardDescription>Display a global banner at the top of the home page</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border">
                    <Label className="font-bold">Enable Announcement Banner</Label>
                    <Switch 
                      checked={siteConfig.announcementEnabled} 
                      onCheckedChange={(val) => handleToggleSetting('announcementEnabled', val)}
                    />
                  </div>
                  <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                    <Label>Banner Text</Label>
                    <Textarea 
                      name="announcement" 
                      defaultValue={siteConfig.customAnnouncement} 
                      placeholder="E.g., Grand Opening Special: 20% Off All Wraps!"
                      className="min-h-[120px] text-lg rounded-xl"
                    />
                    <Button type="submit" className="bg-primary w-full h-14 text-lg">
                      <Save className="w-5 h-5 mr-2" /> Save Announcement
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-xl overflow-hidden">
                <CardHeader className="bg-secondary/5">
                  <CardTitle className="flex items-center gap-2 text-secondary">
                    <ImageIcon className="w-5 h-5" /> Welcome Page Customization
                  </CardTitle>
                  <CardDescription>Update images and visual elements for the /welcome page</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <Label className="font-bold">Top Right Picture</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Choose Preset</Label>
                        <Select 
                          defaultValue={siteConfig.welcomeImageId || "gallery-1"} 
                          onValueChange={(val) => handleToggleSetting('welcomeImageId', val)}
                        >
                          <SelectTrigger className="h-14 rounded-xl border-2">
                            <SelectValue placeholder="Select an image" />
                          </SelectTrigger>
                          <SelectContent>
                            {PlaceHolderImages.map((img) => (
                              <SelectItem key={img.id} value={img.id}>
                                {img.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Upload Custom</Label>
                        <div className="relative">
                          <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload}
                            className="h-14 rounded-xl border-2 pt-4 cursor-pointer file:hidden"
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted-foreground">
                            <Upload className="w-5 h-5 mr-2" />
                            <span>Pick a file</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground italic mt-2">
                      Choose from our signatures or upload a photo from your device (Max 800KB).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-8">
            <Card className="border-primary/10 shadow-xl">
              <CardHeader>
                <CardTitle>Manage Services</CardTitle>
                <CardDescription>Add or remove available restaurant services</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                  <Input name="name" placeholder="Service Name (e.g., Catering)" required className="h-12" />
                  <Input name="description" placeholder="Short description" required className="h-12" />
                  <Button type="submit" className="bg-secondary h-12">
                    <Plus className="w-4 h-4 mr-2" /> Add Service
                  </Button>
                </form>

                <div className="space-y-4">
                  {services?.map((service: any) => (
                    <div key={service.id} className="flex items-center justify-between p-6 bg-white border rounded-2xl shadow-sm hover:border-primary/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-primary">
                          <Utensils className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-xl font-headline font-bold">{service.name}</h4>
                          <p className="text-muted-foreground text-sm">{service.description}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                  {(!services || services.length === 0) && (
                    <div className="text-center py-12 border-2 border-dashed rounded-3xl text-muted-foreground">
                      No services found. Add your first service above.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
