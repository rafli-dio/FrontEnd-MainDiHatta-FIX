'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Booking, PaymentMethod } from '@/types';

export function useBookingWizard() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth({ middleware: 'auth' });

    
    const urlDate = searchParams.get('date');
    const initialDate = urlDate ? new Date(urlDate) : undefined;
    
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [bookedDates, setBookedDates] = useState<Date[]>([]); 
    const [bookings, setBookings] = useState<Booking[]>([]); 
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [lapanganId, setLapanganId] = useState<number | null>(null); 
    const [hargaPerJam, setHargaPerJam] = useState(0); 

    const [jamOperasional, setJamOperasional] = useState({ buka: 8, tutup: 23 });

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

    // --- 1. INITIAL FETCH (DEFENSIVE) ---
    useEffect(() => {
        const initData = async () => {
            // Auto-fill form jika user login
            if (user) {
                setFormData(prev => ({
                    ...prev,
                    nama_lengkap: user.name,
                    email: user.email,
                    nomor_telepon: user.nomor_telepon || '',
                    nama_pengirim: user.name 
                }));
            }

            try {
                // Fetch All Data
                const [resLap, resPay, resBook] = await Promise.all([
                    axios.get('/api/lapangans'),
                    axios.get('/api/paymentMethods'),
                    axios.get('/api/bookings')
                ]);

                // --- Helper Safe Array ---
                const getSafeArray = (res: any) => {
                    const data = res.data?.data || res.data;
                    return Array.isArray(data) ? data : [];
                };

                // 1. Lapangan Logic
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

                // 2. Payment Methods Logic
                const payData = getSafeArray(resPay);
                setPaymentMethods(payData.filter((p: any) => p?.is_aktif));

                // 3. Bookings Logic
                const bookData = getSafeArray(resBook);
                
                // Safe filtering booked dates
                const dates = bookData
                    .filter((b: Booking) => b?.status_booking_id !== 4 && b?.tanggal_booking)
                    .map((b: Booking) => new Date(b.tanggal_booking));
                
                setBookedDates(dates);
                setBookings(bookData);

            } catch (error: any) {
                console.error("Gagal memuat data:", error);
                toast.error("Gagal memuat data booking. Silakan refresh.");
                // Reset state agar aman
                setBookedDates([]);
                setBookings([]);
            }
        };
        
        initData();
    }, [user, urlDate]); 

    // --- 3. Helpers (Safe Access) ---
    const getJamSelesai = () => {
        if (!formData.jam_mulai) return '--:--';
        const [hours, minutes] = formData.jam_mulai.split(':').map(Number);
        const endHours = hours + Number(formData.durasi_jam);
        
        return `${String(endHours).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}`;
    };

    const totalHarga = Number(formData.durasi_jam) * hargaPerJam;

    // Cek Bentrok (Safe)
    const checkConflict = () => {
        if (!formData.tanggal_booking || !formData.jam_mulai) return false;

        const dateStr = format(formData.tanggal_booking, 'yyyy-MM-dd');
        const selectedStart = parseInt(formData.jam_mulai.split(':')[0]);
        const selectedEnd = selectedStart + parseInt(formData.durasi_jam);

        const safeBookings = Array.isArray(bookings) ? bookings : [];

        return safeBookings.some(booking => {
            // Safety Check
            if (!booking || !booking.tanggal_booking || !booking.jam_mulai) return false;

            if (booking.tanggal_booking !== dateStr || booking.status_booking_id === 4) return false;

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
                return toast.error("Jadwal Bentrok!", { 
                    description: "Jam yang Anda pilih sudah di-booking orang lain. Silakan pilih jam lain." 
                });
            }
        }

        setStep(prev => prev + 1);
        window.scrollTo(0, 0); 
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        if (!formData.payment_method_id || !formData.bukti_pembayaran || !formData.asal_bank || !formData.nama_pengirim) {
            return toast.error("Lengkapi data pembayaran & upload bukti!");
        }

        if (!lapanganId) return toast.error("ID Lapangan tidak valid.");

   
        if (checkConflict()) {
            return toast.error("Gagal Submit", { description: "Maaf, jadwal baru saja diambil orang lain." });
        }

        setIsSubmitting(true);
        try {
            const bookingPayload = {
                lapangan_id: lapanganId,
                tanggal_booking: format(formData.tanggal_booking!, 'yyyy-MM-dd'),
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
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success("Booking Berhasil!", { description: "Silakan tunggu konfirmasi admin." });
            
            router.push(`/pelanggan/booking/sukses?id=${bookingId}`);

        } catch (error: any) {
            const responseData = error.response?.data;
            const status = error.response?.status;

            if (status === 422) {
                if (responseData.errors?.jam_mulai) {
                    toast.error("Jadwal Bentrok!", { description: responseData.errors.jam_mulai[0] });
                    setStep(2); 
                } else if (responseData.errors?.lapangan_id) {
                      toast.error("Lapangan Tidak Ditemukan", { description: "ID Lapangan salah. Hubungi Admin." });
                } else {
                    toast.error("Validasi Gagal", { description: responseData.message || "Cek inputan Anda." });
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
        
        bookedDates,
        bookings,
        paymentMethods,
        totalHarga,
        
        jamOperasional,
        
        getJamSelesai,
        nextStep,
        prevStep,
        handleSubmit
    };
}