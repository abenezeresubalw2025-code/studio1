
"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Users, Clock, CheckCircle2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

export function TableBooking() {
  const [date, setDate] = useState<Date>();
  const [isBooked, setIsBooked] = useState(false);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
    toast({
      title: "Booking Successful",
      description: "We've reserved your table. See you soon!",
    });
  };

  if (isBooked) {
    return (
      <section id="booking" className="py-24 bg-primary text-white text-center">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mx-auto py-12 px-8 bg-white/10 rounded-3xl backdrop-blur-lg border border-white/20">
            <CheckCircle2 className="w-20 h-20 mx-auto mb-6 text-white" />
            <h2 className="text-4xl font-headline font-bold mb-4">Reservation Confirmed!</h2>
            <p className="text-xl text-white/80 mb-8">We have sent the details to your email. We look forward to serving you.</p>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary"
              onClick={() => setIsBooked(false)}
            >
              Make Another Booking
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="fade-in-stagger">
            <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">Reservations</span>
            <h2 className="text-5xl font-headline font-bold mb-6">Secure Your Experience</h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Whether it's an intimate dinner or a festive gathering, T-Shawarma 
              provides the perfect backdrop for unforgettable culinary moments.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold">Rapid Confirmations</h4>
                  <p className="text-sm text-muted-foreground">Instant real-time availability checking.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold">Group Bookings</h4>
                  <p className="text-sm text-muted-foreground">Special arrangements for parties of 10 or more.</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleBooking} className="bg-white p-10 rounded-3xl shadow-2xl border border-primary/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal h-14 rounded-xl border-2">
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase">Guests</label>
                <Select>
                  <SelectTrigger className="h-14 rounded-xl border-2">
                    <SelectValue placeholder="How many guests?" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <SelectItem key={n} value={n.toString()}>{n} {n === 1 ? 'Guest' : 'Guests'}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <label className="text-sm font-bold text-muted-foreground uppercase">Full Name</label>
              <Input placeholder="Your name" className="h-14 rounded-xl border-2" required />
            </div>

            <Button type="submit" className="w-full h-16 bg-primary text-xl font-headline font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
              Complete Reservation
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4">By booking, you agree to our Terms of Service.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
