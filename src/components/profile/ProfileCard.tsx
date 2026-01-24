'use client';

import Image from 'next/image';
import { Camera } from 'lucide-react';
import { ChangeEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/types';

interface ProfileCardProps {
    user: User;
    previewFoto: string | null;
    onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileCard({ user, previewFoto, onFileChange }: ProfileCardProps) {
    return (
        <Card className="md:col-span-1 h-fit">
            <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="relative mb-4 group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 relative">
                        {previewFoto ? (
                            <Image 
                                src={previewFoto} 
                                alt={user.name} 
                                fill 
                                className="object-cover"
                                unoptimized 
                                onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200 text-4xl font-bold select-none">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    {/* Overlay Edit Foto */}
                    <label 
                        htmlFor="foto-upload" 
                        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                        <Camera className="text-white w-8 h-8" />
                    </label>
                    <input 
                        id="foto-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={onFileChange}
                    />
                </div>

                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{user.email}</p>
                
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role?.name_role}
                </span>
            </CardContent>
        </Card>
    );
}