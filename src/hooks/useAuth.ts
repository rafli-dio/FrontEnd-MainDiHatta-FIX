import useSWR from 'swr';
import axios from '@/lib/axios';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { User } from '@/types';

interface UseAuthProps {
    middleware?: 'guest' | 'auth';
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

    const { data: user, error, mutate } = useSWR<User>('/api/auth/user', () =>
        axios
            .get('/api/auth/user')
            .then(res => res.data?.data || res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error;
                
                router.push('/verify-email');
            })
    );

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    // 3. LOGIN
    const login = async ({ setErrors, setStatus, ...props }: AuthActions) => {
        await csrf();
        setErrors([]);
        setStatus?.(null);

        try {
            await axios.post('api/login', props);
            await mutate();
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
                throw error;
            }
            throw error;
        }
    };

    // 4. REGISTER
    const register = async ({ setErrors, ...props }: AuthActions) => {
        await csrf();
        setErrors([]);

        try {
            await axios.post('api/register', props);
            await mutate();
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
                throw error;
            }
            throw error;
        }
    };

    const logout = async () => {
        if (!error) {
            await axios.post('api/auth/logout').then(() => mutate()); 
        }
        window.location.pathname = '/login'; 
    };

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) {
            try {
                let dest = String(redirectIfAuthenticated);
                if (/^https?:\/\//i.test(dest)) {
                    router.push(dest);
                } else {
                    dest = dest.replace(/^\/+/, '/');
                    router.push(dest);
                }
            } catch (e) {
                router.push(redirectIfAuthenticated);
            }
        }
        
        if (middleware === 'auth' && error) {
             logout();
        }
    }, [user, error, middleware, redirectIfAuthenticated, router]);

    return {
        user,
        login,
        register,
        logout,
        mutate, 
    };
};