'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 1. Import Custom Hook
import { useUsersPage } from '@/hooks/admin/useUsersPage';

// 2. Import Komponen UI
import UserFilters from '@/components/admin/users/UserFilters';
import UserTable from '@/components/admin/users/UserTable';
import UserFormDialog from '@/components/admin/users/UserFormDialog';

export default function UsersPage() {
    // 3. Panggil Logika dari Hook
    const {
        // Data
        users,
        roles,
        loading,
        
        // Filter & Search
        searchQuery,
        setSearchQuery,
        filterRole,
        setFilterRole,
        
        // Modal State
        isDialogOpen,
        setIsDialogOpen,
        editData,
        
        // Actions
        handleCreate,
        handleEdit,
        handleDelete,
        handleSubmit
    } = useUsersPage();

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
                    <p className="text-gray-500 text-sm">Kelola akun Admin, Karyawan, dan Pelanggan.</p>
                </div>
                
                <Button 
                    className="bg-[#D93F21] hover:bg-[#b9351b] shadow-sm" 
                    onClick={handleCreate}
                >
                    <Plus className="w-4 h-4 mr-2" /> Tambah User
                </Button>
            </div>

            {/* Filter Bar */}
            <UserFilters 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterRole={filterRole}
                setFilterRole={setFilterRole}
                roles={roles}
            />

            {/* Tabel User */}
            <UserTable 
                loading={loading}
                users={users}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Modal Form Tambah/Edit */}
            <UserFormDialog 
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleSubmit}
                initialData={editData}
                roles={roles}
            />
        </div>
    );
}