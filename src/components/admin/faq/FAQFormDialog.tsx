'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FAQ } from '@/types';
import { Loader2 } from 'lucide-react';

interface FAQFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    faq?: FAQ | null;
    onSubmit: (data: { pertanyaan: string; jawaban: string; is_aktif: boolean }) => Promise<void>;
    isLoading?: boolean;
}

export default function FAQFormDialog({
    open,
    onOpenChange,
    faq,
    onSubmit,
    isLoading = false
}: FAQFormDialogProps) {
    const [pertanyaan, setPertanyaan] = useState(faq?.pertanyaan || '');
    const [jawaban, setJawaban] = useState(faq?.jawaban || '');
    const [isAktif, setIsAktif] = useState(faq?.is_aktif ?? true);

    const isEditing = !!faq;
    const isFormValid = pertanyaan.trim() && jawaban.trim();

    const handleSubmit = async () => {
        if (!isFormValid) return;
        
        try {
            await onSubmit({
                pertanyaan: pertanyaan.trim(),
                jawaban: jawaban.trim(),
                is_aktif: isAktif
            });
            handleClose();
        } catch (error) {
            // Error sudah ditangani oleh hook
        }
    };

    const handleClose = () => {
        setPertanyaan('');
        setJawaban('');
        setIsAktif(true);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit FAQ' : 'Tambah FAQ Baru'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Pertanyaan */}
                    <div className="space-y-2">
                        <Label htmlFor="pertanyaan" className="text-sm font-medium">
                            Pertanyaan <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="pertanyaan"
                            placeholder="Masukkan pertanyaan..."
                            value={pertanyaan}
                            onChange={(e) => setPertanyaan(e.target.value)}
                            disabled={isLoading}
                            className="focus:ring-blue-500"
                        />
                    </div>

                    {/* Jawaban */}
                    <div className="space-y-2">
                        <Label htmlFor="jawaban" className="text-sm font-medium">
                            Jawaban <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="jawaban"
                            placeholder="Masukkan jawaban..."
                            value={jawaban}
                            onChange={(e) => setJawaban(e.target.value)}
                            disabled={isLoading}
                            rows={5}
                            className="focus:ring-blue-500 resize-none"
                        />
                    </div>

                    {/* Status Aktif */}
                    <div className="flex items-center justify-between rounded-lg border p-3 bg-gray-50">
                        <Label className="text-sm font-medium cursor-pointer">
                            Aktif
                        </Label>
                        <Switch
                            checked={isAktif}
                            onCheckedChange={setIsAktif}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!isFormValid || isLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            isEditing ? 'Perbarui' : 'Tambah'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
