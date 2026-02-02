// app/karyawan/layout.tsx
import SidebarKaryawan from '@/components/karyawan/SidebarKaryawan';
import HeaderKaryawan from '@/components/karyawan/HeaderKaryawan';
import { Toaster } from '@/components/ui/sonner';
import { KaryawanProvider } from '@/components/karyawan/KaryawanContext'; // Import Provider

export const metadata = { title: 'Karyawan - MainDiHatta.id' };

export default function KaryawanLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <KaryawanProvider>
            <div className="min-h-screen bg-gray-100">
                
                {/* Sidebar Fixed */}
                <SidebarKaryawan />

                {/* Konten Utama (didorong ke kanan di desktop) */}
                <div className="min-h-screen flex flex-col md:pl-64 transition-all duration-300">
                    
                    {/* Header Fixed */}
                    <HeaderKaryawan />

                    {/* Main Content Area */}
                    <main className="flex-1 p-4 md:p-6 mt-16 overflow-y-auto bg-[#F3F4F6]">
                        {children}
                    </main>
                </div>

                <Toaster position="top-right" />
            </div>
        </KaryawanProvider>
    );
}