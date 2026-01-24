'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Upload, Loader2, ImageIcon } from 'lucide-react';
import { Booking } from '@/types';
import { formatRupiah } from '@/lib/bookingUtils';

interface UploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: Booking | null;
    onSubmit: (file: File) => Promise<boolean>;
    isLoading: boolean;
}

export default function UploadDialog({
    open,
    onOpenChange,
    booking,
    onSubmit,
    isLoading
}: UploadDialogProps) {
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !booking) return;

        const success = await onSubmit(file);
        if (success) {
            setFile(null);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload Bukti Pembayaran</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm text-blue-700 font-medium">Kode Booking:</p>
                            <p className="text-sm font-mono font-bold text-blue-900">{booking?.kode_booking}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-blue-700 font-medium">Total Tagihan:</p>
                            <p className="text-xl font-bold text-blue-900">
                                {booking ? formatRupiah(Number(booking.total_harga)) : 0}
                            </p>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>File Bukti Transfer (JPG/PNG)</Label>
                        <div className="relative">
                            <Input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                required
                                disabled={isLoading}
                                className="pl-10 py-2 h-12 cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <ImageIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button 
                            type="submit" 
                            disabled={isLoading || !file} 
                            className="w-full bg-[#D93F21] hover:bg-[#b9351b]"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin mr-2" />
                            ) : (
                                <Upload className="w-4 h-4 mr-2" />
                            )}
                            {isLoading ? 'Mengunggah...' : 'Kirim Bukti'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
