'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from '@/lib/axios';
import { toast } from 'sonner';   

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

    const fetchNotifications = useCallback(async () => {
        if (!userId) {
            setNotifications([]); 
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get('/api/notifications', {
                params: { user_id: userId }
            });

            const rawData = response.data?.data || response.data;
            
            if (Array.isArray(rawData)) {
                setNotifications(rawData);
            } else if (rawData?.notifications && Array.isArray(rawData.notifications)) {
                setNotifications(rawData.notifications);
            } else {
                console.warn("Format notifikasi tidak valid:", rawData);
                setNotifications([]);
            }

        } catch (error) {
            console.error("Gagal ambil notif", error);
            setNotifications([]); 
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAsRead = async (notifId: string, isRead: boolean) => {
        if (isRead) return;

        setNotifications(prev => (prev || []).map(n => 
            n.id === notifId ? { ...n, is_read: true } : n
        ));

        try {
            await axios.post(`/api/notifications/${notifId}/read`, {}, {
                params: { user_id: userId }
            });
        } catch (error) {
            console.error("Gagal update status read", error);
            fetchNotifications(); 
        }
    };

    const markAllRead = async () => {
        setNotifications(prev => (prev || []).map(n => ({ ...n, is_read: true })));
        
        try {
            await axios.post('/notifications/read-all', {}, {
                params: { user_id: userId }
            });
            toast.success("Semua notifikasi ditandai sudah dibaca");
        } catch (error) {
            console.error("Gagal mark all", error);
            fetchNotifications(); 
        }
    };

    const deleteOne = async (notifId: string) => {
        setNotifications(prev => (prev || []).filter(n => n.id !== notifId));
        
        try {
            await axios.delete(`/api/notifications/${notifId}`, {
                params: { user_id: userId }
            });
        } catch (error) {
            console.error("Gagal hapus notifikasi", error);
            toast.error("Gagal menghapus notifikasi");
            fetchNotifications(); 
        }
    };

    const deleteAll = async () => {
        if (!confirm("Apakah Anda yakin ingin menghapus SEMUA notifikasi?")) return;
        
        const backup = [...notifications]; 
        setNotifications([]); 
        
        try {
            await axios.delete('/api/notifications', {
                params: { user_id: userId }
            });
            toast.success("Semua notifikasi dihapus");
        } catch (error) {
            console.error("Gagal hapus semua", error);
            toast.error("Gagal menghapus notifikasi");
            setNotifications(backup); 
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