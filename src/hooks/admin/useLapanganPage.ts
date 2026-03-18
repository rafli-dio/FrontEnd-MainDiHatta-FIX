'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { Lapangan } from '@/types';
import { sweetAlert } from '@/lib/sweetAlert';

export function useLapanganPage() {
    // State Lapangan
    const [lapangans, setLapangans] = useState<Lapangan[]>([]);
    const [loading, setLoading] = useState(true);
    
    // State Modal Lapangan (CRUD)
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editData, setEditData] = useState<Lapangan | null>(null);

    // --- NEW: State Modal Maintenance ---
    const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
    const [selectedLapanganId, setSelectedLapanganId] = useState<number | null>(null);

    // 1. Fetch Data
    const fetchLapangans = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/lapangans');
            setLapangans(response.data?.data || response.data);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data lapangan.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLapangans();
    }, []);

    // 2. Handlers CRUD Lapangan
    const handleCreate = () => {
        setEditData(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (item: Lapangan) => {
        setEditData(item);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await sweetAlert.confirmDelete(
            'Hapus Lapangan?',
            'Apakah Anda yakin ingin menghapus lapangan ini? Data booking terkait mungkin akan error.'
        );
        if(!result.isConfirmed) return;
        
        try {
            await axios.delete(`/api/lapangans/${id}`);
            toast.success("Lapangan berhasil dihapus.");
            fetchLapangans();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal menghapus.");
        }
    };

    const handleSubmit = async (formData: any, isEdit: boolean) => {
        try {
            if (isEdit && editData) {
                await axios.put(`/api/lapangans/${editData.id}`, formData);
                
                if (formData.foto) {
                    const imgData = new FormData();
                    imgData.append('foto', formData.foto);
                    await axios.post(`/api/lapangans/${editData.id}/foto`, imgData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                }
                toast.success("Lapangan diperbarui!");
            } else {
                const data = new FormData();
                Object.keys(formData).forEach(key => {
                    if (key === 'status_aktif') {
                        data.append(key, formData[key] ? '1' : '0');
                    } else if (formData[key] !== null && formData[key] !== undefined) {
                        data.append(key, formData[key]);
                    }
                });
                
                await axios.post('/api/lapangans', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                toast.success("Lapangan ditambahkan!");
            }
            setIsDialogOpen(false);
            fetchLapangans();
        } catch (error: any) {
            console.error(error);
            
            // Extract validation errors from Laravel if present
            let errorMessage = "Gagal menyimpan.";
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                // Get the first error message from the object
                const firstErrorKey = Object.keys(errors)[0];
                errorMessage = errors[firstErrorKey][0];
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            toast.error(errorMessage);
        }
    };

    // --- NEW: Handler Maintenance ---
    const handleManageMaintenance = (id: number) => {
        setSelectedLapanganId(id);
        setIsMaintenanceDialogOpen(true);
    };

    return {
        lapangans,
        loading,
        isDialogOpen,
        setIsDialogOpen,
        editData,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSubmit,
        isMaintenanceDialogOpen,
        setIsMaintenanceDialogOpen,
        selectedLapanganId,
        handleManageMaintenance
    };
}