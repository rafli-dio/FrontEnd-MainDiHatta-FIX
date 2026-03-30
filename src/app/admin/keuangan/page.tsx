'use client';

import { useKeuanganPage } from '@/hooks/admin/useKeuanganPage';

import KeuanganFilters from '@/components/admin/keuangan/KeuanganFilters';
import KeuanganStatsCards from '@/components/admin/keuangan/KeuanganStatsCards';
import KeuanganJurnalTable from '@/components/admin/keuangan/KeuanganJurnalTable';

export default function KeuanganPage() {
    const { 
        filteredTransactions,
        filteredPemasukan,
        filteredPengeluaran,
        loading,
        filterMode,
        setFilterMode,
        selectedDate,
        setSelectedDate,
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
        handleExportExcel,
        handlePrint,
        formatRupiah,
        formatDate,
        currentYear
    } = useKeuanganPage();

    const todayDate = new Date().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <div className="space-y-8 pb-20 print:space-y-4 print:pb-0">
            
            <div className="print-only hidden print:block mb-6 border-b-2 border-black pb-4 text-center">
                <h1 className="text-3xl font-bold uppercase tracking-wide text-black">HATTA SPORT CENTER</h1>
                <p className="text-sm text-black mt-1">Jl. Rajawali Raya, RT.03/RW.II, Nilagraha, Gonilan, Kec. Kartasura</p>
                <p className="text-sm text-black">Kabupaten Sukoharjo, Jawa Tengah 57169</p>
                <p className="text-sm text-black font-semibold mt-1">Telp: +62 811-2654-765 | Email: admin@maindihatta.id</p>
            </div>

            <div className="print-only hidden print:block text-center mb-6">
                <h2 className="text-xl font-bold underline decoration-2 underline-offset-4">LAPORAN KEUANGAN</h2>
                <p className="text-sm mt-1">
                    Periode: {filterMode === 'daily' 
                        ? (selectedDate ? formatDate(selectedDate) : 'Semua Tanggal')
                        : `${selectedMonth === 'all' ? 'Setahun' : selectedMonth}/${selectedYear}`
                    }
                </p>
            </div>

            <div className="print:hidden">
                <KeuanganFilters 
                    filterMode={filterMode}
                    setFilterMode={setFilterMode}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    handleExportExcel={handleExportExcel}
                    handlePrint={handlePrint}
                    currentYear={currentYear}
                />
            </div>

            <KeuanganStatsCards 
                pemasukan={filteredPemasukan}
                pengeluaran={filteredPengeluaran}
                formatRupiah={formatRupiah}
            />

            <KeuanganJurnalTable 
                loading={loading}
                transactions={filteredTransactions}
                formatRupiah={formatRupiah}
                formatDate={formatDate}
            />

            <div className="print-only hidden print:flex justify-end mt-16 pr-10">
                <div className="text-center w-64">
                    <p className="text-black mb-2">Sukoharjo, {todayDate}</p>
                    <p className="text-black font-bold mb-20">Pemilik / Owner</p>
                    
                    <p className="text-black font-bold underline underline-offset-4">
                        Mujiyono
                    </p>
                </div>
            </div>
            <style jsx global>{`
                /* Default: Sembunyikan elemen khusus print di layar biasa */
                .print-only {
                    display: none;
                }

                @media print {
                    /* Aturan Dasar Halaman */
                    @page {
                        margin: 1.5cm;
                        size: A4;
                    }

                    /* Tampilkan elemen khusus print */
                    .print-only {
                        display: block !important;
                    }
                    /* Khusus untuk tanda tangan agar bisa flex */
                    div.print-only.print\\:flex {
                        display: flex !important;
                    }

                    /* Sembunyikan elemen navigasi & tombol yang tidak perlu */
                    nav, aside, button, .print\\:hidden, 
                    [role="combobox"], /* Sembunyikan dropdown select */
                    .shadow-sm, /* Hilangkan shadow */
                    .bg-white, /* Hilangkan background putih card */
                    .border-l-4 /* Hilangkan border warna di kiri card */
                    { 
                        box-shadow: none !important;
                        border: none !important;
                    }
                    
                    /* Reset Layout agar Full Width */
                    .md\\:ml-64 { margin-left: 0 !important; }
                    main { padding: 0 !important; margin: 0 !important; width: 100% !important; }
                    
                    /* Styling Tabel agar rapi saat print */
                    table { width: 100% !important; border-collapse: collapse; }
                    th, td { border: 1px solid #000 !important; padding: 8px !important; color: #000 !important; }
                    
                    /* Styling Card agar jadi teks biasa/kotak simple */
                    .card, .border, .rounded-xl, .rounded-lg { 
                        border: none !important; 
                        border-radius: 0 !important; 
                        box-shadow: none !important;
                    }

                    /* Pastikan teks hitam pekat */
                    * { color: black !important; -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>
    );
}