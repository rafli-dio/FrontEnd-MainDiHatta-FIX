'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { Booking } from '@/types';

export default function useBookingsSync(initial: Booking[] = [], enabled: boolean = true) {
  const [bookings, setBookings] = useState<Booking[]>(initial);
  const [loading, setLoading] = useState<boolean>(enabled && !initial.length);

  useEffect(() => {
    if (!enabled) return; 

    let mounted = true;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/bookings');
        if (!mounted) return;
        setBookings(res.data);
      } catch (e: any) {
        console.error(e);
        toast.error(e?.response?.data?.message || 'Gagal memuat booking.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBookings();

    return () => {
      mounted = false;
    };
  }, [enabled]);

  const refresh = async () => {
    if (!enabled) return; 
    setLoading(true);
    try {
      const res = await axios.get('/api/bookings');
      setBookings(res.data);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || 'Gagal memuat booking.');
    } finally {
      setLoading(false);
    }
  };

  return { bookings, setBookings, loading, refresh };
}
