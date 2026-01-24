'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
    backHref: string;
}

export default function ProfileHeader({ backHref }: ProfileHeaderProps) {
    return (
        <div className="flex items-center gap-4">
            <Link href={backHref}>
                <Button variant="outline" size="icon" className="rounded-full">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Pengaturan Akun</h1>
        </div>
    );
}