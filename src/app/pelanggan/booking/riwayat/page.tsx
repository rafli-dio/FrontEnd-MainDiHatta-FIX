'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useBookingHistory } from '@/hooks/pelanggan/useBookingHistory';
import { formatDate, downloadTicketPDF } from '@/lib/bookingUtils';
import { sweetAlert } from '@/lib/sweetAlert';

// UI Components
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, History, Loader2, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

// Custom Components
import BookingCard from '@/components/pelanggan/booking/BookingCard';
import UploadDialog from '@/components/pelanggan/booking/UploadDialog';

const ITEMS_PER_PAGE = 5;

export default function BookingHistoryPage() {
    const { activeBookings, historyBookings, loading, isUploading, uploadPaymentProof, cancelBooking } = useBookingHistory();
    
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    // --- STATE PAGINATION ---
    const [activePage, setActivePage] = useState(1);
    const [historyPage, setHistoryPage] = useState(1);

    const handleUploadClick = (booking: any) => {
        setSelectedBooking(booking);
        setIsUploadOpen(true);
    };

    const handleUploadSubmit = async (file: File) => {
        if (!selectedBooking) return false;
        return await uploadPaymentProof(selectedBooking.id, file);
    };

    const handleCancelClick = async (booking: any) => {
        const result = await sweetAlert.confirmDelete(
            'Batalkan Booking?',
            `Apakah Anda yakin ingin membatalkan booking ${booking.kode_booking}?`
        );
        if (!result.isConfirmed) return;
        await cancelBooking(booking.id);
    };

    const handlePrint = (booking: any) => {
        downloadTicketPDF(booking);
    };

    // --- HELPER: Logic Potong Data (Slicing) ---
    const getPaginatedData = (data: any[], page: number) => {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return data.slice(startIndex, endIndex);
    };

    // --- COMPONENT: Tombol Pagination Responsif ---
    const PaginationControls = ({ 
        currentPage, 
        totalItems, 
        onPageChange 
    }: { 
        currentPage: number, 
        totalItems: number, 
        onPageChange: (page: number) => void 
    }) => {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        
        if (totalPages <= 1) return null;

        return (
            <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6 pt-4 border-t border-gray-100">
                <Button
                    variant="outline"
                    size="icon" // Ganti size="sm" jadi "icon" agar kotak rapi di HP
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-9 w-9 rounded-lg border-gray-300 hover:bg-gray-100"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <span className="text-xs sm:text-sm text-gray-600 font-medium whitespace-nowrap">
                    Hal {currentPage} / {totalPages}
                </span>
                
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9 rounded-lg border-gray-300 hover:bg-gray-100"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] pt-20 pb-20 px-4 sm:px-6 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                
                {/* Header Section (Responsif) */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                    <div className="w-full sm:w-auto">
                        <Link href="/pelanggan/home" className="text-gray-500 text-xs sm:text-sm hover:text-[#D93F21] mb-2 flex items-center transition-colors">
                            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Kembali ke Beranda
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">Riwayat Booking</h1>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">Kelola jadwal main dan status pembayaran Anda.</p>
                    </div>
                    
                    {/* Tombol Booking Baru (Full width di HP) */}
                    <Link href="/pelanggan/booking/create" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-[#D93F21] hover:bg-[#b9351b] rounded-xl shadow-lg shadow-orange-200 font-bold h-12 sm:h-10 text-sm sm:text-base transition-transform active:scale-95">
                            <Plus className="w-4 h-4 mr-2" /> Booking Baru
                        </Button>
                    </Link>
                </div>

                {/* Tabs Section */}
                <Tabs defaultValue="active" className="w-full">
                    {/* Tab List: Grid 2 kolom yang rapi di HP */}
                    <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 bg-white p-1.5 rounded-xl border border-gray-200 h-auto shadow-sm">
                        <TabsTrigger 
                            value="active" 
                            className="rounded-lg py-2.5 sm:py-3 text-xs sm:text-sm font-semibold data-[state=active]:bg-[#D93F21] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                        >
                            Aktif <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs">{activeBookings.length}</span>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="history" 
                            className="rounded-lg py-2.5 sm:py-3 text-xs sm:text-sm font-semibold data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                        >
                            Riwayat
                        </TabsTrigger>
                    </TabsList>

                    {/* --- TAB BOOKING AKTIF --- */}
                    <TabsContent value="active" className="space-y-4 animate-in fade-in-50 duration-300">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 animate-spin text-[#D93F21] mb-2"/>
                                <span className="text-gray-400 text-sm">Memuat data...</span>
                            </div>
                        ) : activeBookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-dashed border-gray-300 text-center">
                                <div className="bg-gray-50 p-4 rounded-full mb-4">
                                    <Calendar className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-gray-900 font-semibold mb-1">Belum ada booking aktif</h3>
                                <p className="text-gray-500 text-sm mb-4 max-w-xs mx-auto">
                                    Jadwal main Anda yang sedang berjalan akan muncul di sini.
                                </p>
                                <Link href="/pelanggan/booking/create">
                                    <Button variant="outline" className="text-[#D93F21] border-[#D93F21] hover:bg-orange-50">
                                        Buat Booking Sekarang
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {getPaginatedData(activeBookings, activePage).map(booking => (
                                        <BookingCard 
                                            key={booking.id} 
                                            booking={booking}
                                            formatDate={formatDate}
                                            onUpload={() => handleUploadClick(booking)}
                                            onCancel={() => handleCancelClick(booking)}
                                            onPrint={() => handlePrint(booking)}
                                            isHistory={false}
                                            isUploading={isUploading}
                                        />
                                    ))}
                                </div>
                                {/* Controls Pagination */}
                                <PaginationControls 
                                    currentPage={activePage} 
                                    totalItems={activeBookings.length} 
                                    onPageChange={setActivePage} 
                                />
                            </>
                        )}
                    </TabsContent>

                    {/* --- TAB RIWAYAT --- */}
                    <TabsContent value="history" className="space-y-4 animate-in fade-in-50 duration-300">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 animate-spin text-gray-400 mb-2"/>
                            </div>
                        ) : historyBookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-dashed border-gray-300 text-center">
                                <div className="bg-gray-50 p-4 rounded-full mb-4">
                                    <History className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 text-sm font-medium">Belum ada riwayat booking lama.</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {getPaginatedData(historyBookings, historyPage).map(booking => (
                                        <BookingCard 
                                            key={booking.id} 
                                            booking={booking}
                                            formatDate={formatDate}
                                            onPrint={() => handlePrint(booking)}
                                            isHistory={true}
                                        />
                                    ))}
                                </div>
                                {/* Controls Pagination */}
                                <PaginationControls 
                                    currentPage={historyPage} 
                                    totalItems={historyBookings.length} 
                                    onPageChange={setHistoryPage} 
                                />
                            </>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Upload Modal */}
                <UploadDialog
                    open={isUploadOpen}
                    onOpenChange={setIsUploadOpen}
                    booking={selectedBooking}
                    onSubmit={handleUploadSubmit}
                    isLoading={isUploading}
                />
            </div>
        </div>
    );
}