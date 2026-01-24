'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import { User, Role } from '@/types';

interface UserFormDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (formData: any, isEdit: boolean) => Promise<void>;
    initialData: User | null;
    roles: Role[];
}

export default function UserFormDialog({
    isOpen,
    onOpenChange,
    onSubmit,
    initialData,
    roles
}: UserFormDialogProps) {
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        nomor_telepon: '',
        alamat: '',
        role_id: '',
        password: '',
        password_confirmation: '',
    });

    // Reset atau Isi Form saat dialog dibuka
    useEffect(() => {
        if (isOpen && initialData) {
            // Mode Edit
            setFormData({
                name: initialData.name,
                email: initialData.email,
                nomor_telepon: initialData.nomor_telepon || '',
                alamat: initialData.alamat || '',
                role_id: initialData.role_id.toString(),
                password: '', 
                password_confirmation: '',
            });
        } else if (isOpen && !initialData) {
            // Mode Tambah (Reset)
            setFormData({
                name: '', email: '', nomor_telepon: '', alamat: '', role_id: '', 
                password: '', password_confirmation: ''
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
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit User' : 'Tambah User Baru'}</DialogTitle>
                    <DialogDescription>Isi detail pengguna untuk memberikan akses sistem.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label>Nama Lengkap <span className="text-red-500">*</span></Label>
                            <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Nama User" />
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Email <span className="text-red-500">*</span></Label>
                            <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="email@domain.com" />
                        </div>

                        <div className="space-y-2">
                            <Label>Role <span className="text-red-500">*</span></Label>
                            <Select value={formData.role_id} onValueChange={(v) => setFormData({...formData, role_id: v})}>
                                <SelectTrigger><SelectValue placeholder="Pilih Role" /></SelectTrigger>
                                <SelectContent>
                                    {roles.map(r => (
                                        <SelectItem key={r.id} value={r.id.toString()}>{r.name_role}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Nomor Telepon</Label>
                            <Input value={formData.nomor_telepon} onChange={e => setFormData({...formData, nomor_telepon: e.target.value})} placeholder="08..." />
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Alamat</Label>
                            <Input value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} placeholder="Alamat lengkap" />
                        </div>
                    </div>

                    {/* Password Section */}
                    <div className="border-t border-gray-100 pt-4 mt-2">
                        <div className="flex items-center gap-2 mb-3">
                            <Lock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Pengaturan Keamanan</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Password {initialData && <span className="text-xs font-normal text-gray-500">(Kosongkan jika tidak ubah)</span>}</Label>
                                <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!initialData} placeholder={initialData ? "******" : "Wajib diisi"} />
                            </div>
                            <div className="space-y-2">
                                <Label>Konfirmasi Password</Label>
                                <Input type="password" value={formData.password_confirmation} onChange={e => setFormData({...formData, password_confirmation: e.target.value})} required={!initialData || formData.password !== ''} placeholder={initialData ? "******" : "Wajib diisi"} />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                        <Button type="submit" disabled={isSaving} className="bg-[#D93F21] hover:bg-[#b9351b]">
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}