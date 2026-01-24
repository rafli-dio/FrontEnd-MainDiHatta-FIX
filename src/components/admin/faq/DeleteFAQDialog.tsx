'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';
import { Trash2 } from 'lucide-react';

interface DeleteFAQDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    faqQuestion: string;
    onConfirm: () => Promise<void>;
    isLoading?: boolean;
}

export default function DeleteFAQDialog({
    open,
    onOpenChange,
    faqQuestion,
    onConfirm,
    isLoading = false
}: DeleteFAQDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
        } finally {
            setIsDeleting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg">
                <div className="flex items-center gap-2 text-red-600 mb-4">
                    <Trash2 className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">Hapus FAQ</h2>
                </div>
                <p className="text-gray-700 mb-4">
                    Apakah Anda yakin ingin menghapus FAQ ini?
                </p>
                <p className="text-sm font-medium text-gray-900 mb-4 p-2 bg-gray-50 rounded">
                    "{faqQuestion}"
                </p>
                <p className="text-xs text-gray-500 mb-6">
                    Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting || isLoading}
                        className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isDeleting || isLoading}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                        {isDeleting || isLoading ? 'Menghapus...' : 'Hapus'}
                    </button>
                </div>
            </div>
        </div>
    );
}
