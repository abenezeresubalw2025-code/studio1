
'use client';

import React, { useState } from 'react';
import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, setDoc, updateDoc, addDoc, deleteDoc, collection, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  LayoutDashboard, 
  LogOut, 
  Plus, 
  Trash2, 
  Save, 
  Globe, 
  Upload, 
  Palette, 
  PlusCircle, 
  X, 
  Layers, 
  ClipboardList,
  Clock,
  CheckCircle2,
  Phone,
  MapPin,
  User as UserIcon,
  CreditCard,
  Banknote
} from 'lucide-react';
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
  const categoriesRef = useMemoFirebase(() => 
    firestore ? collection(firestore, 'categories') : null, 
    [firestore]
  );
  const ordersRef = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'orders'), orderBy('createdAt', 'desc')) : null, 
    [firestore]
  );

  const { data: settings } = useDoc(siteRef);
  const { data: services } = useCollection(servicesRef);
  const { data: menuItems } = useCollection(menuRef);
  const { data: categories } = useCollection(categoriesRef);
  const { data: orders } = useCollection(ordersRef);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Use admin/admin.');
    }
  };

  const handleUpdateSetting = (key: string, value: any) => {
    if (!firestore) return;
    const ref = doc(firestore, 'settings', 'site');
    setDoc(ref, { [key]: value }, { merge: true })
      .then(() => {
        toast({ title: "Updated", description: "Setting saved successfully." });
      })
      .catch(async (e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: ref.path,
          operation: 'update',
          requestResourceData: { [key]: value }
        }));
      });
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    if (!firestore) return;
    const ref = doc(firestore, 'orders', orderId);
    updateDoc(ref, { status: newStatus })
      .then(() => {
        toast({
          title: "Order Updated",
          description: `Status changed to ${newStatus}`,
        });
      })
      .catch(async (e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: ref.path,
          operation: 'update',
          requestResourceData: { status: newStatus }
        }));
      });
  };

  const handleGenericImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file || !firestore) return;

    if (file.size > 3000000) {
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

  const siteConfig = settings || {};

  return (
    <div className="min-h-screen bg-background pb-20">
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
        <Tabs defaultValue="orders" className="space-y-8">
          <TabsList className="bg-muted p-1 rounded-xl h-14 overflow-x-auto justify-start md:justify-center">
            <TabsTrigger value="orders" className="rounded-lg px-8 h-12">
              <ClipboardList className="w-4 h-4 mr-2" /> Orders
            </TabsTrigger>
            <TabsTrigger value="payments" className="rounded-lg px-8 h-12">
              <CreditCard className="w-4 h-4 mr-2" /> Payments
            </TabsTrigger>
            <TabsTrigger value="sections" className="rounded-lg px-8 h-12">
              <Globe className="w-4 h-4 mr-2" /> Sections
            </TabsTrigger>
            <TabsTrigger value="branding" className="rounded-lg px-8 h-12">
              <Palette className="w-4 h-4 mr-2" /> Branding
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {orders?.map((order: any) => (
                <Card key={order.id} className="border-none shadow-lg rounded-2xl overflow-hidden bg-white">
                  <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/3 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                          <UserIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</p>
                          <h4 className="font-black text-lg text-slate-800">{order.customerName}</h4>
                        </div>
                      </div>
                      <div className="space-y-3 pl-2 text-sm text-slate-600 font-bold">
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> {order.phoneNumber}</div>
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {order.kebele}</div>
                        {order.specialAddress && <p className="text-xs text-slate-400 italic pl-6">"{order.specialAddress}"</p>}
                      </div>
                      <div className="pt-4 border-t border-slate-50">
                        <Select defaultValue={order.status} onValueChange={(val) => handleUpdateOrderStatus(order.id, val)}>
                          <SelectTrigger className="w-full font-black uppercase h-12 rounded-xl bg-slate-100 border-none">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="preparing">Preparing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="lg:w-2/3 space-y-6">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-[10px] font-black">{order.createdAt?.toDate().toLocaleString() || 'Recent'}</Badge>
                        <h3 className="text-2xl font-black text-primary">ETB {order.totalAmount.toFixed(2)}</h3>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="font-bold">{item.quantity}x {item.name}</span>
                            <span className="text-slate-400">ETB {(parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Telebirr', prefix: 'telebirr' },
                { label: 'CBE', prefix: 'cbe' },
                { label: 'Abyssinia', prefix: 'abyssinia' },
              ].map((bank) => (
                <Card key={bank.prefix} className="shadow-lg border-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-primary" /> {bank.label} Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Account Number</Label>
                      <Input 
                        placeholder="Number" 
                        defaultValue={siteConfig[`${bank.prefix}Account`]} 
                        onBlur={(e) => handleUpdateSetting(`${bank.prefix}Account`, e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Name</Label>
                      <Input 
                        placeholder="Name" 
                        defaultValue={siteConfig[`${bank.prefix}Name`]} 
                        onBlur={(e) => handleUpdateSetting(`${bank.prefix}Name`, e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sections">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Menu Section', key: 'menuEnabled' },
                { label: 'Location & Hours', key: 'locationEnabled' },
              ].map((item) => (
                <Card key={item.key} className="p-6 flex items-center justify-between">
                  <Label className="text-lg font-medium">{item.label}</Label>
                  <Switch 
                    checked={!!siteConfig[item.key]} 
                    onCheckedChange={(val) => handleUpdateSetting(item.key, val)}
                  />
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="branding">
            <Card className="shadow-xl">
              <CardHeader><CardTitle>Logo Upload</CardTitle></CardHeader>
              <CardContent className="p-8">
                <Input type="file" accept="image/*" onChange={(e) => handleGenericImageUpload(e, 'logoId')} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
