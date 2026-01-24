'use client';

// 1. Import Custom Hook
import { useKeuanganPage } from '@/hooks/admin/useKeuanganPage';

// 2. Import Komponen UI
import KeuanganFilters from '@/components/admin/keuangan/KeuanganFilters';
import KeuanganStatsCards from '@/components/admin/keuangan/KeuanganStatsCards';
import KeuanganJurnalTable from '@/components/admin/keuangan/KeuanganJurnalTable';

export default function KeuanganPage() {
    // 3. Panggil Logika dari Hook
    const { 
        // Data & Totals
        filteredTransactions,
        filteredPemasukan,
        loading,
        
        // Filters State
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
        
        // Actions & Helpers
        handleExportExcel,
        handlePrint,
        formatRupiah,
        formatDate,
        currentYear
    } = useKeuanganPage();

    return (
        <div className="space-y-8 pb-20">
            {/* 1. Header & Filters */}
            <KeuanganFilters 
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                handleExportExcel={handleExportExcel}
                handlePrint={handlePrint}
                currentYear={currentYear}
            />

            {/* 2. Kartu Statistik Ringkasan */}
            <KeuanganStatsCards 
                pemasukan={filteredPemasukan}
                formatRupiah={formatRupiah}
            />

            {/* 3. Tabel Jurnal */}
            <KeuanganJurnalTable 
                loading={loading}
                transactions={filteredTransactions}
                formatRupiah={formatRupiah}
                formatDate={formatDate}
            />

            {/* CSS Khusus Print (Agar Layout Bagus saat diprint) */}
            <style jsx global>{`
                @media print {
                    /* Sembunyikan elemen navigasi saat print */
                    nav, aside, button, .print\\:hidden { display: none !important; }
                    
                    /* Atur margin konten utama agar full width */
                    .md\\:ml-64 { margin-left: 0 !important; }
                    main { padding: 0 !important; margin-top: 0 !important; }
                    
                    /* Styling cetak */
                    body { background-color: white; }
                    .card, .border { border: 1px solid #ddd !important; box-shadow: none !important; }
                }
            `}</style>
        </div>
    );
}