import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { Toaster } from '@/components/ui/sonner';

export const metadata = { title: 'Admin - MainDiHatta.id' };

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            

            <Sidebar />

            <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
          
                <Header />

                <main className="flex-1 p-6 md:p-8 mt-16 overflow-y-auto">
                    {children}
                </main>
                
            </div>

            <Toaster />
        </div>
    );
}