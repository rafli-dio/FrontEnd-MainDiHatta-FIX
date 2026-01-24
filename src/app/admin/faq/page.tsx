'use client';

import { useEffect, useState } from 'react';
import { useAdminFAQ } from '@/hooks/admin/useAdminFAQ';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import FAQFormDialog from '@/components/admin/faq/FAQFormDialog';
import FAQTable from '@/components/admin/faq/FAQTable';
import { FAQ } from '@/types';
import { sweetAlert } from '@/lib/sweetAlert';

export default function AdminFAQPage() {
    const { faqs, loading, fetchFAQs, createFAQ, updateFAQ, deleteFAQ, toggleFAQStatus } = useAdminFAQ();
    
    const [formOpen, setFormOpen] = useState(false);
    const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    useEffect(() => {
        fetchFAQs();
    }, []);

    // --- PERBAIKAN DI SINI ---
    // Menggunakan (faqs || []) untuk mencegah crash jika faqs bernilai null/undefined
    const filteredFAQs = (faqs || []).filter(faq =>
        faq?.pertanyaan?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAdd = () => {
        setSelectedFAQ(null);
        setFormOpen(true);
    };

    const handleEdit = (faq: FAQ) => {
        setSelectedFAQ(faq);
        setFormOpen(true);
    };

    const handleDelete = async (faq: FAQ) => {
        const result = await sweetAlert.confirmDelete(
            'Hapus FAQ?',
            `Apakah Anda yakin ingin menghapus FAQ:\n"${faq.pertanyaan}"?`
        );
        if (!result.isConfirmed) return;
        
        try {
            await deleteFAQ(faq.id);
        } catch (error) {
            // Error sudah ditangani oleh hook
        }
    };

    const handleFormSubmit = async (data: { pertanyaan: string; jawaban: string; is_aktif: boolean }) => {
        setIsSubmitting(true);
        try {
            if (selectedFAQ?.id) {
                await updateFAQ(selectedFAQ.id, data);
            } else {
                await createFAQ(data);
            }
            setFormOpen(false);
            setSelectedFAQ(null);
        } catch (error) {
            // Error sudah ditangani oleh hook
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleStatus = async (faq: FAQ) => {
        setTogglingId(faq.id);
        try {
            await toggleFAQStatus(faq.id, faq.is_aktif);
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Manajemen FAQ</h1>
                <p className="text-gray-600 text-sm mt-1">Kelola pertanyaan yang sering diajukan pelanggan</p>
            </div>

            {/* Filter & Add Button */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Cari FAQ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button
                    onClick={handleAdd}
                    className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah FAQ
                </Button>
            </div>

            {/* FAQ Table */}
            <FAQTable
                faqs={filteredFAQs}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                togglingId={togglingId}
            />

            {/* Dialogs */}
            <FAQFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                faq={selectedFAQ}
                onSubmit={handleFormSubmit}
                isLoading={isSubmitting}
            />
        </div>
    );
}