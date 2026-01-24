'use client';

import { Loader2, HelpCircle } from 'lucide-react';

export default function FAQLoading() {
    return (
        <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-gray-600">Memuat Pertanyaan yang Sering Diajukan...</span>
            </div>
        </div>
    );
}
