'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

import HeroSection from '@/components/pelanggan/homepage/HeroSection';
import AboutSection from '@/components/pelanggan/homepage/AboutSection';
import CalendarSection from '@/components/pelanggan/homepage/CalendarSection';
import useBookingsSync from '@/hooks/useBookingsSync';

import { Booking } from '@/types';

export default function PelangganHomepage() {
    const { user, logout } = useAuth({ middleware: 'auth' });
    
    const { bookings, loading: bookingsLoading } = useBookingsSync();

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-900 pb-10">
            <HeroSection />
            <AboutSection />
            <CalendarSection bookings={bookings} />
        </div>
    );
}