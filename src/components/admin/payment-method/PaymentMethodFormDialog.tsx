'use client';

import { FormEvent, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { PaymentMethod } from '@/types';

interface PaymentMethodFormDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: () => Promise<void>;
    editData: PaymentMethod | null;
    formData: { nama_metode: string; keterangan: string; is_aktif: boolean };
    setFormData: (data: { nama_metode: string; keterangan: string; is_aktif: boolean }) => void;
}

export default function PaymentMethodFormDialog({
    isOpen,
    onOpenChange,
    onSubmit,
    editData,
    formData,
    setFormData,
}: PaymentMethodFormDialogProps) {
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSubmit();
        setIsSaving(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>{editData ? 'Edit Metode Pembayaran' : 'Tambah Metode Pembayaran Baru'}</DialogTitle>
                    <DialogDescription>
                        Tambahkan metode pembayaran yang dapat digunakan untuk booking lapangan.
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label>Nama Metode <span className="text-red-500">*</span></Label>
                        <Input 
                            placeholder="Cth: Bank Transfer, E-Wallet, Tunai"
                            value={formData.nama_metode}
                            onChange={(e) => setFormData({...formData, nama_metode: e.target.value})}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Keterangan</Label>
                        <Textarea 
                            placeholder="Tambahkan informasi tambahan tentang metode pembayaran ini..."
                            value={formData.keterangan}
                            onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                            rows={3}
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <Label className="cursor-pointer">Status Aktif</Label>
                        <Switch 
                            checked={formData.is_aktif}
                            onCheckedChange={(checked) => setFormData({...formData, is_aktif: checked})}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                        <Button type="submit" disabled={isSaving} className="bg-[#D93F21] hover:bg-[#b9351b]">
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
