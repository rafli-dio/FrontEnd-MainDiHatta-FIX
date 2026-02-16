'use client';

import { useState } from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { useNotifications } from '@/hooks/pelanggan/useNotifications'; 
import NotificationItem from '@/components/pelanggan/notifications/NotificationItem'; 
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';

export default function NotificationDropdown() {
    const { user } = useAuth();
    const { notifications, loading, markAsRead, markAllRead, deleteOne, deleteAll } = useNotifications(user?.id);
    const [isOpen, setIsOpen] = useState(false);

    // Hitung notifikasi yang belum dibaca
    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-[#D93F21] hover:bg-orange-50 rounded-full w-10 h-10">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white animate-pulse"></span>
                    )}
                </Button>
            </PopoverTrigger>
            
            <PopoverContent className="w-[380px] p-0 mr-4 shadow-xl border-gray-100" align="end">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-lg">
                    <div>
                        <h4 className="font-bold text-gray-900">Notifikasi</h4>
                        <p className="text-xs text-gray-500">Anda memiliki {unreadCount} pesan baru</p>
                    </div>
                    
                    {notifications.length > 0 && (
                        <div className="flex gap-1">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                title="Tandai semua dibaca"
                                onClick={() => markAllRead()}
                                className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                            >
                                <CheckCheck className="w-4 h-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                title="Hapus semua"
                                onClick={() => deleteAll()}
                                className="h-8 w-8 text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>

                <ScrollArea className="h-[400px]">
                    <div className="flex flex-col p-2 gap-2">
                        {loading ? (
                            <div className="text-center py-10 text-gray-400 text-sm">Memuat notifikasi...</div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="bg-gray-50 p-4 rounded-full mb-3">
                                    <Bell className="w-6 h-6 text-gray-300" />
                                </div>
                                <p className="text-gray-500 font-medium text-sm">Belum ada notifikasi</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <NotificationItem 
                                    key={notif.id} 
                                    notification={notif} 
                                    onRead={(id, isRead) => markAsRead(id, isRead)}
                                    onDelete={(id) => deleteOne(id)}
                                />
                            ))
                        )}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}