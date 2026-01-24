'use client';

import { useState, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import axios from '@/lib/axios';
import { Toaster } from '@/components/ui/sonner'; 

export default function RegisterPage() {
    const router = useRouter();
    
    // State Form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    // State UI
    const [errors, setErrors] = useState<any>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    // Show/Hide Password
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Hook Auth
    const { user } = useAuth({ middleware: 'guest' });

    useEffect(() => {
        if (user && !isSuccess) {
            if (user.role?.name_role === 'Pelanggan') {
                router.push('/pelanggan/home');
            } else {
                router.push('/admin/dashboard'); 
            }
        }
    }, [user, router, isSuccess]);

    const submitForm = async (event: FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors([]);

        try {
            // 1. CSRF Handshake
            await axios.get('/sanctum/csrf-cookie');

            // 2. Register Call
            await axios.post('/api/register', {
                name,
                email,
                nomor_telepon: phone,
                alamat: address,
                password,
                password_confirmation: passwordConfirmation,
            });

            // 3. SUKSES!
            setIsSuccess(true); 
            toast.success("Registrasi berhasil! Akun Anda telah dibuat.", {
                description: "Silakan login untuk melanjutkan.",
                duration: 5000,
            });
            
            // Reset form
            setName('');
            setEmail('');
            setPhone('');
            setAddress('');
            setPassword('');
            setPasswordConfirmation('');

        } catch (error: any) {
            // 4. Handle Error
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
                toast.error("Gagal Mendaftar", {
                    description: "Mohon periksa kembali inputan Anda."
                });
            } else {
                console.error(error);
                toast.error("Terjadi kesalahan sistem.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row">
            
            <Toaster position="top-center" />

            <div className="hidden lg:flex w-1/2 relative bg-gray-900">
                <Image
                    src="/images/register-bg.png"
                    alt="Lapangan Basket"
                    fill
                    className="object-cover opacity-90"
                    priority
                    sizes="50vw"
                />
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col h-screen overflow-y-auto">
                
                <div className="p-6 md:p-8 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
                    <Link 
                        href="/login" 
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#D93F21] hover:bg-gray-300 text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                </div>

                <div className="flex-1 flex flex-col justify-center px-8 md:px-20 pb-12">
                    <div className="w-full max-w-md mx-auto space-y-8">
                        
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Registrasi <span className="text-[#D93F21]">MainDi</span>Hatta.id
                            </h2>
                        </div>

                        <form onSubmit={submitForm} className="space-y-5">
                            
                            {/* Nama Lengkap */}
                            <div className="space-y-1">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-5 py-3 border border-gray-400 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                                    placeholder="Nama Lengkap"
                                    required
                                />
                                {errors.name && <p className="text-xs text-red-600 ml-4">{errors.name[0]}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-3 border border-gray-400 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                                    placeholder="Email"
                                    required
                                />
                                {errors.email && <p className="text-xs text-red-600 ml-4">{errors.email[0]}</p>}
                            </div>

                            {/* Nomor Telepon */}
                            <div className="space-y-1">
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-5 py-3 border border-gray-400 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                                    placeholder="Nomor Telepon"
                                    required
                                />
                                {errors.nomor_telepon && <p className="text-xs text-red-600 ml-4">{errors.nomor_telepon[0]}</p>}
                            </div>

                            {/* Alamat */}
                            <div className="space-y-1">
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full px-5 py-3 border border-gray-400 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                                    placeholder="Alamat"
                                    required
                                />
                                {errors.alamat && <p className="text-xs text-red-600 ml-4">{errors.alamat[0]}</p>}
                            </div>

                            {/* Password */}
                            <div className="relative space-y-1">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 pr-12 py-3 border border-gray-400 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                                    placeholder="Password"
                                    required
                                    disabled={isSubmitting}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(s => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    disabled={isSubmitting}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>

                                {errors.password && <p className="text-xs text-red-600 ml-4">{errors.password[0]}</p>}
                            </div>

                            {/* Konfirmasi Password */}
                            <div className="relative space-y-1">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className="w-full px-5 pr-12 py-3 border border-gray-400 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                                    placeholder="Konfirmasi Password"
                                    required
                                    disabled={isSubmitting}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(s => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
                                    disabled={isSubmitting}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>

                            {/* Tombol Submit */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 px-4 bg-[#D93F21] hover:bg-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform active:scale-[0.98] transition-all duration-200 flex justify-center items-center disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Mendaftar...
                                        </>
                                    ) : (
                                        'Submit'
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}