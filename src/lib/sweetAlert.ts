import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/dist/sweetalert2.css'

export const sweetAlert = {
    // Konfirmasi Delete
    confirmDelete: async (title: string = 'Hapus?', message: string = 'Data akan dihapus dan tidak dapat dikembalikan') => {
        return await Swal.fire({
            title,
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });
    },

    // Konfirmasi Umum
    confirm: async (title: string, message: string, iconType: 'question' | 'warning' = 'question', confirmText: string = 'Lanjutkan', cancelText: string = 'Batal') => {
        return await Swal.fire({
            title,
            text: message,
            icon: iconType,
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#6b7280',
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            reverseButtons: true
        });
    },

    // Success Alert
    success: async (title: string = 'Berhasil!', message: string = '') => {
        return await Swal.fire({
            title,
            text: message,
            icon: 'success',
            confirmButtonColor: '#10b981',
            confirmButtonText: 'OK'
        });
    },

    // Error Alert
    error: async (title: string = 'Error!', message: string = '') => {
        return await Swal.fire({
            title,
            text: message,
            icon: 'error',
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'OK'
        });
    },

    // Info Alert
    info: async (title: string, message: string = '') => {
        return await Swal.fire({
            title,
            text: message,
            icon: 'info',
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'OK'
        });
    },

    // Loading Alert
    loading: (title: string = 'Sedang memproses...', message: string = 'Mohon tunggu') => {
        return Swal.fire({
            title,
            html: message,
            icon: 'info',
            allowOutsideClick: false,
            didOpen: (modal) => {
                Swal.showLoading();
            }
        });
    },

    // Close loading
    closeLoading: () => {
        return Swal.close();
    },

    // Konfirmasi Logout
    confirmLogout: async () => {
        return await Swal.fire({
            title: 'Logout?',
            text: 'Apakah Anda yakin ingin logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Logout',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });
    },

    // Konfirmasi Action dengan Custom Icon
    confirmAction: async (title: string, message: string, actionText: string = 'Lanjutkan', iconColor: string = 'warning') => {
        return await Swal.fire({
            title,
            text: message,
            icon: iconColor as any,
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#6b7280',
            confirmButtonText: actionText,
            cancelButtonText: 'Batal',
            reverseButtons: true
        });
    }
};
