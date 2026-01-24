import { Bell } from 'lucide-react';

export function NotificationLoading() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
            ))}
        </div>
    );
}

export function NotificationEmpty() {
    return (
        <div className="text-center py-20">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Belum ada notifikasi</h3>
            <p className="text-gray-500">Semua aktivitas pesanan Anda akan muncul di sini.</p>
        </div>
    );
}