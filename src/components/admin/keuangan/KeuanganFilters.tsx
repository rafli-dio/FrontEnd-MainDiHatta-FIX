'use client';

import { Filter, FileSpreadsheet, Printer, CalendarDays, CalendarRange } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface KeuanganFiltersProps {
    filterMode: 'monthly' | 'daily';
    setFilterMode: (mode: 'monthly' | 'daily') => void;
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    selectedMonth: string;
    setSelectedMonth: (val: string) => void;
    selectedYear: string;
    setSelectedYear: (val: string) => void;
    handleExportExcel: () => void;
    handlePrint: () => void;
    currentYear: number;
}

export default function KeuanganFilters({
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
        <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h1>
                    <p className="text-gray-500 text-sm">Ringkasan arus kas masuk (Pendapatan).</p>
                </div>
                
                <div className="flex gap-2 mt-4 lg:mt-0 print:hidden">
                    <Button 
                        className="bg-green-600 hover:bg-green-700 text-white" 
                        onClick={handleExportExcel}
                        size="sm"
                    >
                        <FileSpreadsheet className="w-4 h-4 mr-2" /> Export Excel
                    </Button>
                    
                    <Button variant="outline" onClick={handlePrint} size="sm">
                        <Printer className="w-4 h-4 mr-2" /> Print
                    </Button>
                </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm print:hidden">
                <div className="flex items-center gap-2 mr-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filter:</span>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-md">
                    <button
                        onClick={() => setFilterMode('monthly')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all ${
                            filterMode === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        Bulanan
                    </button>
                    <button
                        onClick={() => setFilterMode('daily')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all ${
                            filterMode === 'daily' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        Harian
                    </button>
                </div>
                
                <div className="h-6 w-px bg-gray-300 mx-2 hidden sm:block"></div>

                {filterMode === 'monthly' ? (
                    <>
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-[140px] h-9 bg-white">
                                <CalendarRange className="w-3.5 h-3.5 mr-2 text-gray-400" />
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
                            <SelectTrigger className="w-[100px] h-9 bg-white">
                                <SelectValue placeholder="Tahun" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map(y => (
                                    <SelectItem key={y} value={y}>{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </>
                ) : (
                    <div className="flex items-center gap-2">
                        <Input 
                            type="date" 
                            className="h-9 w-auto bg-white"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}