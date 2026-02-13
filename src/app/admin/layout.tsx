import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { Toaster } from '@/components/ui/sonner';
import { AdminProvider } from '@/components/admin/AdminContext';

export const metadata = { title: 'Admin - MainDiHatta.id' };

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminProvider>
            <div className="min-h-screen bg-gray-50">
                <div className="print:hidden">
                    <Sidebar />
                </div>
                <div className="print:hidden">
                    <Header />
                </div>
                <div className="pt-16 md:pl-64 min-h-screen flex flex-col transition-all duration-300 print:pl-0 print:pt-0">
                    <main className="flex-1 p-4 md:p-8 overflow-x-hidden print:p-0">
                        {children}
                    </main>
                </div>
                <Toaster />
            </div>
        </AdminProvider>
    );
}