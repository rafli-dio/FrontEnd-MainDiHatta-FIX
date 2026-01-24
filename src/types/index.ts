// AUth

export interface Role {
    id: number;
    name_role: string; 
    created_at?: string;
    updated_at?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    nomor_telepon?: string;
    alamat?: string;
    foto?: string;     
    foto_url?: string; 
    role_id: number;
    role?: Role;      
    created_at?: string;
    updated_at?: string;
}

// Data Master

export interface PaymentMethod {
    id: number;
    nama_metode: string;
    keterangan?: string;
    icon?: string;
    icon_url?: string;
    is_aktif: boolean;
}

export interface Lapangan {
    id: number;
    nama_lapangan: string;
    deskripsi?: string;
    harga_per_jam: number | string;
    jam_buka: string; 
    jam_tutup: string;
    foto?: string;
    foto_url?: string;
    status_aktif: boolean;
}

// Master
export interface StatusBooking {
    id: number;
    nama_status: string; 
}

export interface Booking {
    id: number;
    kode_booking: string;
    user_id: number;
    lapangan_id: number;
    status_booking_id: number;
    payment_method_id: number;
    tanggal_booking: string; 
    jam_mulai: string;       
    jam_selesai: string;     
    durasi_jam?: number;     
    total_harga: number | string;
    jumlah_dp?: number | string;
    bukti_pembayaran?: string;
    bukti_pembayaran_url?: string;
    acara?: string;          
    asal_bank?: string;     
    nama_pengirim?: string; 
    user?: User;
    lapangan?: Lapangan;
    status_booking?: StatusBooking; 
    payment_method?: PaymentMethod;
}

// FAQ
export interface FAQ {
    id: number;
    pertanyaan: string;
    jawaban: string;
    urutan?: number;
    is_aktif: boolean;
    created_at?: string;
    updated_at?: string;
}

// Helper
export interface ApiResponse<T> {
    message?: string;
    data?: T;
    errors?: Record<string, string[]>; 
}