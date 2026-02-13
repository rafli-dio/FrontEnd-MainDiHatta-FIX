'use client';

import { useKeuanganPage } from '@/hooks/admin/useKeuanganPage';

import KeuanganFilters from '@/components/admin/keuangan/KeuanganFilters';
import KeuanganStatsCards from '@/components/admin/keuangan/KeuanganStatsCards';
import KeuanganJurnalTable from '@/components/admin/keuangan/KeuanganJurnalTable';

export default function KeuanganPage() {
   const { 
        filteredTransactions,
        filteredPemasukan,
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

    return (
        <div className="space-y-8 pb-20">
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

            <KeuanganStatsCards 
                pemasukan={filteredPemasukan}
                formatRupiah={formatRupiah}
            />

            <KeuanganJurnalTable 
                loading={loading}
                transactions={filteredTransactions}
                formatRupiah={formatRupiah}
                formatDate={formatDate}
            />

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