// PERUBAHAN: Import dari folder lokal 'homepage' di dalam 'app/pelanggan'
import Footer from '@/components/pelanggan/Footer';
import Navbar from '@/components/pelanggan/Navbar';

import { Toaster } from '@/components/ui/sonner';

export const metadata = { title: 'Pelanggan - MainDiHatta.id' };

export default function PelangganLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-900">
            <Navbar />
            <main className="pb-10">
                {children}
            </main>
            <Footer />
            <Toaster />
        </div>
    );
}