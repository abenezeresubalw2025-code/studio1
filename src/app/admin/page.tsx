'use client';

import React, { useState } from 'react';
import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, setDoc, updateDoc, addDoc, deleteDoc, collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Utensils, LayoutDashboard, LogOut, Plus, Trash2, Save, Globe, Image as ImageIcon, Upload, Palette, PlusCircle, X } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [menuItemImage, setMenuItemImage] = useState<string | null>(null);
  const { toast } = useToast();

  const firestore = useFirestore();

  const siteRef = useMemoFirebase(() => 
    firestore ? doc(firestore, 'settings', 'site') : null, 
    [firestore]
  );
  const servicesRef = useMemoFirebase(() => 
    firestore ? collection(firestore, 'services') : null, 
    [firestore]
  );
  const menuRef = useMemoFirebase(() => 
    firestore ? collection(firestore, 'menu') : null, 
    [firestore]
  );

  const { data: settings } = useDoc(siteRef);
  const { data: services } = useCollection(servicesRef);
  const { data: menuItems } = useCollection(menuRef);

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

  const handleGenericImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file || !firestore) return;

    if (file.size > 3000000) { // 3MB Limit
      toast({
        variant: "destructive",
        title: "Image too large",
        description: "Please select a file smaller than 3MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const ref = doc(firestore, 'settings', 'site');
      setDoc(ref, { [fieldName]: base64String }, { merge: true })
        .then(() => {
          toast({
            title: "Upload Successful",
            description: `${fieldName.replace('Id', '')} has been updated.`,
          });
        })
        .catch(async (e) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: ref.path,
            operation: 'update',
            requestResourceData: { [fieldName]: 'base64_data' }
          }));
        });
    };
    reader.readAsDataURL(file);
  };

  const handleMenuItemImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3000000) { // 3MB Limit
      toast({
        variant: "destructive",
        title: "Image too large",
        description: "Please select a file smaller than 3MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMenuItemImage(reader.result as string);
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
      .then(() => {
        toast({
          title: "Announcement Saved",
          description: "Your global banner has been updated.",
        });
      })
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

  const handleAddMenuItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) return;
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const category = formData.get('category') as string;
    const image = menuItemImage || formData.get('image') as string;
    
    const newItem = { 
      name, 
      description, 
      price, 
      category, 
      image,
      rating: 4.8 
    };

    addDoc(collection(firestore, 'menu'), newItem)
      .then(() => {
        toast({
          title: "Item Added",
          description: `${name} is now on the menu.`,
        });
        setMenuItemImage(null);
      })
      .catch(async (e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'menu',
          operation: 'create',
          requestResourceData: newItem
        }));
      });
    e.currentTarget.reset();
  };

  const handleDeleteMenuItem = (id: string) => {
    if (!firestore) return;
    const ref = doc(firestore, 'menu', id);
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
    menuEnabled: true,
    locationEnabled: true,
    announcementEnabled: false,
    customAnnouncement: "",
    welcomeImageId: "roast-chicken-special",
    logoId: ""
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
          <TabsList className="bg-muted p-1 rounded-xl h-14 overflow-x-auto justify-start md:justify-center">
            <TabsTrigger value="sections" className="rounded-lg px-8 h-12 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Globe className="w-4 h-4 mr-2" /> Web Sections
            </TabsTrigger>
            <TabsTrigger value="branding" className="rounded-lg px-8 h-12 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Palette className="w-4 h-4 mr-2" /> Branding
            </TabsTrigger>
            <TabsTrigger value="services" className="rounded-lg px-8 h-12 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Utensils className="w-4 h-4 mr-2" /> Services
            </TabsTrigger>
            <TabsTrigger value="menu" className="rounded-lg px-8 h-12 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <PlusCircle className="w-4 h-4 mr-2" /> Add Menu
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sections" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Menu Section', key: 'menuEnabled' },
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
          </TabsContent>

          <TabsContent value="branding" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-primary/10 shadow-xl overflow-hidden">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Upload className="w-5 h-5" /> Site Logo
                  </CardTitle>
                  <CardDescription>Upload your official restaurant logo</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    {siteConfig.logoId && (
                      <div className="mb-6 flex justify-center p-4 bg-muted rounded-2xl">
                         <Image src={siteConfig.logoId} alt="Current Logo" width={150} height={150} className="object-contain" />
                      </div>
                    )}
                    <div className="relative">
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleGenericImageUpload(e, 'logoId')}
                        className="h-14 rounded-xl border-2 pt-4 cursor-pointer file:hidden"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted-foreground">
                        <Upload className="w-5 h-5 mr-2" />
                        <span>{siteConfig.logoId ? "Change Logo" : "Upload Logo"}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Max size 3MB. Transparent PNG recommended.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-xl overflow-hidden">
                <CardHeader className="bg-secondary/5">
                  <CardTitle className="flex items-center gap-2 text-secondary">
                    <ImageIcon className="w-5 h-5" /> Welcome Page Image
                  </CardTitle>
                  <CardDescription>Update visual elements for the /welcome page</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <Label className="font-bold">Top Right Hero Picture</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Choose Preset</Label>
                        <Select 
                          defaultValue={siteConfig.welcomeImageId || "roast-chicken-special"} 
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
                            onChange={(e) => handleGenericImageUpload(e, 'welcomeImageId')}
                            className="h-14 rounded-xl border-2 pt-4 cursor-pointer file:hidden"
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted-foreground">
                            <Upload className="w-5 h-5 mr-2" />
                            <span>Pick a file</span>
                          </div>
                        </div>
                      </div>
                    </div>
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

          <TabsContent value="menu" className="space-y-8">
            <Card className="border-primary/10 shadow-xl">
              <CardHeader>
                <CardTitle>Menu Management</CardTitle>
                <CardDescription>Add new dishes or manage existing ones</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleAddMenuItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  <div className="space-y-2">
                    <Label>Dish Name</Label>
                    <Input name="name" placeholder="e.g. Royal Chicken Wrap" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input name="price" placeholder="e.g. $12.99" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select name="category" defaultValue="Shawarma">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Shawarma">Shawarma</SelectItem>
                        <SelectItem value="Roast Chicken">Roast Chicken</SelectItem>
                        <SelectItem value="Chicken Recipes">Chicken Recipes</SelectItem>
                        <SelectItem value="Drinks">Drinks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 lg:col-span-3">
                    <Label>Description</Label>
                    <Textarea name="description" placeholder="Describe the flavors..." required />
                  </div>
                  <div className="space-y-2 lg:col-span-1">
                    <Label>Upload Photo</Label>
                    <div className="relative">
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleMenuItemImageUpload}
                        className="h-10 cursor-pointer pt-2"
                      />
                      {menuItemImage && (
                        <button 
                          type="button"
                          onClick={() => setMenuItemImage(null)}
                          className="absolute right-2 top-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    {menuItemImage && (
                      <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border">
                        <Image src={menuItemImage} alt="Preview" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 lg:col-span-1">
                    <Label>Or Choose Preset</Label>
                    <Select name="image" defaultValue="dish-chicken" disabled={!!menuItemImage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an image placeholder" />
                      </SelectTrigger>
                      <SelectContent>
                        {PlaceHolderImages.filter(img => img.id.startsWith('dish-')).map(img => (
                          <SelectItem key={img.id} value={img.id}>{img.description}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end lg:col-span-1">
                    <Button type="submit" className="w-full h-10 bg-primary">
                      <Plus className="w-4 h-4 mr-2" /> Add to Menu
                    </Button>
                  </div>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems?.map((item: any) => {
                    const isBase64 = item.image?.startsWith('data:image');
                    const isUrl = item.image?.startsWith('http');
                    const imageUrl = (isBase64 || isUrl) ? item.image : (PlaceHolderImages.find(p => p.id === item.image)?.imageUrl || '');

                    return (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-muted/20 border rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white rounded-xl overflow-hidden relative border">
                             {imageUrl && (
                               <Image 
                                src={imageUrl} 
                                alt={item.name} 
                                fill 
                                className="object-cover"
                                unoptimized={isBase64}
                               />
                             )}
                          </div>
                          <div>
                            <h4 className="font-bold">{item.name}</h4>
                            <p className="text-primary text-sm font-bold">{item.price}</p>
                            <p className="text-xs text-muted-foreground uppercase">{item.category}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteMenuItem(item.id)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                  {(!menuItems || menuItems.length === 0) && (
                    <div className="col-span-full text-center py-12 border-2 border-dashed rounded-3xl text-muted-foreground">
                      No dishes in the database yet. Add your first masterpiece!
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
