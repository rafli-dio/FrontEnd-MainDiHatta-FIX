'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import Hook Logika
import { useProfilePage } from '@/hooks/common/useProfilePage';

// Import Komponen UI
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileCard from '@/components/profile/ProfileCard';
import ProfileInfoForm from '@/components/profile/ProfileInfoForm';
import ProfilePasswordForm from '@/components/profile/ProfilePasswordForm';

export default function ProfilePage() {
    // 1. Panggil Logika dari Hook
    const { 
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
    } = useProfilePage();

    // Pastikan user ada sebelum render (untuk menghindari flicker/error)
    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* 2. Header Halaman */}
                <ProfileHeader backHref={getDashboardLink()} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* 3. Kartu Profil (Foto & Info Singkat) */}
                    <div className="lg:col-span-1">
                        <ProfileCard 
                            user={user} 
                            previewFoto={previewFoto} 
                            onFileChange={handleFileChange} 
                        />
                    </div>

                    {/* 4. Area Formulir (Tab Navigasi) */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="info" className="w-full">
                            <TabsList className="w-full justify-start mb-6 bg-white p-1 rounded-lg border shadow-sm">
                                <TabsTrigger value="info" className="flex-1 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
                                    Informasi Profil
                                </TabsTrigger>
                                <TabsTrigger value="password" className="flex-1 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
                                    Ganti Password
                                </TabsTrigger>
                            </TabsList>

                            {/* Konten Tab 1: Edit Info */}
                            <TabsContent value="info" className="mt-0">
                                <ProfileInfoForm 
                                    infoData={infoData}
                                    setInfoData={setInfoData}
                                    onSubmit={handleUpdateInfo}
                                    isSaving={isSaving}
                                />
                            </TabsContent>

                            {/* Konten Tab 2: Ganti Password */}
                            <TabsContent value="password" className="mt-0">
                                <ProfilePasswordForm 
                                    passData={passData}
                                    setPassData={setPassData}
                                    onSubmit={handleUpdatePassword}
                                    isSaving={isSaving}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}