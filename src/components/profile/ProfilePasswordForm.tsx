'use client';

import { FormEvent } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";

interface ProfilePasswordFormProps {
    passData: any;
    setPassData: (data: any) => void;
    onSubmit: (e: FormEvent) => void;
    isSaving: boolean;
}

export default function ProfilePasswordForm({ passData, setPassData, onSubmit, isSaving }: ProfilePasswordFormProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Keamanan</CardTitle>
                <CardDescription>Pastikan password Anda kuat dan aman.</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Password Saat Ini</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input type="password" className="pl-9" value={passData.current_password} onChange={e => setPassData({...passData, current_password: e.target.value})} required />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Password Baru</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input type="password" className="pl-9" value={passData.password} onChange={e => setPassData({...passData, password: e.target.value})} required />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Konfirmasi Password Baru</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input type="password" className="pl-9" value={passData.password_confirmation} onChange={e => setPassData({...passData, password_confirmation: e.target.value})} required />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSaving} className="bg-gray-900 hover:bg-black">
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : 'Update Password'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}