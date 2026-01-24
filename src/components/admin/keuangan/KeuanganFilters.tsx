'use client';

import { Filter, FileSpreadsheet, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface KeuanganFiltersProps {
    selectedMonth: string;
    setSelectedMonth: (val: string) => void;
    selectedYear: string;
    setSelectedYear: (val: string) => void;
    handleExportExcel: () => void;
    handlePrint: () => void;
    currentYear: number;
}

export default function KeuanganFilters({
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    handleExportExcel,
    handlePrint,
    currentYear
}: KeuanganFiltersProps) {
    
    const months = [
        { value: '1', label: 'Januari' }, { value: '2', label: 'Februari' }, { value: '3', label: 'Maret' },
        { value: '4', label: 'April' }, { value: '5', label: 'Mei' }, { value: '6', label: 'Juni' },
        { value: '7', label: 'Juli' }, { value: '8', label: 'Agustus' }, { value: '9', label: 'September' },
        { value: '10', label: 'Oktober' }, { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
    ];
    
    const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h1>
                <p className="text-gray-500 text-sm">Ringkasan arus kas masuk dan keluar (Jurnal Umum).</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm print:hidden">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500 ml-2" />
                    <span className="text-sm font-medium text-gray-600 mr-1">Periode:</span>
                </div>
                
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[130px] h-9">
                        <SelectValue placeholder="Bulan" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Bulan</SelectItem>
                        {months.map(m => (
                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[100px] h-9">
                        <SelectValue placeholder="Tahun" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map(y => (
                            <SelectItem key={y} value={y}>{y}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex gap-2 print:hidden">
                <Button 
                    className="bg-green-600 hover:bg-green-700 text-white" 
                    onClick={handleExportExcel}
                    size="sm"
                >
                    <FileSpreadsheet className="w-4 h-4 mr-2" /> Export Excel
                </Button>
                
                <Button variant="outline" onClick={handlePrint} size="sm">
                    <Printer className="w-4 h-4 mr-2" /> Print PDF
                </Button>
            </div>
        </div>
    );
}