'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Role } from '@/types';

interface UserFiltersProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    filterRole: string;
    setFilterRole: (value: string) => void;
    roles: Role[];
}

export default function UserFilters({
    searchQuery,
    setSearchQuery,
    filterRole,
    setFilterRole,
    roles,
}: UserFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                    placeholder="Cari nama atau email..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="w-full md:w-[200px]">
                <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger><SelectValue placeholder="Filter Role" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Role</SelectItem>
                        {roles.map(role => (
                            <SelectItem key={role.id} value={role.id.toString()}>{role.name_role}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            {(searchQuery || filterRole !== 'all') && (
                <Button variant="ghost" onClick={() => { setSearchQuery(''); setFilterRole('all'); }} className="text-gray-500">
                    <X className="h-4 w-4 mr-2" /> Reset
                </Button>
            )}
        </div>
    );
}