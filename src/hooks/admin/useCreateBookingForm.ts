'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Lapangan, User, PaymentMethod, StatusBooking, Booking } from '@/types';

export function useCreateBookingForm() {
  const router = useRouter();

  // --- STATES ---
  const [isSaving, setIsSaving] = useState(false);
  const [lapangans, setLapangans] = useState<Lapangan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [statuses, setStatuses] = useState<StatusBooking[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]); 

  const [isManualBooking, setIsManualBooking] = useState(false);
  const [maxDuration, setMaxDuration] = useState(12);
  
  const [jamOperasional, setJamOperasional] = useState({ buka: 6, tutup: 23 });

  const [formData, setFormData] = useState<any>({
    nama_pengirim: '',
    user_id: '',
    acara: '',
    tanggal_booking: undefined as Date | undefined,
    lapangan_id: '',
    jam_mulai: '',
    durasi_jam: '1',
    payment_method_id: '',
    status_booking_id: '1',
    jumlah_dp: '',
    asal_bank: '',
    bukti_pembayaran: null,
  });

  // --- 1. INITIAL FETCH & FILTER USER ---
  useEffect(() => {
    const init = async () => {
      try {
        const [resLapangans, resUsers, resPayments, resStatuses, resBookings] = await Promise.all([
          axios.get('/api/lapangans'),
          axios.get('/api/users'),
          axios.get('/api/paymentMethods'),
          axios.get('/api/statusBookings'),
          axios.get('/api/bookings'),
        ]);

        const rawLapangans = resLapangans.data?.data || resLapangans.data || [];
        setLapangans(rawLapangans);
        
        const usersData = resUsers.data?.data || resUsers.data || [];
        
        const pelangganOnly = usersData.filter((u: any) => {
            const byId = u.role_id === 2; 
            const byName = u.role?.name_role?.toLowerCase() === 'pelanggan' || u.role?.name?.toLowerCase() === 'pelanggan';
            
            return byId || byName;
        });
        
        setUsers(pelangganOnly);
        const paymentData = resPayments.data?.data || resPayments.data || [];
        setPaymentMethods(paymentData.filter((p: any) => p.is_aktif));
        
        setStatuses(resStatuses.data?.data || resStatuses.data || []);
        setBookings(resBookings.data?.data || resBookings.data || []);

        if (rawLapangans.length > 0) {
          const firstLap = rawLapangans[0];
          setFormData((f: any) => ({ ...f, lapangan_id: String(firstLap.id) }));
          if (firstLap.jam_buka && firstLap.jam_tutup) {
             setJamOperasional({
                 buka: parseInt(firstLap.jam_buka.split(':')[0]),
                 tutup: parseInt(firstLap.jam_tutup.split(':')[0])
             });
          }
        }
      } catch (e: any) {
        console.error('init create booking form', e);
        toast.error(e?.response?.data?.message || 'Gagal memuat data form booking.');
      }
    };

    init();
  }, []);

  useEffect(() => {
      if (formData.lapangan_id && lapangans.length > 0) {
          const selectedLap = lapangans.find(l => String(l.id) === String(formData.lapangan_id));
          if (selectedLap && selectedLap.jam_buka && selectedLap.jam_tutup) {
              setJamOperasional({
                  buka: parseInt(selectedLap.jam_buka.split(':')[0]),
                  tutup: parseInt(selectedLap.jam_tutup.split(':')[0])
              });
          }
      }
  }, [formData.lapangan_id, lapangans]);

  useEffect(() => {
      if (!formData.jam_mulai || !formData.tanggal_booking || !formData.lapangan_id) {
          setMaxDuration(5); 
          return;
      }

      const dateStr = format(formData.tanggal_booking, 'yyyy-MM-dd');
      const currentStartHour = parseInt(formData.jam_mulai.split(':')[0]);
      const selectedLapId = parseInt(String(formData.lapangan_id));

      const upcomingBookings = bookings
          .filter(b => 
              b.tanggal_booking === dateStr && 
              b.status_booking_id !== 4 &&
              b.lapangan_id === selectedLapId &&
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

      gap = Math.max(1, Math.min(gap, 12));
      setMaxDuration(gap);

      if (parseInt(formData.durasi_jam) > gap) {
          setFormData((prev: any) => ({ ...prev, durasi_jam: String(gap) }));
      }

  }, [formData.jam_mulai, formData.tanggal_booking, formData.lapangan_id, bookings, jamOperasional]);

  // --- HELPERS ---
  const getJamSelesai = () => {
    if (!formData.jam_mulai) return '--:--';
    const [hours, minutes] = (formData.jam_mulai || '').split(':').map(Number);
    const endHours = hours + Number(formData.durasi_jam || 0);
    return `${String(endHours).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}`;
  };

  const getEstimasiHarga = () => {
    const lap = lapangans.find(l => String(l.id) === String(formData.lapangan_id));
    const harga = lap ? Number(lap.harga_per_jam || 0) : 0;
    return harga * Number(formData.durasi_jam || 0);
  };

  const getBookedDates = () => {
    return bookings
        .filter(b => b.status_booking_id !== 4) 
        .map(b => new Date(b.tanggal_booking));
  };

  const isTimeSlotBooked = (time: string) => {
      if (!formData.tanggal_booking || !formData.lapangan_id) return false;
      const selectedDateStr = format(formData.tanggal_booking, 'yyyy-MM-dd');
      const selectedLapId = parseInt(String(formData.lapangan_id));
      const [slotHour] = time.split(':').map(Number);
      
      return bookings.some(b => {
          if(b.tanggal_booking !== selectedDateStr || b.lapangan_id !== selectedLapId || b.status_booking_id === 4) return false;
          const [startH] = b.jam_mulai.split(':').map(Number);
          let endH;
          if(b.jam_selesai) {
             endH = parseInt(b.jam_selesai.split(':')[0]);
          } else {
             endH = startH + (b.durasi_jam ? Number(b.durasi_jam) : 1);
          }
          return slotHour >= startH && slotHour < endH;
      });
  };

  const isTimePassed = (time: string) => {
    if (!formData.tanggal_booking) return false;
    const now = new Date();
    const selectedDate = new Date(formData.tanggal_booking);
    const isToday =
      now.getDate() === selectedDate.getDate() &&
      now.getMonth() === selectedDate.getMonth() &&
      now.getFullYear() === selectedDate.getFullYear();

    if (isToday) {
      const [slotHour] = time.split(':').map(Number);
      const currentHour = now.getHours();
      return slotHour <= currentHour; 
    }
    return false;
  };

  const handleSubmit = async () => {
    if (!formData.lapangan_id || !formData.tanggal_booking || !formData.jam_mulai) {
      return toast.error('Isi semua field jadwal (lapangan, tanggal, jam mulai).');
    }

    if (isManualBooking) {
      if (!formData.nama_pengirim) return toast.error('Isi nama pelanggan untuk booking manual.');
    } else {
      if (!formData.user_id) return toast.error('Pilih member / user untuk booking.');
    }

    if (isTimeSlotBooked(formData.jam_mulai)) {
        return toast.error('Jam yang dipilih sudah terisi. Silakan pilih jam lain.');
    }

    setIsSaving(true);

    try {
      const payload: any = {
        lapangan_id: parseInt(String(formData.lapangan_id)),
        tanggal_booking: format(formData.tanggal_booking, 'yyyy-MM-dd'),
        jam_mulai: formData.jam_mulai,
        durasi_jam: parseInt(String(formData.durasi_jam || '1')),
        payment_method_id: formData.payment_method_id ? parseInt(String(formData.payment_method_id)) : undefined,
        acara: formData.acara || undefined,
        asal_bank: formData.asal_bank || undefined,
        nama_pengirim: formData.nama_pengirim || undefined,
        jumlah_dp: formData.jumlah_dp ? parseInt(String(formData.jumlah_dp)) : undefined,
        status_booking_id: formData.status_booking_id ? parseInt(String(formData.status_booking_id)) : 1,
      };

      if (!isManualBooking && formData.user_id) {
          payload.user_id = parseInt(String(formData.user_id));
      }

      const res = await axios.post('/api/bookings', payload);
      const bookingId = res.data?.data?.id || res.data.id;

      if (formData.bukti_pembayaran) {
          const fileData = new FormData();
          fileData.append('bukti_pembayaran', formData.bukti_pembayaran);
          if (formData.jumlah_dp) fileData.append('jumlah_dp', formData.jumlah_dp);
          await axios.post(`/api/bookings/${bookingId}/payment`, fileData);
      }

      if (formData.status_booking_id && String(formData.status_booking_id) !== '1' && String(formData.status_booking_id) !== '2') {
          await axios.patch(`/api/bookings/${bookingId}/status`, {
              status_booking_id: parseInt(String(formData.status_booking_id))
          });
      }

      toast.success('Booking berhasil dibuat.');
      router.push('/admin/bookings');

    } catch (error: any) {
      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 422 && data?.errors) {
        const errorsArr = Object.values(data.errors) as string[][];
        const firstErr = errorsArr?.[0]?.[0];
        toast.error(firstErr || data.message || 'Validasi gagal.');
      } else {
        toast.error(data?.message || 'Gagal menyimpan booking.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    lapangans,
    users, 
    paymentMethods,
    statuses,
    isManualBooking,
    setIsManualBooking,
    formData,
    setFormData,
    getJamSelesai,
    getEstimasiHarga,
    handleSubmit,
    getBookedDates,   
    isTimeSlotBooked, 
    maxDuration,
    isTimePassed, 
    jamOperasional 
  };
}