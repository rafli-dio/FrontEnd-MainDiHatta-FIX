'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { PaymentMethod } from '@/types';
import { sweetAlert } from '@/lib/sweetAlert';

export function usePaymentMethodPage() {
    // State
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editData, setEditData] = useState<PaymentMethod | null>(null);
    const [formData, setFormData] = useState({
        nama_metode: '',
        keterangan: '',
        is_aktif: true,
    });

    // 1. Fetch Data
    const fetchMethods = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/paymentMethods');
            setMethods(response.data?.data || response.data);
        } catch (error) {
            console.error(error);
            toast.error('Gagal memuat data metode pembayaran.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMethods();
    }, []);

    // 2. Handlers
    const handleCreate = () => {
        setEditData(null);
        setFormData({
            nama_metode: '',
            keterangan: '',
            is_aktif: true,
        });
        setIsDialogOpen(true);
    };

    const handleEdit = (item: PaymentMethod) => {
        setEditData(item);
        setFormData({
            nama_metode: item.nama_metode,
            keterangan: item.keterangan || '',
            is_aktif: item.is_aktif,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await sweetAlert.confirmDelete(
            'Hapus Metode Pembayaran?',
            'Apakah Anda yakin ingin menghapus metode pembayaran ini?'
        );
        if (!result.isConfirmed) return;
        
        try {
            await axios.delete(`/api/paymentMethods/${id}`);
            toast.success('Metode pembayaran berhasil dihapus.');
            fetchMethods();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                    'Gagal menghapus (Mungkin sedang digunakan).'
            );
        }
    };

    const handleSubmit = async () => {
        if (!formData.nama_metode.trim()) {
            toast.error('Nama metode tidak boleh kosong!');
            return;
        }

        try {
            if (editData) {
                await axios.put(`/api/paymentMethods/${editData.id}`, formData);
                toast.success('Metode pembayaran berhasil diperbarui!');
            } else {
                await axios.post('/api/paymentMethods', formData);
                toast.success('Metode pembayaran berhasil ditambahkan!');
            }
            setIsDialogOpen(false);
            fetchMethods();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Gagal menyimpan.');
        }
    };

    return {
        methods,
        loading,
        isDialogOpen,
        setIsDialogOpen,
        editData,
        formData,
        setFormData,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSubmit,
    };
}
