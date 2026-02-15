'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Booking, PaymentMethod } from '@/types';

type MaintenanceRange = {
    from: Date;
    to: Date;
    keterangan?: string;
};

export function useBookingWizard() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth({ middleware: 'auth' });

    const urlDate = searchParams.get('date');
    const initialDate = urlDate ? new Date(urlDate) : undefined;
    
    // --- STATE ---
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [bookedDates, setBookedDates] = useState<Date[]>([]); 
    const [bookings, setBookings] = useState<Booking[]>([]); 
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [lapanganId, setLapanganId] = useState<number | null>(null); 
    const [hargaPerJam, setHargaPerJam] = useState(0); 
    const [jamOperasional, setJamOperasional] = useState({ buka: 8, tutup: 23 });

    const [maintenanceDates, setMaintenanceDates] = useState<MaintenanceRange[]>([]);
    const [maxDuration, setMaxDuration] = useState(12);

    const [formData, setFormData] = useState({
        nama_lengkap: '',
        email: '',
        nomor_telepon: '',
        nama_club: '', 
        tanggal_booking: initialDate, 
        jam_mulai: '',
        durasi_jam: '1',
        payment_method_id: '',
        asal_bank: '',      
        nama_pengirim: '',  
        jumlah_dp: '',
        bukti_pembayaran: null as File | null,
    });

    // --- FETCH DATA ---
    const fetchData = useCallback(async () => {
        try {
            const [resLap, resPay, resBook, resMaint] = await Promise.all([
                axios.get('/api/lapangans'),
                axios.get('/api/paymentMethods'),
                axios.get('/api/bookings'),
                axios.get('/api/public/maintenances')
            ]);

            const getSafeArray = (res: any) => {
                const data = res.data?.data || res.data;
                return Array.isArray(data) ? data : [];
            };

            // 1. Lapangan
            const lapData = getSafeArray(resLap);
            if (lapData.length > 0) {
                const lap = lapData[0]; 
                setLapanganId(lap.id);
                setHargaPerJam(Number(lap.harga_per_jam));

                if (lap.jam_buka && lap.jam_tutup) {
                    setJamOperasional({
                        buka: parseInt(lap.jam_buka.split(':')[0]), 
                        tutup: parseInt(lap.jam_tutup.split(':')[0]) 
                    });
                }
            }

            // 2. Payment Methods
            const payData = getSafeArray(resPay);
            setPaymentMethods(payData.filter((p: any) => p?.is_aktif));

            // 3. Bookings
            const bookData = getSafeArray(resBook);
            
            // Filter booking aktif:
            // - Bukan Status 4 (Batal User)
            // - Bukan Status 6 (Dibatalkan Admin/Maintenance) -> Karena slot ini sudah dicover oleh Maintenance Date
            const activeBookings = bookData.filter((b: Booking) => 
                b?.status_booking_id !== 4 && 
                b?.status_booking_id !== 6 && 
                b?.tanggal_booking
            );

            const dates = activeBookings.map((b: Booking) => new Date(b.tanggal_booking));
            
            setBookedDates(dates);
            setBookings(bookData); 

        } catch (error) {
            console.error("Gagal memuat data:", error);
            toast.error("Gagal memuat data booking. Silakan refresh.");
        }
        
        try {
            const resMaint = await axios.get('/api/public/maintenances');
            const maintData = resMaint.data?.data || [];
            const liburRanges = maintData.map((m: any) => ({
                from: new Date(m.start_date),
                to: new Date(m.end_date),
                keterangan: m.keterangan 
            }));
            setMaintenanceDates(liburRanges);
        } catch (error) {
            console.error("Gagal load maintenance:", error);
        }

    }, []);

    // Initial Load & User Autofill
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                nama_lengkap: user.name,
                email: user.email,
                nomor_telepon: user.nomor_telepon || '',
                nama_pengirim: user.name 
            }));
        }
        fetchData();
    }, [user, fetchData]); 


    useEffect(() => {
        if (!formData.jam_mulai || !formData.tanggal_booking || !lapanganId) {
            setMaxDuration(12); 
            return;
        }
    
        const dateStr = format(formData.tanggal_booking, 'yyyy-MM-dd');
        const currentStartHour = parseInt(formData.jam_mulai.split(':')[0]);
        const selectedLapId = lapanganId;
    
        const safeBookings = Array.isArray(bookings) ? bookings : [];
        const upcomingBookings = safeBookings
            .filter(b => 
                b?.tanggal_booking === dateStr && 
                b?.status_booking_id !== 4 && 
                b?.status_booking_id !== 6 && 
                b?.lapangan_id === selectedLapId &&
                parseInt(b.jam_mulai.split(':')[0]) > currentStartHour
            )
            .sort((a, b) => parseInt(a.jam_mulai) - parseInt(b.jam_mulai));
    
        const closingHour = jamOperasional.tutup; 
        let gap = 0;
    
        if (upcomingBookings.length > 0) {
            const nextBookingStart = parseInt(upcomingBookings[0].jam_mulai.split(':')[0]);
            gap = nextBookingStart - currentStartHour;
        } else {
            gap = closingHour - currentStartHour;
        }
    
        gap = Math.max(1, gap);
        setMaxDuration(gap);
    
        if (parseInt(formData.durasi_jam) > gap) {
            setFormData(prev => ({ ...prev, durasi_jam: String(gap) }));
        }
    
    }, [formData.jam_mulai, formData.tanggal_booking, lapanganId, bookings, jamOperasional]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const getJamSelesai = () => {
        if (!formData.jam_mulai) return '--:--';
        const [hours, minutes] = formData.jam_mulai.split(':').map(Number);
        const endHours = hours + Number(formData.durasi_jam);
        return `${String(endHours).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}`;
    };

    const totalHarga = Number(formData.durasi_jam) * hargaPerJam;

    const checkConflict = () => {
        if (!formData.tanggal_booking) return false;

        const dateStr = format(formData.tanggal_booking, 'yyyy-MM-dd');
        
        const bookingDate = new Date(formData.tanggal_booking);
        bookingDate.setHours(0, 0, 0, 0);

        const isMaintenance = maintenanceDates.some(range => {
            const start = new Date(range.from);
            const end = new Date(range.to);
            start.setHours(0,0,0,0);
            end.setHours(23,59,59,999);
            
            return bookingDate >= start && bookingDate <= end;
        });

        if (isMaintenance) return true;

        if (!formData.jam_mulai) return false;

        const selectedStart = parseInt(formData.jam_mulai.split(':')[0]);
        const selectedEnd = selectedStart + parseInt(formData.durasi_jam);
        const safeBookings = Array.isArray(bookings) ? bookings : [];

        return safeBookings.some(booking => {
            if (!booking || !booking.tanggal_booking || !booking.jam_mulai) return false;
            
            if (booking.tanggal_booking !== dateStr || 
                booking.status_booking_id === 4 || 
                booking.status_booking_id === 6) return false;

            const existingStart = parseInt(booking.jam_mulai.split(':')[0]);
            
            let existingEnd;
            if (booking.jam_selesai) {
                existingEnd = parseInt(booking.jam_selesai.split(':')[0]);
            } else {
                existingEnd = existingStart + Number(booking.durasi_jam || 1);
            }

            return (selectedStart < existingEnd && selectedEnd > existingStart);
        });
    };

    // --- NAVIGATION ---
    const nextStep = () => {
        if (step === 1) {
            if (!formData.nama_club) return toast.error("Mohon isi Nama Club!");
            if (!formData.nama_lengkap) return toast.error("Mohon isi Nama Lengkap!");
            if (!formData.nomor_telepon) return toast.error("Mohon isi Nomor WhatsApp!");
        }
        
        if (step === 2) {
            if (!formData.tanggal_booking || !formData.jam_mulai) return toast.error("Pilih jadwal main!");
            if (!lapanganId) return toast.error("Data lapangan belum dimuat. Refresh halaman.");
            
            if (checkConflict()) {
                return toast.error("Jadwal Tidak Tersedia!", { 
                    description: "Tanggal sedang tutup (Maintenance) atau jam sudah dibooking." 
                });
            }
        }

        setStep(prev => prev + 1);
        window.scrollTo(0, 0); 
    };

    const prevStep = () => setStep(prev => prev - 1);

    // --- SUBMIT ---
    const handleSubmit = async () => {
        if (!formData.payment_method_id || !formData.bukti_pembayaran || !formData.asal_bank || !formData.nama_pengirim) {
            return toast.error("Lengkapi data pembayaran & upload bukti!");
        }

        if (!lapanganId || !formData.tanggal_booking) return toast.error("Data booking tidak valid.");

        // Cek konflik terakhir sebelum kirim
        if (checkConflict()) {
            return toast.error("Gagal Submit", { description: "Jadwal tidak tersedia (Maintenance/Bentrok)." });
        }

        setIsSubmitting(true);
        try {
            const bookingPayload = {
                lapangan_id: lapanganId,
                tanggal_booking: format(formData.tanggal_booking, 'yyyy-MM-dd'),
                jam_mulai: formData.jam_mulai,
                durasi_jam: parseInt(formData.durasi_jam), 
                payment_method_id: parseInt(formData.payment_method_id),
                acara: formData.nama_club,
                asal_bank: formData.asal_bank,
                nama_pengirim: formData.nama_pengirim
            };

            const resBooking = await axios.post('/api/bookings', bookingPayload);
            const bookingId = resBooking.data?.data?.id || resBooking.data.id;

            const paymentData = new FormData();
            paymentData.append('jumlah_dp', formData.jumlah_dp || totalHarga.toString());
            paymentData.append('bukti_pembayaran', formData.bukti_pembayaran!);

            await axios.post(`/api/bookings/${bookingId}/payment`, paymentData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success("Booking Berhasil!", { description: "Silakan tunggu konfirmasi admin." });
            router.push(`/pelanggan/booking/sukses?id=${bookingId}`);

        } catch (error: any) {
            const responseData = error.response?.data;
            const status = error.response?.status;

            if (status === 422) {
                fetchData(); 

                if (responseData.errors?.jam_mulai) {
                    toast.error("Jadwal Bentrok!", { description: responseData.errors.jam_mulai[0] });
                    setStep(2); 
                } else if (responseData.errors?.lapangan_id) {
                      toast.error("Lapangan Error", { description: "Hubungi Admin." });
                } else if (responseData.errors?.status_booking_id) { 
                    toast.error("Jadwal Tutup", { description: "Lapangan sedang Maintenance." });
                    setStep(2);
                } else {
                    toast.error("Validasi Gagal", { description: responseData.message });
                }
            } else {
                toast.error(responseData?.message || "Gagal memproses booking.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        step,
        isSubmitting,
        formData,
        setFormData,
        handleChange,
        bookedDates,
        bookings,
        paymentMethods,
        totalHarga,
        jamOperasional,
        maintenanceDates, 
        maxDuration,
        getJamSelesai,
        nextStep,
        prevStep,
        handleSubmit
    };
}