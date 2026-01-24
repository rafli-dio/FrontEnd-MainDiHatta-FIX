'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
    nama_lengkap: string;
    email: string;
    nomor_telepon: string;
    nama_club: string;
}

interface BookingWizardStep1Props {
    formData: FormData;
    setFormData: (data: any) => void;
}

export default function BookingWizardStep1({ formData, setFormData }: BookingWizardStep1Props) {
    return (
        <div className="space-y-5 max-w-lg animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input value={formData.nama_lengkap} disabled className="bg-gray-100 h-12 border-gray-200 rounded-lg" />
            </div>
            <div className="space-y-2">
                <Label>Nomor Telepon</Label>
                <Input value={formData.nomor_telepon} disabled className="bg-gray-100 h-12 border-gray-200 rounded-lg" />
            </div>
            <div className="space-y-2">
                <Label>Email</Label>
                <Input value={formData.email} disabled className="bg-gray-100 h-12 border-gray-200 rounded-lg" />
            </div>
            <div className="space-y-2">
                <Label>Nama Club (Wajib)</Label>
                <Input 
                    placeholder="masukan nama club anda" 
                    className="h-12 border-gray-300 focus:border-[#D93F21] focus:ring-[#D93F21] rounded-lg"
                    value={formData.nama_club}
                    onChange={e => setFormData({...formData, nama_club: e.target.value})}
                />
            </div>
        </div>
    );
}