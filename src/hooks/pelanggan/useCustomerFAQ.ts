'use client';

import { useState, useCallback, useEffect } from 'react';
import axios from '@/lib/axios';
import { FAQ } from '@/types';

export function useCustomerFAQ() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchFAQs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/faq');
            const activeFAQs = (response.data?.data || response.data || []).filter((faq: FAQ) => faq.is_aktif);
            const sorted = activeFAQs.sort((a: FAQ, b: FAQ) => (a.urutan || 0) - (b.urutan || 0));
            setFaqs(sorted);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            setFaqs([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFAQs();
    }, [fetchFAQs]);

    const filteredFAQs = faqs.filter(faq =>
        faq.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.jawaban.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
        faqs: filteredFAQs,
        allFAQs: faqs,
        loading,
        searchQuery,
        setSearchQuery,
        refetch: fetchFAQs
    };
}
