import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FAQSearchProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export default function FAQSearch({ searchQuery, onSearchChange }: FAQSearchProps) {
    return (
        <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-[#D93F21] transition-colors" />
            <Input
                type="text"
                placeholder="Cari pertanyaan (misal: pembayaran, booking)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 pr-4 py-6 w-full text-base border-none shadow-none focus-visible:ring-0 rounded-lg bg-transparent placeholder:text-gray-400"
            />
        </div>
    );
}