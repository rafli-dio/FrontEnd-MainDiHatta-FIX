'use client';

import { useState, useCallback } from 'react';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { FAQ } from '@/types';

interface CreateFAQInput {
    pertanyaan: string;
    jawaban: string;
    urutan?: number;
    is_aktif: boolean;
}

interface UpdateFAQInput extends CreateFAQInput {
    id: number;
}

export function useAdminFAQ() {
    // Pastikan state awal selalu Array kosong []
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Fetch semua FAQ (Anti-Crash)
    const fetchFAQs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/faq');
            
            // --- VALIDASI KETAT ---
            const rawData = response.data;
            let safeData: FAQ[] = [];

            if (Array.isArray(rawData)) {
                safeData = rawData;
            } else if (rawData?.data && Array.isArray(rawData.data)) {
                // Handle format { data: [...] } (Pagination Laravel)
                safeData = rawData.data;
            } else {
                // Jika format tidak dikenali, biarkan array kosong agar tidak crash
                console.warn("Format data FAQ tidak valid (Bukan Array):", rawData);
                safeData = [];
            }

            setFaqs(safeData);

        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Gagal memuat FAQ';
            setError(errorMsg);
            toast.error(errorMsg);
            setFaqs([]); // Reset ke array kosong jika error
        } finally {
            setLoading(false);
        }
    }, []);

    // 2. Buat FAQ baru
    const createFAQ = useCallback(async (input: CreateFAQInput) => {
        try {
            const response = await axios.post('/api/faq', input);
            const newFAQ = response.data?.data || response.data;
            
            // Gunakan (prev || []) untuk safety
            setFaqs(prev => [...(prev || []), newFAQ]);
            
            toast.success('FAQ berhasil ditambahkan');
            return newFAQ;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Gagal menambahkan FAQ';
            toast.error(errorMsg);
            throw err;
        }
    }, []);

    // 3. Update FAQ
    const updateFAQ = useCallback(async (id: number, input: CreateFAQInput) => {
        try {
            const response = await axios.put(`/api/faq/${id}`, input);
            const updatedFAQ = response.data?.data || response.data;
            
            // Gunakan (prev || []) untuk safety saat mapping
            setFaqs(prev => (prev || []).map(faq => faq.id === id ? updatedFAQ : faq));
            
            toast.success('FAQ berhasil diperbarui');
            return updatedFAQ;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Gagal memperbarui FAQ';
            toast.error(errorMsg);
            throw err;
        }
    }, []);

    // 4. Delete FAQ
    const deleteFAQ = useCallback(async (id: number) => {
        try {
            await axios.delete(`/api/faq/${id}`);
            
            // Gunakan (prev || []) untuk safety saat filter
            setFaqs(prev => (prev || []).filter(faq => faq.id !== id));
            
            toast.success('FAQ berhasil dihapus');
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Gagal menghapus FAQ';
            toast.error(errorMsg);
            throw err;
        }
    }, []);

    // 5. Update urutan FAQ
    const reorderFAQs = useCallback(async (faqsOrder: Array<{ id: number; urutan: number }>) => {
        try {
            await axios.post('/api/faq/reorder', { faqs: faqsOrder });
            
            setFaqs(prev => (prev || []).map(faq => {
                const order = faqsOrder.find(f => f.id === faq.id);
                return order ? { ...faq, urutan: order.urutan } : faq;
            }).sort((a, b) => (a.urutan || 0) - (b.urutan || 0)));
            
            toast.success('Urutan FAQ berhasil diperbarui');
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Gagal mengubah urutan FAQ';
            toast.error(errorMsg);
            throw err;
        }
    }, []);

    // 6. Toggle aktif/nonaktif
    const toggleFAQStatus = useCallback(async (id: number, isAktif: boolean) => {
        try {
            const response = await axios.patch(`/api/faq/${id}/toggle`, { is_aktif: !isAktif });
            const updatedFAQ = response.data?.data || response.data;
            
            setFaqs(prev => (prev || []).map(faq => faq.id === id ? updatedFAQ : faq));
            
            toast.success(`FAQ ${!isAktif ? 'diaktifkan' : 'dinonaktifkan'}`);
            return updatedFAQ;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Gagal mengubah status FAQ';
            toast.error(errorMsg);
            throw err;
        }
    }, []);

    return {
        faqs,
        loading,
        error,
        fetchFAQs,
        createFAQ,
        updateFAQ,
        deleteFAQ,
        reorderFAQs,
        toggleFAQStatus
    };
}