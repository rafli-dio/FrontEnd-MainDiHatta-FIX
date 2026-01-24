import useSWR from 'swr';
import axios from '@/lib/axios';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { User } from '@/types';

interface UseAuthProps {
    middleware?: 'guest' | 'auth' | 'public';
    redirectIfAuthenticated?: string;
}

interface AuthActions {
    setErrors: (errors: any) => void;
    setStatus?: (status: string | null) => void;
    [key: string]: any;
}

export const useAuth = ({ middleware, redirectIfAuthenticated }: UseAuthProps = {}) => {
    const router = useRouter();
    const params = useParams();

    // 1. FETCH USER
    // Menambahkan konfigurasi agar SWR tidak retry jika error 401 (Unauthorized)
    const { data: user, error, mutate, isLoading } = useSWR<User>('/api/auth/user', () =>
        axios
            .get('/api/auth/user')
            .then(res => res.data?.data || res.data)
            .catch(error => {
                // Jika error 409 (Verifikasi Email), lempar ke halaman verify
                if (error.response?.status === 409) {
                    router.push('/verify-email');
                }
                // Jika error 401 (Belum Login), biarkan error agar ditangkap logic middleware
                if (error.response?.status !== 409) throw error;
            }),
        {
            revalidateOnFocus: false, // Opsional: Hemat request
            shouldRetryOnError: false, // PENTING: Jangan retry jika 401
        }
    );

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    // 2. LOGIN
    const login = async ({ setErrors, setStatus, ...props }: AuthActions) => {
        await csrf();
        setErrors([]);
        setStatus?.(null);

        try {
            // Tambahkan slash di depan agar absolute path
            await axios.post('/api/login', props);
            await mutate(); // Refresh data user
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
            throw error;
        }
    };

    // 3. REGISTER
    const register = async ({ setErrors, ...props }: AuthActions) => {
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

    // 4. LOGOUT
    const logout = async () => {
        // Hanya panggil API logout jika user masih dianggap login (tidak error)
        if (!error) {
            try {
                await axios.post('/api/auth/logout');
            } catch (e) {
                console.error("Logout error", e);
            }
            await mutate(undefined, false); // Kosongkan cache SWR
        }
        
        // Hard refresh ke halaman login untuk membersihkan state react
        window.location.pathname = '/login'; 
    };

    // 5. MIDDLEWARE LOGIC
    useEffect(() => {
        // Skenario 1: Middleware GUEST (Halaman Login/Register)
        // Jika user SUDAH login (ada data user), lempar ke dashboard
        if (middleware === 'guest' && redirectIfAuthenticated && user) {
            router.push(redirectIfAuthenticated);
        }

        // Skenario 2: Middleware AUTH (Dashboard/Protected Routes)
        // Jika terjadi error (biasanya 401 Unauthorized), lempar keluar
        // Note: Kita cek !isLoading agar tidak redirect saat data masih loading
        if (middleware === 'auth' && error && !isLoading) {
             // Jangan panggil fungsi logout() di sini karena akan memicu API call loop
             // Cukup redirect paksa (atau gunakan router.push('/login'))
             window.location.pathname = '/login'; 
        }

        // Skenario 3: Middleware PUBLIC (Landing Page)
        // Tidak melakukan apa-apa, membiarkan user (null atau ada) tetap di halaman.
        
    }, [user, error, isLoading, middleware, redirectIfAuthenticated, router]);

    return {
        user,
        login,
        register,
        logout,
        mutate,
        isLoading, 
    };
};