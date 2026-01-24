'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import Custom Hook
import { useStatusBookingPage } from '@/hooks/admin/useStatusBookingPage';

// Import Komponen UI
import SimpleStatusBookingTable from '@/components/admin/status-booking/SimpleStatusBookingTable';
import StatusBookingFormDialog from '@/components/admin/status-booking/StatusBookingFormDialog';

export default function StatusBookingPage() {
    const {
        statuses,
        loading,
        
        // State Modal
        isDialogOpen,
        setIsDialogOpen,
        editData,
        formData,
        setFormData,
        
        // Handlers
        handleCreate,
        handleEdit,
        handleDelete,
        handleSubmit
    } = useStatusBookingPage();

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Status Booking</h1>
                    <p className="text-gray-500 text-sm">Kelola status yang digunakan pada sistem booking.</p>
                </div>
                <Button 
                    className="bg-[#D93F21] hover:bg-[#b9351b] shadow-sm" 
                    onClick={handleCreate}
                >
                    <Plus className="w-4 h-4 mr-2" /> Tambah Status
                </Button>
            </div>

            {/* Table */}
            <SimpleStatusBookingTable 
                loading={loading}
                statuses={statuses}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Dialog Form */}
            <StatusBookingFormDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                editData={editData}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
