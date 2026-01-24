'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import Custom Hook
import { usePaymentMethodPage } from '@/hooks/admin/usePaymentMethodPage';

// Import Komponen UI
import PaymentMethodTable from '@/components/admin/payment-method/PaymentMethodTable';
import PaymentMethodFormDialog from '@/components/admin/payment-method/PaymentMethodFormDialog';

export default function PaymentMethodPage() {
    const {
        methods,
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
    } = usePaymentMethodPage();

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Metode Pembayaran</h1>
                    <p className="text-gray-500 text-sm">Kelola metode pembayaran yang tersedia untuk booking.</p>
                </div>
                <Button 
                    className="bg-[#D93F21] hover:bg-[#b9351b] shadow-sm" 
                    onClick={handleCreate}
                >
                    <Plus className="w-4 h-4 mr-2" /> Tambah Metode
                </Button>
            </div>

            {/* Table */}
            <PaymentMethodTable 
                loading={loading}
                methods={methods}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Dialog Form */}
            <PaymentMethodFormDialog
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
