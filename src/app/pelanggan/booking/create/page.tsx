'use client';

import React, { Suspense } from 'react';
import Link from 'next/link'; 
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Custom Hooks & Components
import { useBookingWizard } from '@/hooks/pelanggan/useBookingWizard';
import BookingWizardStepper from '@/components/pelanggan/booking/BookingWizardStepper';
import BookingWizardStep1 from '@/components/pelanggan/booking/BookingWizardStep1';
import BookingWizardStep2 from '@/components/pelanggan/booking/BookingWizardStep2';
import BookingWizardStep3 from '@/components/pelanggan/booking/BookingWizardStep3';

function BookingWizardContent() {
    // 1. Ambil data dari hook, TERMASUK jamOperasional
    const {
        step, isSubmitting, formData, setFormData,
        bookedDates, bookings, paymentMethods, totalHarga,
        jamOperasional, // <--- Data Jam Buka/Tutup dari Database
        getJamSelesai, nextStep, prevStep, handleSubmit
    } = useBookingWizard();

    const updateFormData = (newData: any) => {
        setFormData((prev: any) => ({ ...prev, ...newData }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans pb-20">
            
            {/* --- MOBILE STEPPER (Sticky Top) --- */}
            <div className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 px-4 shadow-sm mb-6">
                <BookingWizardStepper currentStep={step} />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16">
                    
                    {/* --- DESKTOP STEPPER (Sticky Sidebar) --- */}
                    <div className="hidden lg:block lg:w-1/4">
                        <div className="sticky top-24">
                            <BookingWizardStepper currentStep={step} />
                        </div>
                    </div>

                    {/* --- BAGIAN KANAN: FORM --- */}
                    <div className="flex-1 max-w-3xl">
                        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8 mb-8 md:mb-10 transition-all duration-300">
                            
                            {/* Header Judul Step */}
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                <div className="w-1.5 h-10 bg-gradient-to-b from-[#D93F21] to-[#FF6B35] rounded-full"></div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                                        {step === 1 && "Data Diri"}
                                        {step === 2 && "Pilih Jadwal"}
                                        {step === 3 && "Pembayaran"}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {step === 1 && "Lengkapi identitas pemesan."}
                                        {step === 2 && "Cek ketersediaan dan pilih waktu."}
                                        {step === 3 && "Selesaikan transaksi Anda."}
                                    </p>
                                </div>
                            </div>

                            {/* Conditional Step Rendering */}
                            <div className="min-h-[300px]">
                                {step === 1 && (
                                    <BookingWizardStep1 
                                        formData={formData} 
                                        setFormData={updateFormData} 
                                    />
                                )}
                                {step === 2 && (
                                    <BookingWizardStep2 
                                        formData={formData} 
                                        setFormData={updateFormData}
                                        bookedDates={bookedDates}
                                        getJamSelesai={getJamSelesai}
                                        bookings={bookings}
                                        jamOperasional={jamOperasional} // <--- 2. KIRIM PROPS KE STEP 2
                                    />
                                )}
                                {step === 3 && (
                                    <BookingWizardStep3 
                                        formData={formData} 
                                        setFormData={updateFormData}
                                        paymentMethods={paymentMethods}
                                        totalHarga={totalHarga}
                                    />
                                )}
                            </div>

                            {/* --- ACTION BUTTONS --- */}
                            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 mt-10 pt-6 border-t border-gray-100">
                                
                                {/* Tombol Cancel / Kembali */}
                                {step > 1 ? (
                                    <Button 
                                        variant="outline" 
                                        onClick={prevStep}
                                        className="w-full sm:w-auto min-w-[160px] border border-gray-300 text-gray-600 hover:text-[#D93F21] hover:border-[#D93F21] hover:bg-orange-50 rounded-xl h-12 font-semibold transition-all duration-300"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                                    </Button>
                                ) : (
                                    <Link href="/pelanggan/home" className="w-full sm:w-auto">
                                        <Button 
                                            variant="ghost" 
                                            className="w-full sm:w-auto min-w-[160px] text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-12 font-medium"
                                        >
                                            Batal
                                        </Button>
                                    </Link>
                                )}

                                {/* Tombol Next / Submit */}
                                {step < 3 ? (
                                    <Button 
                                        onClick={nextStep}
                                        className="w-full sm:w-auto min-w-[160px] bg-gradient-to-r from-[#D93F21] to-[#FF6B35] hover:from-[#b9351b] hover:to-[#E55A25] text-white rounded-xl h-12 font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 transform hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        Lanjut <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto min-w-[160px] bg-gradient-to-r from-[#D93F21] to-[#FF6B35] hover:from-[#b9351b] hover:to-[#E55A25] text-white rounded-xl h-12 font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 transform hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Konfirmasi Booking"}
                                    </Button>
                                )}
                            </div>
                        </div>
                        
                        {/* Footer text kecil */}
                        <p className="text-center text-xs text-gray-400 mt-6">
                            &copy; 2026 Hatta Sport Center. Semua hak dilindungi.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- MAIN EXPORT ---
export default function BookingWizardPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-[#D93F21]" />
                <p className="text-gray-500 font-medium">Memuat formulir...</p>
            </div>
        }>
            <BookingWizardContent />
        </Suspense>
    );
}