'use client';

import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface BookingFilterProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    statusFilter: string;
    setStatusFilter: (val: string) => void;
}

export default function BookingFilter({ 
    searchQuery, setSearchQuery, statusFilter, setStatusFilter 
}: BookingFilterProps) {
    return (
        <Card className="p-4 border shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input 
                        placeholder="Cari Kode Booking / Nama Pelanggan..." 
                        className="pl-9" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-[200px]">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                            <Filter className="w-4 h-4 mr-2 text-gray-500" />
                            <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="1">Menunggu Bayar</SelectItem>
                            <SelectItem value="2">Perlu Konfirmasi</SelectItem>
                            <SelectItem value="3">Terkonfirmasi</SelectItem>
                            <SelectItem value="5">Selesai</SelectItem>
                            <SelectItem value="4">Dibatalkan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </Card>
    );
}