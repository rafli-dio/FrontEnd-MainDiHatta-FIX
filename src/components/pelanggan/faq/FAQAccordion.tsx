'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FAQ } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQAccordionProps {
    faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    if (faqs.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Tidak ada FAQ yang sesuai dengan pencarian Anda</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {faqs.map((faq) => (
                <Card
                    key={faq.id}
                    className="overflow-hidden hover:shadow-md transition cursor-pointer"
                >
                    <button
                        onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                        className="w-full px-6 py-4 flex items-start justify-between gap-4 text-left hover:bg-gray-50 transition"
                    >
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-base line-clamp-2">
                                {faq.pertanyaan}
                            </h3>
                        </div>
                        <div className="flex-shrink-0 text-blue-600">
                            {expandedId === faq.id ? (
                                <ChevronUp className="w-5 h-5" />
                            ) : (
                                <ChevronDown className="w-5 h-5" />
                            )}
                        </div>
                    </button>

                    {expandedId === faq.id && (
                        <CardContent className="px-6 py-4 bg-gray-50 border-t">
                            <div className="prose prose-sm max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {faq.jawaban}
                                </p>
                            </div>
                        </CardContent>
                    )}
                </Card>
            ))}
        </div>
    );
}
