import { ArrowLeft, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationHeaderProps {
    onBack: () => void;
    onMarkAllRead: () => void;
    onDeleteAll: () => void;
    hasNotifications: boolean;
}

export default function NotificationHeader({ onBack, onMarkAllRead, onDeleteAll, hasNotifications }: NotificationHeaderProps) {
    return (
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10 px-4 py-4 shadow-sm">
            <div className="max-w-2xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-600 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-xl font-bold text-gray-900">Notifikasi</h1>
                </div>
                
                <div className="flex items-center gap-2 self-end md:self-auto">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={onMarkAllRead}
                        disabled={!hasNotifications}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs md:text-sm"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Tandai Baca
                    </Button>
                    
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={onDeleteAll}
                        disabled={!hasNotifications}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs md:text-sm"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus Semua
                    </Button>
                </div>
            </div>
        </div>
    );
}