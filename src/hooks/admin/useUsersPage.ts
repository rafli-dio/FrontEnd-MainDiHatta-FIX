'use client';

import { useState, useEffect } from 'react';
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

    // 1. Fetch Data (Users & Roles)
    const fetchData = async () => {
        setLoading(true);
        try {
            const [resUsers, resRoles] = await Promise.all([
                axios.get('/api/users'),
                axios.get('/api/roles')
            ]);
            setUsers(resUsers.data?.data || resUsers.data);
            setRoles(resRoles.data?.data || resRoles.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Gagal memuat data user.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Filter Logic
    const filteredUsers = users.filter((item) => {
        const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchRole = filterRole === 'all' || item.role_id.toString() === filterRole;
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