import SidebarKaryawan from '@/components/karyawan/SidebarKaryawan';
import HeaderKaryawan from '@/components/karyawan/HeaderKaryawan';
import { Toaster } from '@/components/ui/sonner';

export const metadata = { title: 'Karyawan - MainDiHatta.id' };

export default function KaryawanLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            
            {/* Sidebar Khusus Kasir */}
            <SidebarKaryawan />

            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                
                {/* Header Khusus Kasir */}
                <HeaderKaryawan />

                {/* Area Konten Utama */}
                {/* Background abu-abu muda agar mata tidak cepat lelah */}
                <main className="flex-1 p-4 md:p-6 mt-16 overflow-y-auto bg-[#F3F4F6]">
                    {children}
                </main>
            </div>

            {/* Notifikasi */}
            <Toaster position="top-right" />
        </div>
    );
}