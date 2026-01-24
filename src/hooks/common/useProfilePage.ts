'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export function useProfilePage() {
    const { user, mutate } = useAuth({ middleware: 'auth' }); 
    const [isSaving, setIsSaving] = useState(false);

    // State Data Profil
    const [infoData, setInfoData] = useState({
        name: '',
        email: '',
        nomor_telepon: '',
        alamat: '',
        foto: null as File | null,
    });
    const [previewFoto, setPreviewFoto] = useState<string | null>(null);

    // State Data Password
    const [passData, setPassData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // 1. Sync Data User ke State saat load
    useEffect(() => {
        if (user) {
            setInfoData({
                name: user.name,
                email: user.email,
                nomor_telepon: user.nomor_telepon || '',
                alamat: user.alamat || '',
                foto: null
            });
            setPreviewFoto(user.foto_url || null);
        }
    }, [user]);

    const getDashboardLink = () => {
        if (user?.role?.name_role === 'Admin') return '/admin/dashboard';
        if (user?.role?.name_role === 'Karyawan') return '/karyawan/dashboard'; 
        return '/pelanggan/home';
    };

    // 3. Handler Ganti File Foto
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setInfoData(prev => ({ ...prev, foto: file }));
            setPreviewFoto(URL.createObjectURL(file));
        }
    };

    // 4. Submit Update Info
    const handleUpdateInfo = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('name', infoData.name);
            formData.append('email', infoData.email);
            formData.append('nomor_telepon', infoData.nomor_telepon);
            formData.append('alamat', infoData.alamat);
            
            if (infoData.foto) {
                formData.append('foto', infoData.foto);
            }

            await axios.post(`/api/users/${user?.id}?_method=PUT`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success("Profil berhasil diperbarui!");
            mutate(); 

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Gagal update profil.");
        } finally {
            setIsSaving(false);
        }
    };

    // 5. Submit Update Password
    const handleUpdatePassword = async (e: FormEvent) => {
        e.preventDefault();
        
        if (passData.password !== passData.password_confirmation) {
            return toast.error("Konfirmasi password tidak cocok.");
        }

        setIsSaving(true);
        try {
            await axios.put('/api/user/password', passData); 
            toast.success("Password berhasil diubah!");
            setPassData({ current_password: '', password: '', password_confirmation: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal ubah password.");
        } finally {
            setIsSaving(false);
        }
    };

    return {
        user,
        isSaving,
        infoData,
        setInfoData,
        passData,
        setPassData,
        previewFoto,
        getDashboardLink,
        handleFileChange,
        handleUpdateInfo,
        handleUpdatePassword
    };
}