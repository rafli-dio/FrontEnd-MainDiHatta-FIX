'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/pelanggan/useNotifications';

// Import Components
import NotificationHeader from '@/components/pelanggan/notifications/NotificationHeader';
import NotificationItem from '@/components/pelanggan/notifications/NotificationItem';
import { NotificationLoading, NotificationEmpty } from '@/components/pelanggan/notifications/NotificationStates';

export default function NotificationPage() {
    const { user } = useAuth();
    const router = useRouter();
    
    // Panggil Logic dari Custom Hook
    const { 
        notifications, 
        loading, 
        markAsRead, 
        markAllRead, 
        deleteOne, 
        deleteAll 
    } = useNotifications(user?.id);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* 1. Header Component */}
            <NotificationHeader 
                onBack={() => router.back()}
                onMarkAllRead={markAllRead}
                onDeleteAll={deleteAll}
                hasNotifications={notifications.length > 0}
            />

            {/* 2. Content List */}
            <div className="max-w-2xl mx-auto px-4 mt-6">
                {loading ? (
                    <NotificationLoading />
                ) : notifications.length === 0 ? (
                    <NotificationEmpty />
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notif) => (
                            <NotificationItem 
                                key={notif.id}
                                notification={notif}
                                onRead={markAsRead}
                                onDelete={deleteOne}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}