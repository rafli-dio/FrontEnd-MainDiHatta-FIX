import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});
axiosInstance.interceptors.request.use((config) => {
    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return decodeURIComponent(parts.pop()?.split(';').shift() || '');
        }
        return null;
    };

    const token = getCookie('XSRF-TOKEN');

    if (token) {
        config.headers['X-XSRF-TOKEN'] = token;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;