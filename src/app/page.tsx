'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

import HeroSection from '@/components/pelanggan/homepage/HeroSection';
import AboutSection from '@/components/pelanggan/homepage/AboutSection';
import CalendarSection from '@/components/pelanggan/homepage/CalendarSection';
import Navbar from '@/components/pelanggan/Navbar'; 

import { Booking } from '@/types'; 

export default function Home() {
  useAuth({ middleware: 'guest', redirectIfAuthenticated: '/pelanggan/home' });

  const [bookings, setBookings] = useState<Booking[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resBook = await axios.get('/api/bookings');
        setBookings(resBook.data);

      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-900 pb-10">
      <Navbar />

      <HeroSection />
      <AboutSection />
      <CalendarSection bookings={bookings} />

      <div className="max-w-4xl mx-auto my-12 px-6">
           <div className="bg-orange-50 border border-orange-100 rounded-[2rem] p-8 text-center shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ingin Booking Lapangan?</h3>
                <p className="text-gray-500 mb-6">Masuk atau daftar sekarang untuk mulai memesan jadwal mainmu.</p>
                <div className="flex justify-center gap-4">
                    <Link href="/login" className="px-6 py-2.5 bg-[#D93F21] text-white rounded-full font-bold hover:bg-[#b9351b] transition shadow-lg">Masuk</Link>
                    <Link href="/register" className="px-6 py-2.5 bg-white text-[#D93F21] border border-[#D93F21] rounded-full font-bold hover:bg-gray-50 transition">Daftar Akun</Link>
                </div>
           </div>
      </div>
    </div>
  );
}
