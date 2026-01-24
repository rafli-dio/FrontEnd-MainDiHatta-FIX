'use client';

import { useState, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<any>([]);
    const [status, setStatus] = useState<string | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login, user } = useAuth({
        middleware: 'guest',
    });

    useEffect(() => {
        let mounted = true;
        const redirect = async () => {
            if (!user) return;
            const roleName = user.role?.name_role;
            const path = roleName === 'Admin' ? '/admin/dashboard' : roleName === 'Karyawan' ? '/karyawan/dashboard' : roleName === 'Pelanggan' ? '/pelanggan/home' : '/';
            try {
                await router.push(path);
            } finally {
                if (mounted) setIsLoggingIn(false);
            }
        };
        redirect();
        return () => { mounted = false; };
    }, [user, router]);

    // Submit Handler
    const submitForm = async (event: FormEvent) => {
        event.preventDefault();
        
        setIsLoggingIn(true); 
        
        setErrors([]); 

        try {
            await login({ 
                email, 
                password, 
                setErrors: (errs) => { setErrors(errs); }, 
                setStatus 
            });
        } catch (error) {
            setIsLoggingIn(false);
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

            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16 flex-1">
                <div className="w-full max-w-md mx-auto space-y-8">
                    
                    <div className="text-center mb-8 mt-4 lg:mt-0">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Login <span className="text-[#D93F21]">MainDi</span>Hatta.id
                        </h2>
                        {status && (
                            <div className="mt-4 p-3 bg-green-50 text-green-600 text-sm rounded-md animate-in fade-in slide-in-from-top-2">
                                {status}
                            </div>
                        )}
                    </div>

                    <form onSubmit={submitForm} className="space-y-5">
                        
                        <div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-6 py-3.5 border rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D93F21] focus:border-transparent transition-all text-sm ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-400'}`}
                                placeholder="Email"
                                required
                                autoFocus
                                disabled={isLoggingIn} 
                            />
                            {errors.email && (
                                <p className="mt-1 ml-4 text-xs text-red-600 animate-in slide-in-from-left-1">{errors.email[0]}</p>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-6 pr-12 py-3.5 border rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D93F21] focus:border-transparent transition-all text-sm ${errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-400'}`}
                                placeholder="Password"
                                required
                                disabled={isLoggingIn} 
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(s => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                disabled={isLoggingIn}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>

                            {errors.password && (
                                <p className="mt-1 ml-4 text-xs text-red-600 animate-in slide-in-from-left-1">{errors.password[0]}</p>
                            )}
                        </div>

                        <div className="flex items-center px-2">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-[#D93F21] focus:ring-[#D93F21] border-gray-300 rounded-full"
                                disabled={isLoggingIn}
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">
                                Remember me
                            </label>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoggingIn}
                                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-[#D93F21] hover:bg-[#b9351b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D93F21] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoggingIn ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Masuk...
                                    </>
                                ) : (
                                    'Sing In'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-xs text-gray-500">
                            Don't have acount ?{' '}
                            <Link href="/register" className={`font-bold text-gray-900 hover:underline ${isLoggingIn ? 'pointer-events-none opacity-50' : ''}`}>
                                Sign Up now
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}