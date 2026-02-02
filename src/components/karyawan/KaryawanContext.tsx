'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface KaryawanContextType {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}

const KaryawanContext = createContext<KaryawanContextType | undefined>(undefined);

export function KaryawanProvider({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <KaryawanContext.Provider value={{ isSidebarOpen, toggleSidebar, closeSidebar }}>
            {children}
        </KaryawanContext.Provider>
    );
}

export function useKaryawan() {
    const context = useContext(KaryawanContext);
    if (context === undefined) {
        throw new Error('useKaryawan must be used within a KaryawanProvider');
    }
    return context;
}