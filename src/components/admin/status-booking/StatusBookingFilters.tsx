'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface StatusBookingFiltersProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
}

export default function StatusBookingFilters({
    searchQuery,
    setSearchQuery,
}: StatusBookingFiltersProps) {
    return (
        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
            <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                    placeholder="Cari nama status..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            {searchQuery && (
                <Button variant="ghost" onClick={() => setSearchQuery('')} className="text-gray-500">
                    <X className="h-4 w-4 mr-2" /> Reset
                </Button>
            )}
        </div>
    );
}