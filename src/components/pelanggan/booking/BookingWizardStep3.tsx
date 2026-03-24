'use client';

import { useEffect, useState } from 'react';
import { Image as ImageIcon, Copy, Check } from 'lucide-react';
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

const CopyableText = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        // Menghapus strip dan spasi supaya format angka bersih disalin
        navigator.clipboard.writeText(text.replace(/[\-\s]/g, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <span className="relative inline-flex items-center gap-1.5 align-baseline bg-blue-50/80 px-2 py-0.5 rounded border border-blue-200/60 mx-1 translate-y-[2px]">
            <span className="font-mono font-bold text-blue-800 text-[14px] tracking-wide">{text}</span>
            <button
                type="button"
                onClick={handleCopy}
                className="text-blue-500 hover:text-blue-700 transition-colors focus:outline-none flex items-center"
                title="Salin"
            >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            {copied && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap z-10 animate-in fade-in zoom-in-95 duration-200">
                    Tersalin!
                </span>
            )}
        </span>
    );
};

interface BookingWizardStep3Props {
    formData: any;
    setFormData: (data: any) => void;
    paymentMethods: PaymentMethod[];
    totalHarga: number;
}

export default function BookingWizardStep3({ formData, setFormData, paymentMethods, totalHarga }: BookingWizardStep3Props) {

    useEffect(() => {
        if (totalHarga > 0) {
            setFormData({
                ...formData,
                jumlah_bayar: totalHarga.toString()
            });
        }
    }, [totalHarga]);

    const formatRupiah = (num: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

    const selectedMethod = paymentMethods.find(m => m.id.toString() === formData.payment_method_id?.toString());


    const formatKeteranganWithCopy = (text: string | null | undefined) => {
        if (!text) return <span className="italic text-gray-500">Tidak ada keterangan tersedia.</span>;

        const normalizedText = text.replace(/([^\n])\s+(A\/N|a\/n|A\/n|Atas Nama)/ig, '$1\n$2');

        const parts = normalizedText.split(/([\d\-\s]{10,})/);

        return (
            <>
                {parts.map((part, index) => {
                    const isNumberSequence = /^[\d\-\s]+$/.test(part) && part.replace(/[\-\s]/g, '').length >= 10;

                    if (isNumberSequence) {
                        return <CopyableText key={index} text={part.trim()} />;
                    }
                    return <span key={index}>{part}</span>;
                })}
            </>
        );
    };

    return (
        <div className="space-y-6 max-w-lg animate-in slide-in-from-right-4 duration-300">

            {selectedMethod ? (
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm shadow-sm">
                    <p className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                        ℹ️ Informasi Pembayaran {selectedMethod.nama_metode}
                    </p>
                    <div className="text-gray-800 whitespace-pre-wrap leading-relaxed mt-1">
                        {formatKeteranganWithCopy(selectedMethod.keterangan)}
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm shadow-sm">
                    <p className="text-gray-500 flex items-center gap-2 italic">
                        ℹ️ Silakan pilih jenis pembayaran terlebih dahulu untuk melihat informasi transfer.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Jenis Pembayaran</Label>
                    <Select onValueChange={(v) => setFormData({ ...formData, payment_method_id: v })} value={formData.payment_method_id?.toString()}>
                        <SelectTrigger className="h-12 bg-gray-50 border-gray-300 rounded-lg"><SelectValue placeholder="Pilih Bank" /></SelectTrigger>
                        <SelectContent>
                            {paymentMethods
                                .filter(method => {
                                    const name = method.nama_metode.toLowerCase();
                                    return !name.includes('cash') && !name.includes('tunai');
                                })
                                .map(method => (
                                    <SelectItem key={method.id} value={method.id.toString()}>
                                        {method.nama_metode}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Asal Bank</Label>
                    <Input placeholder="pilih asal bank" className="h-12 bg-gray-50 border-gray-300 rounded-lg" value={formData.asal_bank} onChange={e => setFormData({ ...formData, asal_bank: e.target.value })} />
                </div>

                <div className="space-y-2">
                    <Label>Nama Pengirim</Label>
                    <Input placeholder="masukan nama pengirim" className="h-12 bg-gray-50 border-gray-300 rounded-lg" value={formData.nama_pengirim} onChange={e => setFormData({ ...formData, nama_pengirim: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <Label>Jumlah Pembayaran</Label>
                    <Input
                        type="number"
                        disabled
                        className="h-12 bg-gray-200 border-gray-300 rounded-lg font-bold text-gray-500 cursor-not-allowed opacity-100"
                        value={formData.jumlah_bayar}
                    />
                    <p className="text-xs text-[#D93F21] font-medium mt-1">Total Tagihan: {formatRupiah(totalHarga)}</p>
                </div>
                <div className="col-span-2 space-y-2">
                    <Label>Bukti Pembayaran</Label>
                    <div className="relative">
                        <Input type="file" accept="image/*" className="cursor-pointer h-12 bg-gray-50 border-gray-300 rounded-lg pt-2.5" onChange={e => setFormData({ ...formData, bukti_pembayaran: e.target.files?.[0] || null })} />
                        <ImageIcon className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}