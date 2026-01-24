import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Notification {
    id: string;
    title: string;
    message: string;
    status: string;
    is_read: boolean;
    created_at: string;
    date_raw: string;
}

export const useNotifications = (userId: number | string | undefined) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Data
    const fetchNotifications = useCallback(async () => {
        if (!userId) return;
        try {
            setLoading(true);
            const response = await axios.get(`${baseURL}/notifications`, {
                params: { user_id: userId },
                headers: { 'Accept': 'application/json' }
            });
            if (response.data.success) {
                setNotifications(response.data.data);
            }
        } catch (error) {
            console.error("Gagal ambil notif", error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // 2. Mark One as Read
    const markAsRead = async (notifId: string, isRead: boolean) => {
        if (isRead) return;

        // Optimistic Update
        setNotifications(prev => prev.map(n => 
            n.id === notifId ? { ...n, is_read: true } : n
        ));

        try {
            await axios.post(`${baseURL}/notifications/${notifId}/read`, {}, {
                params: { user_id: userId },
                headers: { 'Accept': 'application/json' }
            });
        } catch (error) {
            console.error("Gagal update status read", error);
        }
    };

    // 3. Mark All Read
    const markAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        try {
            await axios.post(`${baseURL}/notifications/read-all`, {}, {
                params: { user_id: userId },
                headers: { 'Accept': 'application/json' }
            });
        } catch (error) {
            console.error("Gagal mark all", error);
        }
    };

    // 4. Delete One
    const deleteOne = async (notifId: string) => {
        setNotifications(prev => prev.filter(n => n.id !== notifId));
        try {
            await axios.delete(`${baseURL}/notifications/${notifId}`, {
                params: { user_id: userId },
                headers: { 'Accept': 'application/json' }
            });
        } catch (error) {
            console.error("Gagal hapus notifikasi", error);
        }
    };

    // 5. Delete All
    const deleteAll = async () => {
        if (!confirm("Apakah Anda yakin ingin menghapus SEMUA notifikasi?")) return;
        
        setNotifications([]);
        try {
            await axios.delete(`${baseURL}/notifications`, {
                params: { user_id: userId },
                headers: { 'Accept': 'application/json' }
            });
        } catch (error) {
            console.error("Gagal hapus semua", error);
        }
    };

    return {
        notifications,
        loading,
        markAsRead,
        markAllRead,
        deleteOne,
        deleteAll,
        refetch: fetchNotifications
    };
};