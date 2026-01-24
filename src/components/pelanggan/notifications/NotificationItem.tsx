import { Bell, Clock, Trash2 } from 'lucide-react';
import { Notification } from '@/hooks/pelanggan/useNotifications';

interface NotificationItemProps {
    notification: Notification;
    onRead: (id: string, isRead: boolean) => void;
    onDelete: (id: string) => void;
}

export default function NotificationItem({ notification, onRead, onDelete }: NotificationItemProps) {
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(notification.id);
    };

    return (
        <div 
            onClick={() => onRead(notification.id, notification.is_read)}
            className={`
                group relative p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md
                ${notification.is_read 
                    ? 'bg-white border-gray-200' 
                    : 'bg-orange-50 border-orange-100 shadow-sm'
                }
            `}
        >
            <div className="flex gap-4 items-start">
                <div className={`
                    mt-1 min-w-[40px] h-10 rounded-full flex items-center justify-center
                    ${notification.is_read ? 'bg-gray-100 text-gray-500' : 'bg-[#D93F21]/10 text-[#D93F21]'}
                `}>
                    <Bell className="w-5 h-5" />
                </div>

                <div className="flex-1 pr-8">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-base ${notification.is_read ? 'font-semibold text-gray-700' : 'font-bold text-gray-900'}`}>
                            {notification.title}
                        </h4>
                        {!notification.is_read && (
                            <span className="w-2.5 h-2.5 bg-[#D93F21] rounded-full mt-1.5 animate-pulse"></span>
                        )}
                    </div>
                    
                    <p className="text-sm text-gray-600 leading-relaxed mb-2">
                        {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{notification.created_at}</span>
                    </div>
                </div>

                <button 
                    onClick={handleDeleteClick}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Hapus notifikasi ini"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}