'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { User, Role } from '@/types';
import { sweetAlert } from '@/lib/sweetAlert';

export function useUsersPage() {
    // State Data
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');

    // Modal State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editData, setEditData] = useState<User | null>(null);

    // 1. Fetch Data (Defensive)
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [resUsers, resRoles] = await Promise.all([
                axios.get('/api/users'),
                axios.get('/api/roles')
            ]);

            // --- Helper Safe Array ---
            const getSafeArray = (res: any) => {
                const data = res.data?.data || res.data;
                return Array.isArray(data) ? data : [];
            };

            setUsers(getSafeArray(resUsers));
            setRoles(getSafeArray(resRoles));

        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Gagal memuat data user.");
            // Reset ke array kosong agar tidak crash
            setUsers([]);
            setRoles([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 2. Filter Logic (Safe Filtering)
    // Pastikan users selalu array
    const safeUsers = Array.isArray(users) ? users : [];

    const filteredUsers = safeUsers.filter((item) => {
        // Safety check per item
        if (!item) return false;

        const name = item.name?.toLowerCase() || '';
        const email = item.email?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();

        const matchSearch = name.includes(query) || email.includes(query);
        const matchRole = filterRole === 'all' || item.role_id?.toString() === filterRole;
        
        return matchSearch && matchRole;
    });

    // 3. Handlers
    const handleCreate = () => {
        setEditData(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (item: User) => {
        setEditData(item);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await sweetAlert.confirmDelete(
            'Hapus User?',
            'Apakah Anda yakin ingin menghapus user ini?'
        );
        if(!result.isConfirmed) return;
        
        try {
            await axios.delete(`/api/users/${id}`);
            toast.success("User berhasil dihapus.");
            fetchData(); 
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal menghapus.");
        }
    };

    const handleSubmit = async (formData: any, isEdit: boolean) => {
        try {
            if (isEdit && editData) {
                const payload: any = { ...formData };
                if (!payload.password) delete payload.password;
                if (!payload.password_confirmation) delete payload.password_confirmation;

                await axios.put(`/api/users/${editData.id}`, payload);
                toast.success("Data user diperbarui!");
            } else {
                await axios.post('/api/users', formData);
                toast.success("User baru ditambahkan!");
            }
            setIsDialogOpen(false);
            fetchData(); 
        } catch (error: any) {
            const msg = error.response?.data?.message || "Gagal menyimpan data.";
            toast.error(msg);
        }
    };

    return {
        users: filteredUsers, 
        roles,
        loading,
        searchQuery,
        filterRole,
        isDialogOpen,
        editData,
        setSearchQuery,
        setFilterRole,
        setIsDialogOpen,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSubmit
    };
}