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
            
            // 1. Validasi Array (Defensive)
            const rawData = response.data?.data || response.data;
            const safeData = Array.isArray(rawData) ? rawData : [];

            // 2. Filter Aktif & Sort (Safe Access)
            const activeAndSorted = safeData
                .filter((faq: any) => faq && faq.is_aktif) // Pastikan faq tidak null
                .sort((a: any, b: any) => (a.urutan || 0) - (b.urutan || 0));

            setFaqs(activeAndSorted);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            setFaqs([]); // Reset ke array kosong jika error
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFAQs();
    }, [fetchFAQs]);

    // 3. Logic Filter Search (Defensive String)
    // Pastikan faqs array
    const safeFaqs = Array.isArray(faqs) ? faqs : [];

    const filteredFAQs = safeFaqs.filter(faq => {
        // Safety check: jika item faq null
        if (!faq) return false;

        const query = searchQuery.toLowerCase();
        
        // Gunakan (str || '') untuk mencegah crash jika data di DB null
        const question = (faq.pertanyaan || '').toLowerCase();
        const answer = (faq.jawaban || '').toLowerCase();

        return question.includes(query) || answer.includes(query);
    });

    return {
        faqs: filteredFAQs,
        allFAQs: safeFaqs, // Gunakan safeFaqs
        loading,
        searchQuery,
        setSearchQuery,
        refetch: fetchFAQs
    };
}