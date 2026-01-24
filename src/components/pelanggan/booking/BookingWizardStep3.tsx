'use client';

import { Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PaymentMethod } from '@/types';

interface BookingWizardStep3Props {
    formData: any;
    setFormData: (data: any) => void;
    paymentMethods: PaymentMethod[];
    totalHarga: number;
}

export default function BookingWizardStep3({ formData, setFormData, paymentMethods, totalHarga }: BookingWizardStep3Props) {
    
    const formatRupiah = (num: number) => 
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

    return (
        <div className="space-y-6 max-w-lg animate-in slide-in-from-right-4 duration-300">
            
            {/* --- Bagian Informasi Rekening (DI ATAS) --- */}
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm shadow-sm">
                <p className="font-bold text-blue-900 mb-1 flex items-center gap-2">
                    ℹ️ Informasi Rekening Tujuan Transfer
                </p>
                <div className="mt-2 space-y-1">
                    <p className="text-gray-600">Bank: <span className="font-bold text-black">BCA</span></p>
                    <p className="text-gray-600">No Rekening: <span className="font-mono font-bold text-black text-lg">327-143-0051</span></p>
                    <p className="text-gray-600">A/N: <span className="font-bold text-black">Muhammad Hatta Mustafa</span></p>
                </div>
            </div>

            {/* --- Form Input --- */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Jenis Pembayaran</Label>
                    <Select onValueChange={(v) => setFormData({...formData, payment_method_id: v})}>
                        <SelectTrigger className="h-12 bg-gray-50 border-gray-300 rounded-lg"><SelectValue placeholder="Pilih Bank" /></SelectTrigger>
                        <SelectContent>
                            {paymentMethods.map(method => (
                                <SelectItem key={method.id} value={method.id.toString()}>{method.nama_metode}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Asal Bank</Label>
                    <Input placeholder="pilih asal bank" className="h-12 bg-gray-50 border-gray-300 rounded-lg" value={formData.asal_bank} onChange={e => setFormData({...formData, asal_bank: e.target.value})} />
                </div>
                
                {/* Field Status Pembayaran DIHAPUS/HIDDEN */}

                <div className="space-y-2">
                    <Label>Nama Pengirim</Label>
                    <Input placeholder="masukan nama pengirim" className="h-12 bg-gray-50 border-gray-300 rounded-lg" value={formData.nama_pengirim} onChange={e => setFormData({...formData, nama_pengirim: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label>Jumlah Pembayaran</Label>
                    <Input type="number" placeholder="masukan jumlah pembayaran" className="h-12 bg-gray-50 border-gray-300 rounded-lg" value={formData.jumlah_dp} onChange={e => setFormData({...formData, jumlah_dp: e.target.value})} />
                    <p className="text-xs text-[#D93F21] font-medium mt-1">Total Tagihan: {formatRupiah(totalHarga)}</p>
                </div>
                <div className="col-span-2 space-y-2"> {/* col-span-2 agar file upload lebar penuh */}
                    <Label>Bukti Pembayaran</Label>
                    <div className="relative">
                        <Input type="file" accept="image/*" className="cursor-pointer h-12 bg-gray-50 border-gray-300 rounded-lg pt-2.5" onChange={e => setFormData({...formData, bukti_pembayaran: e.target.files?.[0] || null})} />
                        <ImageIcon className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}