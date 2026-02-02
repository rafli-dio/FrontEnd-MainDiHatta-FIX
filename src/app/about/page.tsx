'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Phone, Trophy, Users, Star, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans mt-[50px]">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center bg-black overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0  bg-cover bg-center opacity-50 grayscale hover:grayscale-0 transition-all duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
          <span className="inline-block py-1 px-3 rounded-full bg-[#D93F21]/20 border border-[#D93F21] text-[#D93F21] text-xs md:text-sm font-bold tracking-wider uppercase backdrop-blur-sm">
            Est. 2022
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Main Basket <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D93F21] to-orange-500">
              Tanpa Batas.
            </span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Hatta Sport Center hadir sebagai wadah bagi komunitas basket untuk menyalurkan bakat, 
            berlatih, dan berkompetisi di fasilitas terbaik.
          </p>
        </div>
      </section>

      {/* --- MISSION & VISION SECTION --- */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Kolom Kiri: Teks */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Lebih Dari Sekadar <span className="text-[#D93F21]">Lapangan.</span>
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Kami percaya bahwa olahraga adalah jembatan untuk membangun komunitas yang sehat dan solid. 
              MainDiHatta.id didirikan dengan visi mempermudah akses penyewaan lapangan olahraga melalui teknologi, 
              menghapus kerumitan booking manual, dan memberikan kepastian jadwal bagi para pemain.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-50 rounded-xl">
                  <Zap className="w-6 h-6 text-[#D93F21]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Booking Cepat & Mudah</h4>
                  <p className="text-sm text-gray-500 mt-1">Sistem reservasi online 24/7 yang real-time dan transparan.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-50 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-[#D93F21]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Fasilitas Terawat</h4>
                  <p className="text-sm text-gray-500 mt-1">Lantai lapangan standar kompetisi dan pencahayaan optimal.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Kolom Kanan: Gambar */}
          <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl group bg-gray-100">
             <Image 
                src="/images/gambar-basket.jpg" // Pastikan file ini ada di folder public
                alt="Fasilitas Lapangan Basket"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-[#D93F21]/10 group-hover:bg-transparent transition-colors duration-500"></div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="bg-gray-50 py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem icon={<Users />} count="500+" label="Member Aktif" />
            <StatItem icon={<CalendarIcon />} count="1000+" label="Jam Ter-Booking" />
            <StatItem icon={<Trophy />} count="50+" label="Turnamen Digelar" />
            <StatItem icon={<Star />} count="4.8" label="Rating Pengguna" />
          </div>
        </div>
      </section>

      {/* --- LOCATION & INFO SECTION --- */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Lokasi & Kontak</h2>
          <p className="text-gray-500 mt-2">Kunjungi kami langsung atau hubungi untuk info lebih lanjut.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card Alamat */}
          <Card className="border-none shadow-lg hover:-translate-y-1 transition-transform duration-300">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl">Alamat</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                <strong>HATTA SPORT CENTER</strong><br/>
                Jl. Rajawali Raya, RT.03/RW.II, Nilagraha,<br/>
                Gonilan, Kec. Kartasura,<br/>
                Kabupaten Sukoharjo, Jawa Tengah 57169
              </p>
            </CardContent>
          </Card>

          {/* Card Jam Operasional */}
          <Card className="border-none shadow-lg hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
            <div className="absolute top-0 w-full h-1 bg-[#D93F21]"></div>
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-[#D93F21]">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl">Jam Operasional</h3>
              <div className="text-gray-500 text-sm space-y-1">
                <p><span className="font-medium text-gray-900">Senin - Minggu:</span></p>
                <p>07:00 - 22:00 WIB</p>
              </div>
            </CardContent>
          </Card>

          {/* Card Kontak */}
          <Card className="border-none shadow-lg hover:-translate-y-1 transition-transform duration-300">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl">Hubungi Kami</h3>
              <p className="text-gray-500 text-sm">
                WhatsApp Admin: <br/>
                <a href="https://wa.me/628112654765" className="text-green-600 font-bold hover:underline mt-1 block">
                  +62 811-2654-765
                </a>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Google Maps */}
        <div className="mt-12 w-full h-[400px] bg-gray-200 rounded-3xl overflow-hidden relative shadow-inner">
           <iframe 
             src="https://maps.google.com/maps?q=HATTA+SPORT+CENTER+Sukoharjo&t=&z=15&ie=UTF8&iwloc=&output=embed"
             width="100%" 
             height="100%" 
             style={{ border: 0 }} 
             allowFullScreen 
             loading="lazy" 
             referrerPolicy="no-referrer-when-downgrade"
             className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
           ></iframe>
        </div>
      </section>

      {/* --- CTA BOTTOM --- */}
      <section className="py-20 bg-[#1a1a1a] text-white text-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/pattern.png')] opacity-5"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold">Siap Untuk Bermain?</h2>
          <p className="text-gray-400 text-lg">
            Jangan biarkan lapangan penuh menghalangi hobi Anda. Amankan jadwal main sekarang juga.
          </p>
          <div className="pt-4">
            <Link href="/pelanggan/booking/create">
              <Button className="bg-[#D93F21] hover:bg-[#b9351b] h-14 px-10 rounded-full text-lg font-bold shadow-lg shadow-orange-900/20 transform hover:-translate-y-1 transition-all">
                Booking Lapangan Sekarang <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

// --- Helper Components ---
function StatItem({ icon, count, label }: { icon: any, count: string, label: string }) {
  return (
    <div className="flex flex-col items-center space-y-2 group">
      <div className="p-3 bg-white border border-gray-200 rounded-full text-gray-400 group-hover:text-[#D93F21] group-hover:border-[#D93F21] transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-3xl font-extrabold text-gray-900">{count}</h3>
      <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">{label}</p>
    </div>
  );
}

function CalendarIcon(props: any) {
    return (
        <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    )
}