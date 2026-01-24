'use client';

import { FormEvent } from 'react';
import { User, Mail, Phone, MapPin, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";

interface ProfileInfoFormProps {
    infoData: any;
    setInfoData: (data: any) => void;
    onSubmit: (e: FormEvent) => void;
    isSaving: boolean;
}

export default function ProfileInfoForm({ infoData, setInfoData, onSubmit, isSaving }: ProfileInfoFormProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Data Diri</CardTitle>
                <CardDescription>Perbarui informasi profil akun Anda.</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id="name" className="pl-9" value={infoData.name} onChange={e => setInfoData({...infoData, name: e.target.value})} required />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id="email" type="email" className="pl-9" value={infoData.email} onChange={e => setInfoData({...infoData, email: e.target.value})} required />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id="phone" className="pl-9" value={infoData.nomor_telepon} onChange={e => setInfoData({...infoData, nomor_telepon: e.target.value})} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Alamat</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id="address" className="pl-9" value={infoData.alamat} onChange={e => setInfoData({...infoData, alamat: e.target.value})} />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSaving} className="bg-[#D93F21] hover:bg-[#b9351b]">
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Save className="h-4 w-4 mr-2"/>}
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}