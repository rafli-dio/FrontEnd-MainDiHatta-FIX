'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import Custom Hook
import { useLapanganPage } from '@/hooks/admin/useLapanganPage';

// Import Komponen UI
import LapanganGrid from '@/components/admin/lapangan/LapanganGrid';
import LapanganFormDialog from '@/components/admin/lapangan/LapanganFormDialog';

export default function LapanganPage() {
    // Panggil logika dari Custom Hook
    const {
        lapangans,
        loading,
        
        // State Modal
        isDialogOpen,
        setIsDialogOpen,
        editData,
        
        // Handlers
        handleCreate,
        handleEdit,
        handleDelete,
        handleSubmit
    } = useLapanganPage();

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Data Lapangan</h1>
                    <p className="text-gray-500 text-sm">Kelola fasilitas, harga, dan jam operasional.</p>
                </div>
                <Button 
                    className="bg-[#D93F21] hover:bg-[#b9351b] shadow-sm" 
                    onClick={handleCreate}
                >
                    <Plus className="w-4 h-4 mr-2" /> Tambah Lapangan
                </Button>
            </div>

            {/* Grid Tampilan Lapangan */}
            <LapanganGrid 
                loading={loading}
                lapangans={lapangans}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Modal Form Tambah/Edit */}
            <LapanganFormDialog 
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleSubmit}
                initialData={editData}
            />
        </div>
    );
}