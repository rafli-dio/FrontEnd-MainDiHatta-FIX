import useSWR from 'swr';
import axios from '@/lib/axios'; 
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export const useAuth = ({ middleware, redirectIfAuthenticated }: any = {}) => {
    const router = useRouter();
    const params = useParams();

    // 1. FETCH USER
    const { data: user, error, mutate, isLoading } = useSWR('/api/auth/user', () =>
            axios
                .get('/api/auth/user')
                .then(res => {
                    const data = res.data?.data || res.data;
                    
                    if (!data || !data.id) { 
                        throw { response: { status: 401 } }; 
                    }

                    return data;
                })
                .catch(error => {
                    if (error.response?.status === 409) {
                        router.push('/verify-email');
                        return null;
                    }
                    if (error.response?.status === 401) {
                        return null;
                    }
                    throw error;
                }),
            {
                revalidateOnFocus: false,
                shouldRetryOnError: false,
            }
    );

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    // 2. LOGIN
    const login = async ({ setErrors, setStatus, ...props }: any) => {
        await csrf();
        setErrors([]);
        setStatus?.(null);

        try {
            await axios.post('/api/login', props);
            await mutate(); 
        } catch (error: any) {
            if (error.response?.status === 422 && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                const msg = error.response.data.message.toLowerCase();
                if (msg.includes('password') || msg.includes('sandi')) {
                    setErrors({ password: [error.response.data.message] });
                } else if (msg.includes('email') || msg.includes('ditemukan') || msg.includes('format')) {
                    setErrors({ email: [error.response.data.message] });
                } else {
                    setErrors({ general: [error.response.data.message] });
                }
            } else if (error.response?.data?.error) {
                setErrors({ general: [error.response.data.error] });
            } else if (error.response?.status === 401) {
                setErrors({ general: ['Email atau password salah.'] });
            } else {
                setErrors({ general: ['Login gagal. Silakan periksa kembali data Anda.'] });
            }
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout');
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            await mutate(null, false); 
            router.push('/login');
        }
    };

    const register = async ({ setErrors, ...props }: any) => {
        await csrf();
        setErrors([]);
        try {
            await axios.post('/api/register', props);
            await mutate();
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
            throw error;
        }
    };

    useEffect(() => {
        if (isLoading) return;

        if (middleware === 'guest' && redirectIfAuthenticated && user) {
            router.push(redirectIfAuthenticated);
        }

 
        if (middleware === 'auth' && (error || user === null)) {
             mutate(null, false); 
             router.push('/login');
        }

    }, [user, error, isLoading, middleware, redirectIfAuthenticated, router, mutate]);

    return {
        user,
        login,
        register,
        logout,
        mutate,
        isLoading,
    };
};