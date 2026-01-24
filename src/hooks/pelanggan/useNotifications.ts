'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from '@/lib/axios'; // Gunakan axios wrapper project
import { toast } from 'sonner';   // Tambahkan toast untuk feedback user

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
    // Pastikan inisialisasi selalu Array kosong
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Data (Defensive)
    const fetchNotifications = useCallback(async () => {
        if (!userId) {
            setNotifications([]); // Bersihkan data jika tidak ada user
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            // Tidak perlu manual baseURL jika pakai @/lib/axios
            const response = await axios.get('/notifications', {
                params: { user_id: userId }
            });

            // --- VALIDASI ARRAY (Anti-Crash) ---
            const rawData = response.data?.data || response.data;
            
            if (Array.isArray(rawData)) {
                setNotifications(rawData);
            } else if (rawData?.notifications && Array.isArray(rawData.notifications)) {
                // Handle jika format { data: { notifications: [...] } }
                setNotifications(rawData.notifications);
            } else {
                console.warn("Format notifikasi tidak valid:", rawData);
                setNotifications([]); // Fallback ke array kosong
            }

        } catch (error) {
            console.error("Gagal ambil notif", error);
            // Jangan toast error di sini agar tidak spamming jika interval jalan
            setNotifications([]); 
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchNotifications();
        // Opsional: Polling setiap 1 menit agar notif real-time
        // const interval = setInterval(fetchNotifications, 60000);
        // return () => clearInterval(interval);
    }, [fetchNotifications]);

    // 2. Mark One as Read
    const markAsRead = async (notifId: string, isRead: boolean) => {
        if (isRead) return;

        // Optimistic Update (Defensive State Update)
        setNotifications(prev => (prev || []).map(n => 
            n.id === notifId ? { ...n, is_read: true } : n
        ));

        try {
            await axios.post(`/notifications/${notifId}/read`, {}, {
                params: { user_id: userId }
            });
        } catch (error) {
            console.error("Gagal update status read", error);
            // Revert jika gagal (Opsional, tapi bagus untuk UX)
            fetchNotifications(); 
        }
    };

    // 3. Mark All Read
    const markAllRead = async () => {
        // Optimistic Update
        setNotifications(prev => (prev || []).map(n => ({ ...n, is_read: true })));
        
        try {
            await axios.post('/notifications/read-all', {}, {
                params: { user_id: userId }
            });
            toast.success("Semua notifikasi ditandai sudah dibaca");
        } catch (error) {
            console.error("Gagal mark all", error);
            fetchNotifications(); // Revert
        }
    };

    // 4. Delete One
    const deleteOne = async (notifId: string) => {
        // Optimistic Update
        setNotifications(prev => (prev || []).filter(n => n.id !== notifId));
        
        try {
            await axios.delete(`/notifications/${notifId}`, {
                params: { user_id: userId }
            });
        } catch (error) {
            console.error("Gagal hapus notifikasi", error);
            toast.error("Gagal menghapus notifikasi");
            fetchNotifications(); // Revert
        }
    };

    // 5. Delete All
    const deleteAll = async () => {
        if (!confirm("Apakah Anda yakin ingin menghapus SEMUA notifikasi?")) return;
        
        const backup = [...notifications]; // Simpan backup
        setNotifications([]); // Kosongkan UI dulu
        
        try {
            await axios.delete('/notifications', {
                params: { user_id: userId }
            });
            toast.success("Semua notifikasi dihapus");
        } catch (error) {
            console.error("Gagal hapus semua", error);
            toast.error("Gagal menghapus notifikasi");
            setNotifications(backup); // Kembalikan jika gagal
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