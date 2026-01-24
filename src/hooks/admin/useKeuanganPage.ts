'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

// Definisi Tipe Data Lokal (jika belum ada di global types)
export interface JenisTransaksi {
    nama_jenis: string;
    tipe: 'masuk' | 'keluar';
}

export interface Transaksi {
    id: number;
    tanggal_transaksi: string;
    keterangan: string;
    debit: number;   
    kredit: number; 
    jenis_transaksi: JenisTransaksi;
}

export interface LaporanResponse {
    saldo_akhir: number;
    total_pemasukan: number;
    total_pengeluaran: number;
    detail_jurnal: Transaksi[];
}

export function useKeuanganPage() {
    // State Data
    const [laporan, setLaporan] = useState<LaporanResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // State Filter
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth.toString());
    const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());

    // 1. Fetch Data (Defensive)
    const fetchLaporan = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/laporan/jurnal');
            
            // Validasi Data Response
            const rawData = response.data?.data || response.data;
            if (rawData) {
                // Pastikan detail_jurnal adalah array
                setLaporan({
                    ...rawData,
                    detail_jurnal: Array.isArray(rawData.detail_jurnal) ? rawData.detail_jurnal : []
                });
            } else {
                setLaporan(null);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Gagal memuat laporan keuangan.");
            setLaporan(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLaporan();
    }, []);

    // 2. Logic Filter Client-Side (Defensive)
    // Gunakan array kosong jika detail_jurnal undefined/null
    const safeTransactions = laporan?.detail_jurnal || [];

    const filteredTransactions = safeTransactions.filter(item => {
        // Safety check per item
        if (!item || !item.tanggal_transaksi || !item.jenis_transaksi) return false;

        const date = new Date(item.tanggal_transaksi);
        const itemMonth = date.getMonth() + 1;
        const itemYear = date.getFullYear();

        const matchMonth = selectedMonth === 'all' || itemMonth.toString() === selectedMonth;
        const matchYear = itemYear.toString() === selectedYear;
        // Hanya transaksi masuk (pemasukan)
        const matchType = item.jenis_transaksi.tipe === 'masuk';

        return matchMonth && matchYear && matchType;
    });

    // 3. Kalkulasi Total - Hanya pemasukan
    const filteredPemasukan = filteredTransactions.reduce((sum, item) => sum + Number(item.kredit || 0), 0);

    // 4. Helpers
    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR', 
            minimumFractionDigits: 0 
        }).format(Number(angka || 0));
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    // 5. Handle Export Excel
    const handleExportExcel = () => {
        if (filteredTransactions.length === 0) {
            toast.error("Tidak ada data untuk diexport.");
            return;
        }

        const dataToExport = filteredTransactions.map(item => ({
            'ID': item.id,
            'Tanggal': item.tanggal_transaksi,
            'Keterangan': item.keterangan,
            'Jenis': item.jenis_transaksi?.nama_jenis || '-',
            'Pemasukan': Number(item.kredit || 0),
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Jurnal Umum");

        const summaryData = [
            { 'Keterangan': 'Periode', 'Nilai': `${selectedMonth === 'all' ? 'Setahun' : selectedMonth}/${selectedYear}` },
            { 'Keterangan': 'Total Pemasukan', 'Nilai': filteredPemasukan },
        ];
        const summarySheet = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan");

        const fileName = `Laporan_Keuangan_${selectedYear}_${selectedMonth}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        
        toast.success("Laporan berhasil diunduh!");
    };

    const handlePrint = () => {
        window.print();
    };

    return {
        filteredTransactions,
        filteredPemasukan,
        loading,
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
        handleExportExcel,
        handlePrint,
        formatRupiah,
        formatDate,
        currentYear
    };
}