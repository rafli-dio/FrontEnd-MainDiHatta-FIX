'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { StatusBooking } from '@/types';

interface StatusBookingFormDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: () => Promise<void>;
    editData: StatusBooking | null;
    formData: { nama_status: string };
    setFormData: (data: { nama_status: string }) => void;
}

export default function StatusBookingFormDialog({
    isOpen,
    onOpenChange,
    onSubmit,
    editData,
    formData,
    setFormData,
}: StatusBookingFormDialogProps) {
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSubmit();
        setIsSaving(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>{editData ? 'Edit Status' : 'Tambah Status Baru'}</DialogTitle>
                    <DialogDescription>
                        Status digunakan untuk melacak progres booking lapangan.
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label>Nama Status <span className="text-red-500">*</span></Label>
                        <Input 
                            placeholder="Cth: Selesai, Dibatalkan"
                            value={formData.nama_status}
                            onChange={(e) => setFormData({...formData, nama_status: e.target.value})}
                            required
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