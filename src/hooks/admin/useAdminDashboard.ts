'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

// Definisi Tipe Data
export interface DashboardData {
    summary: {
        pendapatan_hari_ini: number | string;
        booking_perlu_konfirmasi: number;
        jadwal_main_hari_ini: number;
        jumlah_stok_kritis: number;
    };
    recent_activity: {
        id: number;
        keterangan: string;
        kredit: string;
        debit: string;
        created_at: string;
    }[];
    chart_data: any; 
}

export interface ProcessedChartData {
    name: string;
    date: string;
    dateDisplay: string;
    total: number;
}

export function useAdminDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [chartData, setChartData] = useState<ProcessedChartData[]>([]);
    const [loading, setLoading] = useState(true);

    // Helper Format Rupiah
    const formatRupiah = (angka: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(angka));
    };

    // Helper Process Chart Data
    const processChartData = (apiData: any) => {
        const today = new Date();
        const dayIndex = (today.getDay() + 6) % 7; 
        const monday = new Date(today);
        monday.setDate(today.getDate() - dayIndex);

        const formatDateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const formatDateDisplay = (d: Date) => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        const weekdayNames = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];

        const totalsMap: Record<string, number> = {};

        const addToMap = (dateStr: string, value: number) => {
            totalsMap[dateStr] = (totalsMap[dateStr] || 0) + (Number(value) || 0);
        };

        // Normalisasi data dari API (Array atau Object)
        if (Array.isArray(apiData)) {
            apiData.forEach((c: any) => {
                const possible = c?.date ?? c?.name ?? c?.label ?? c?.day ?? null;
                let parsed: Date | null = null;
                if (possible) {
                    const p = new Date(possible);
                    if (!isNaN(p.getTime())) parsed = p;
                }
                if (parsed) {
                    addToMap(formatDateKey(parsed), c?.total ?? c?.value ?? 0);
                }
            });
        } else if (apiData && typeof apiData === 'object') {
            Object.entries(apiData).forEach(([k, v]) => {
                const p = new Date(k);
                if (!isNaN(p.getTime())) {
                    addToMap(formatDateKey(p), v as number);
                }
            });
        }

        return Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const key = formatDateKey(d);
            return {
                name: weekdayNames[i],
                date: key,                
                dateDisplay: formatDateDisplay(d),
                total: totalsMap[key] || 0,
            };
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('api/dashboard');
                const respData = response.data?.data || response.data || {};
                
                setData(respData);
                
                if (respData.chart_data) {
                    setChartData(processChartData(respData.chart_data));
                }
            } catch (error) {
                console.error("Gagal ambil data dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return {
        data,
        chartData,
        loading,
        formatRupiah
    };
}