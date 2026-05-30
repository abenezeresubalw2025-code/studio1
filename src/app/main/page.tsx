
'use client';

import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { 
  Loader2, 
  Clock, 
  CheckCircle2, 
  Package,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

export default function MainDashboard() {
  const { user, loading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    // Note: This query may require a composite index in production.
    return query(
      collection(firestore, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user]);

  const { data: orders, loading: ordersLoading } = useCollection(ordersQuery);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const pendingOrders = orders?.filter(o => o.status === 'pending' || o.status === 'preparing') || [];
  const deliveredOrders = orders?.filter(o => o.status === 'completed') || [];

  const OrderCard = ({ order }: { order: any }) => (
    <Card className="border-none shadow-lg rounded-[1.5rem] overflow-hidden bg-white mb-4 hover:shadow-xl transition-all duration-300">
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
          }`}>
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-slate-800 text-sm">Order #{order.id.slice(-4).toUpperCase()}</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {order.createdAt?.toDate().toLocaleDateString() || 'Just now'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-black text-primary text-sm">ETB {order.totalAmount.toFixed(2)}</p>
          <Badge variant="outline" className={`text-[9px] font-black uppercase mt-1 px-3 py-0.5 rounded-full border-2 ${
            order.status === 'completed' ? 'border-emerald-100 text-emerald-600' : 'border-amber-100 text-amber-600'
          }`}>
            {order.status}
          </Badge>
        </div>
      </div>
    </Card>
  );

  return (
    <main className="min-h-screen bg-[#FDFCFB] pb-32">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-32 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">My Activity</h1>
          <p className="text-slate-400 font-bold text-sm">Track your delicious journeys in real-time.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Pending Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-200">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">In Progress</h2>
              </div>
              <Badge className="bg-amber-500 text-white font-black rounded-full px-3">{pendingOrders.length}</Badge>
            </div>
            
            <div className="space-y-4">
              {pendingOrders.length > 0 ? (
                pendingOrders.map(order => <OrderCard key={order.id} order={order} />)
              ) : (
                <div className="bg-white rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-100 shadow-sm">
                  <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold italic mb-4">No active orders</p>
                  <Link href="/menu">
                    <span className="bg-primary text-white font-black text-xs uppercase px-8 py-3 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform cursor-pointer inline-block">Start Ordering</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Delivered Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Delivered</h2>
              </div>
              <Badge className="bg-emerald-500 text-white font-black rounded-full px-3">{deliveredOrders.length}</Badge>
            </div>

            <div className="space-y-4">
              {deliveredOrders.length > 0 ? (
                deliveredOrders.map(order => <OrderCard key={order.id} order={order} />)
              ) : (
                <div className="bg-white rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-100 shadow-sm opacity-60">
                  <p className="text-slate-400 font-bold italic">Your history will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
