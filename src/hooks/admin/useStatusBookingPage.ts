'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { StatusBooking } from '@/types';
import { sweetAlert } from '@/lib/sweetAlert';

export function useStatusBookingPage() {
    // State
    const [statuses, setStatuses] = useState<StatusBooking[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editData, setEditData] = useState<StatusBooking | null>(null);
    const [formData, setFormData] = useState({ nama_status: '' });

    // 1. Fetch Data
    const fetchStatuses = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/statusBookings');
            setStatuses(response.data?.data || response.data);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data status booking.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatuses();
    }, []);

    // 2. Handlers
    const handleCreate = () => {
        setEditData(null);
        setFormData({ nama_status: '' });
        setIsDialogOpen(true);
    };

    const handleEdit = (item: StatusBooking) => {
        setEditData(item);
        setFormData({ nama_status: item.nama_status });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await sweetAlert.confirmDelete(
            'Hapus Status Booking?',
            'Apakah Anda yakin ingin menghapus status booking ini?'
        );
        if(!result.isConfirmed) return;
        
        try {
            await axios.delete(`/api/statusBookings/${id}`);
            toast.success("Status booking berhasil dihapus.");
            fetchStatuses();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal menghapus (Mungkin sedang digunakan oleh booking).");
        }
    };

    const handleSubmit = async () => {
        if (!formData.nama_status.trim()) {
            toast.error("Nama status tidak boleh kosong!");
            return;
        }

        try {
            if (editData) {
                await axios.put(`/api/statusBookings/${editData.id}`, formData);
                toast.success("Status booking berhasil diperbarui!");
            } else {
                await axios.post('/api/statusBookings', formData);
                toast.success("Status booking berhasil ditambahkan!");
            }
            setIsDialogOpen(false);
            fetchStatuses();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Gagal menyimpan.");
        }
    };

    return {
        statuses,
        loading,
        isDialogOpen,
        setIsDialogOpen,
        editData,
        formData,
        setFormData,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSubmit
    };
}
