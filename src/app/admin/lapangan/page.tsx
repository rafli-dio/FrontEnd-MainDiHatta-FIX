'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useLapanganPage } from '@/hooks/admin/useLapanganPage';

import LapanganGrid from '@/components/admin/lapangan/LapanganGrid';
import LapanganFormDialog from '@/components/admin/lapangan/LapanganFormDialog';
import MaintenanceDialog from '@/components/admin/lapangan/MaintenanceDialog'; // <--- IMPORT

export default function LapanganPage() {
    const {
        lapangans,
        loading,
        
        isDialogOpen,
        setIsDialogOpen,
        editData,
        isMaintenanceDialogOpen,
        setIsMaintenanceDialogOpen,
        selectedLapanganId,

        handleCreate,
        handleEdit,
        handleDelete,
        handleSubmit,
        handleManageMaintenance 
    } = useLapanganPage();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Data Lapangan</h1>
                    <p className="text-gray-500 text-sm">Kelola fasilitas, harga, dan jadwal tutup lapangan.</p>
                </div>
                <Button 
                    className="bg-[#D93F21] hover:bg-[#b9351b] shadow-sm" 
                    onClick={handleCreate}
                >
                    <Plus className="w-4 h-4 mr-2" /> Tambah Lapangan
                </Button>
            </div>

            <LapanganGrid 
                loading={loading}
                lapangans={lapangans}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onManageMaintenance={handleManageMaintenance} // <--- PASS KE GRID
            />

            <LapanganFormDialog 
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleSubmit}
                initialData={editData}
            />

            {/* MODAL MAINTENANCE */}
            {isMaintenanceDialogOpen && (
                <MaintenanceDialog 
                    isOpen={isMaintenanceDialogOpen}
                    onOpenChange={setIsMaintenanceDialogOpen}
                    lapanganId={selectedLapanganId}
                />
            )}
        </div>
    );
}