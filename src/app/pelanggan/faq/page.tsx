'use client';

import { useCustomerFAQ } from '@/hooks/pelanggan/useCustomerFAQ';
import FAQSearch from '@/components/pelanggan/faq/FAQSearch';
import FAQAccordion from '@/components/pelanggan/faq/FAQAccordion';
import FAQLoading from '@/components/pelanggan/faq/FAQLoading';
import { HelpCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function CustomerFAQPage() {
    const { faqs, loading, searchQuery, setSearchQuery } = useCustomerFAQ();
    const phoneNumber = "6282135449277";
    const defaultMessage = "Halo Admin Hatta Sport, saya sudah membaca FAQ tapi masih ada yang ingin saya tanyakan. Mohon bantuannya.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            
            <div className="bg-white border-b border-gray-100 pt-24 pb-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>
                
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-6 text-[#D93F21]">
                        <HelpCircle className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">
                        Pertanyaan yang <span className="text-[#D93F21]">Sering Diajukan</span>
                    </h1>
                    <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Temukan jawaban cepat seputar booking lapangan, pembayaran, dan fasilitas di Hatta Sport.
                    </p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-8 relative z-20">
                <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-100">
                    <FAQSearch
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                    />
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-16">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <FAQLoading />
                    </div>
                ) : faqs.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                             <HelpCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Tidak ditemukan</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">
                            {searchQuery
                                ? `Tidak ada hasil untuk "${searchQuery}".`
                                : 'Belum ada data FAQ yang tersedia saat ini.'}
                        </p>
                    </div>
                ) : (
                    /* FAQ List */
                    <div className="space-y-8">
                         <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                Daftar Pertanyaan
                            </h2>
                            <span className="text-xs font-semibold px-3 py-1 bg-[#D93F21]/10 text-[#D93F21] rounded-full">
                                {faqs.length} Artikel
                            </span>
                        </div>
                        
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <FAQAccordion faqs={faqs} />
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white border-t border-gray-200 py-16 mt-8">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 text-gray-700 rounded-full mb-6">
                        <MessageCircle className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Masih butuh bantuan?</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Jika pertanyaan Anda tidak ada di atas, tim support kami siap membantu Anda via WhatsApp.
                    </p>
                    
                    <Link
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-white bg-[#D93F21] hover:bg-[#b9351b] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Hubungi Kami
                    </Link>
                </div>
            </div>
        </div>
    );
}