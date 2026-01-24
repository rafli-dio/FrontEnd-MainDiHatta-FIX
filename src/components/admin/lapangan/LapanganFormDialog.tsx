'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Loader2, DollarSign } from 'lucide-react';
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
import { Lapangan } from '@/types';

interface LapanganFormDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (formData: any, isEdit: boolean) => Promise<void>;
    initialData: Lapangan | null;
}

export default function LapanganFormDialog({
    isOpen,
    onOpenChange,
    onSubmit,
    initialData,
}: LapanganFormDialogProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        nama_lapangan: '',
        deskripsi: '',
        harga_per_jam: '',
        jam_buka: '08:00:00',
        jam_tutup: '22:00:00',
        status_aktif: true,
        foto: null as File | null,
    });

    // Reset atau Isi Form saat dialog dibuka
    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                nama_lapangan: initialData.nama_lapangan,
                deskripsi: initialData.deskripsi || '',
                harga_per_jam: initialData.harga_per_jam.toString(),
                jam_buka: initialData.jam_buka,
                jam_tutup: initialData.jam_tutup,
                status_aktif: Boolean(initialData.status_aktif),
                foto: null
            });
        } else if (isOpen && !initialData) {
            setFormData({
                nama_lapangan: '',
                deskripsi: '',
                harga_per_jam: '',
                jam_buka: '08:00:00',
                jam_tutup: '22:00:00',
                status_aktif: true,
                foto: null
            });
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSubmit(formData, !!initialData);
        setIsSaving(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Lapangan' : 'Tambah Lapangan Baru'}</DialogTitle>
                    <DialogDescription>Informasi ini akan tampil di halaman depan pelanggan.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label>Nama Lapangan <span className="text-red-500">*</span></Label>
                        <Input 
                            value={formData.nama_lapangan} 
                            onChange={e => setFormData({...formData, nama_lapangan: e.target.value})} 
                            required 
                            placeholder="Cth: Lapangan A (Indoor)" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Harga per Jam (Rp) <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input 
                                    type="number" 
                                    className="pl-9" 
                                    value={formData.harga_per_jam} 
                                    onChange={e => setFormData({...formData, harga_per_jam: e.target.value})} 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="space-y-2 pt-8">
                            <div className="flex items-center space-x-2">
                                <Switch 
                                    id="status" 
                                    checked={formData.status_aktif} 
                                    onCheckedChange={c => setFormData({...formData, status_aktif: c})} 
                                />
                                <Label htmlFor="status" className="cursor-pointer">
                                    {formData.status_aktif ? 'Status Aktif' : 'Sedang Tutup'}
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Jam Buka</Label>
                            <Input 
                                type="time" step="1" 
                                value={formData.jam_buka} 
                                onChange={e => setFormData({...formData, jam_buka: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Jam Tutup</Label>
                            <Input 
                                type="time" step="1" 
                                value={formData.jam_tutup} 
                                onChange={e => setFormData({...formData, jam_tutup: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Deskripsi</Label>
                        <Textarea 
                            value={formData.deskripsi} 
                            onChange={e => setFormData({...formData, deskripsi: e.target.value})} 
                            placeholder="Fasilitas: Lantai kayu, AC, Tribun..." 
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Foto Lapangan</Label>
                        <Input 
                            type="file" 
                            accept="image/*" 
                            className="cursor-pointer" 
                            onChange={e => { if(e.target.files?.[0]) setFormData({...formData, foto: e.target.files[0]}) }} 
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                        <Button type="submit" disabled={isSaving} className="bg-[#D93F21] hover:bg-[#b9351b]">
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}