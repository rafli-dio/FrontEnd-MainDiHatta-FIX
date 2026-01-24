import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Booking } from '@/types';

// Format Rupiah
export const formatRupiah = (num: number | string) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(num));

// Format Tanggal
export const formatDate = (dateString: string) => 
    format(new Date(dateString), 'EEEE, dd MMMM yyyy', { locale: localeId });

// Hitung durasi booking
export const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    return endHour - startHour;
};

// Get status badge config
export const getStatusConfig = (statusId: number) => {
    const statusMap: Record<number, { label: string; bgColor: string; textColor: string; icon: string }> = {
        1: { label: 'Menunggu Pembayaran', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', icon: 'AlertCircle' },
        2: { label: 'Menunggu Konfirmasi', bgColor: 'bg-blue-100', textColor: 'text-blue-800', icon: 'Clock' },
        3: { label: 'Terkonfirmasi', bgColor: 'bg-green-100', textColor: 'text-green-800', icon: 'CheckCircle2' },
        4: { label: 'Dibatalkan', bgColor: 'bg-red-500', textColor: 'text-white', icon: 'Ban' },
        5: { label: 'Selesai', bgColor: 'bg-gray-100', textColor: 'text-gray-800', icon: 'CheckCircle2' },
    };
    return statusMap[statusId] || { label: 'Unknown', bgColor: 'bg-gray-100', textColor: 'text-gray-800', icon: 'HelpCircle' };
};

// Download ticket PDF
export const downloadTicketPDF = (booking: Booking) => {
    const doc = new jsPDF();
    const durasi = calculateDuration(booking.jam_mulai, booking.jam_selesai);

    // Header
    doc.setFillColor(217, 63, 33);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('E-TICKET BOOKING', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Hatta Sport Center', 105, 28, { align: 'center' });

    // Kode Booking
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Kode Booking: ${booking.kode_booking}`, 105, 55, { align: 'center' });

    // Informasi Tabel
    const tableData = [
        ['Nama Penyewa', booking.user?.name || booking.nama_pengirim || '-'],
        ['Lapangan', booking.lapangan?.nama_lapangan || '-'],
        ['Tanggal Main', formatDate(booking.tanggal_booking)],
        ['Jam', `${booking.jam_mulai} - ${booking.jam_selesai} (${durasi} Jam)`],
        ['Kegiatan/Club', booking.acara || '-'],
        ['Status', 'LUNAS / TERKONFIRMASI'],
    ];

    autoTable(doc, {
        startY: 65,
        head: [['Detail', 'Keterangan']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [50, 50, 50] },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('* Tunjukkan tiket ini kepada petugas lapangan.', 14, finalY + 10);
    doc.text('* Harap datang 15 menit sebelum jadwal main.', 14, finalY + 16);
    
    doc.save(`Ticket-${booking.kode_booking}.pdf`);
};
