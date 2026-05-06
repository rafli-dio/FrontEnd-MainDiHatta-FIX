'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { forgotPassword, resetPassword } = useAuth();

    // State for flow control
    const [step, setStep] = useState<1 | 2>(1);
    
    // State for Step 1
    const [email, setEmail] = useState('');
    
    // State for Step 2
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    // Global UI state
    const [errors, setErrors] = useState<any>([]);
    const [status, setStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const submitEmailForm = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setErrors([]);
        setStatus(null);

        try {
            await forgotPassword({
                email,
                setErrors,
                setStatus
            });
            // If successful, proceed to step 2
            setStep(2);
        } catch (error) {
            // Errors are handled in useAuth
        } finally {
            setIsLoading(false);
        }
    };

    const submitResetForm = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setErrors([]);
        setStatus(null);

        if (password !== passwordConfirmation) {
            setErrors({ password_confirmation: ['Konfirmasi password tidak cocok.'] });
            setIsLoading(false);
            return;
        }

        try {
            await resetPassword({
                email,
                token,
                password,
                password_confirmation: passwordConfirmation,
                setErrors,
                setStatus
            });
            // On success, wait a bit then redirect to login
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (error) {
            // Errors are handled in useAuth
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row">
            <div className="relative w-full h-[35vh] lg:hidden rounded-b-[40px] overflow-hidden shadow-xl z-10">
                <Image
                    src="/images/gambar-login.png"
                    alt="MainDiHatta Header"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <div className="hidden lg:flex lg:w-1/2 relative bg-black">
                <Image
                    src="/images/gambar-login.png"
                    alt="MainDiHatta Side"
                    fill
                    className="object-cover opacity-90"
                    priority
                />
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16 flex-1 relative">
                
                <div className="absolute top-8 left-8">
                    <Link href="/login" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">Back to Login</span>
                    </Link>
                </div>

                <div className="w-full max-w-md mx-auto space-y-8 mt-8 lg:mt-0">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {step === 1 ? 'Lupa Password' : 'Reset Password'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                            {step === 1 
                                ? 'Masukkan email Anda dan kami akan mengirimkan 6-digit OTP.' 
                                : 'Masukkan kode OTP yang telah dikirim ke email Anda beserta password baru.'}
                        </p>
                        
                        {status && (
                            <div className="mt-4 p-3 bg-green-50 text-green-600 text-sm rounded-md animate-in fade-in slide-in-from-top-2 text-left">
                                {status}
                            </div>
                        )}
                        {errors.general && (
                            <div className="mt-4 p-3 bg-red-50 text-red-600 border border-red-200 text-sm rounded-md animate-in fade-in slide-in-from-top-2 text-left font-medium">
                                {errors.general[0]}
                            </div>
                        )}
                    </div>

                    {step === 1 ? (
                        <form onSubmit={submitEmailForm} className="space-y-5">
                            <div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full px-6 py-3.5 border rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D93F21] focus:border-transparent transition-all text-sm ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-400'}`}
                                    placeholder="Email Address"
                                    required
                                    autoFocus
                                    disabled={isLoading}
                                />
                                {errors.email && (
                                    <p className="mt-1 ml-4 text-xs text-red-600 animate-in slide-in-from-left-1">{errors.email[0]}</p>
                                )}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading || !email}
                                    className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-[#D93F21] hover:bg-[#b9351b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D93F21] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    ) : (
                                        'Kirim Kode OTP'
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={submitResetForm} className="space-y-5">
                            <div>
                                <input
                                    id="token"
                                    type="text"
                                    maxLength={6}
                                    value={token}
                                    onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))} // only digits
                                    className={`w-full px-6 py-3.5 border rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D93F21] focus:border-transparent transition-all text-sm text-center tracking-[0.5em] font-bold ${errors.token ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-400'}`}
                                    placeholder="000000"
                                    required
                                    autoFocus
                                    disabled={isLoading}
                                />
                                {errors.token && (
                                    <p className="mt-1 ml-4 text-xs text-red-600 text-center animate-in slide-in-from-left-1">{errors.token[0]}</p>
                                )}
                            </div>

                            <div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`w-full px-6 pr-12 py-3.5 border rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D93F21] focus:border-transparent transition-all text-sm ${errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-400'}`}
                                        placeholder="Password Baru"
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(s => !s)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 ml-4 text-xs text-red-600 animate-in slide-in-from-left-1">{errors.password[0]}</p>
                                )}
                            </div>

                            <div>
                                <div className="relative">
                                    <input
                                        id="passwordConfirmation"
                                        type={showPasswordConfirmation ? 'text' : 'password'}
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        className={`w-full px-6 pr-12 py-3.5 border rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D93F21] focus:border-transparent transition-all text-sm ${errors.password_confirmation ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-400'}`}
                                        placeholder="Konfirmasi Password Baru"
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirmation(s => !s)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPasswordConfirmation ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="mt-1 ml-4 text-xs text-red-600 animate-in slide-in-from-left-1">{errors.password_confirmation[0]}</p>
                                )}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading || !token || !password || !passwordConfirmation}
                                    className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-[#D93F21] hover:bg-[#b9351b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D93F21] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
