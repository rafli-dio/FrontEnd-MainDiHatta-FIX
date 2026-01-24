# Sweet Alert 2 Debug Guide

## Troubleshooting - Fungsi tidak jalan

Jika Sweet Alert muncul tapi fungsi tidak jalan, ikuti checklist ini:

### ✅ Checklist:

1. **Pastikan sweetalert2 sudah terinstall**
   ```bash
   npm install sweetalert2
   ```

2. **Restart dev server**
   ```bash
   npm run dev
   ```

3. **Clear Next.js cache**
   ```bash
   rm -rf .next
   npm run dev
   ```

4. **Pastikan import path benar di `src/lib/sweetAlert.ts`:**
   ```typescript
   import Swal from 'sweetalert2/dist/sweetalert2.js'
   import 'sweetalert2/dist/sweetalert2.css'
   ```

5. **Pastikan component adalah 'use client'**
   - Semua component yang menggunakan sweetAlert harus punya `'use client'` di atas

6. **Check console browser untuk error**
   - Buka DevTools (F12) → Console tab
   - Lihat apakah ada error message

### Contoh penggunaan yang benar:

```typescript
// Di component atau hook
import { sweetAlert } from '@/lib/sweetAlert';

const handleDelete = async (id: number) => {
    const result = await sweetAlert.confirmDelete(
        'Hapus Data?',
        'Apakah Anda yakin?'
    );
    
    // ✅ PENTING: Harus check result.isConfirmed
    if (!result.isConfirmed) return;
    
    // Baru jalankan action delete
    try {
        await axios.delete(`/api/data/${id}`);
        toast.success('Berhasil dihapus');
        fetchData(); // Refresh data
    } catch (error) {
        toast.error('Gagal dihapus');
    }
};
```

### Debugging step-by-step:

1. **Console log untuk cek apakah dialog muncul:**
   ```typescript
   const handleDelete = async (id: number) => {
       console.log('1. Delete button clicked'); // Debug 1
       const result = await sweetAlert.confirmDelete('Hapus?', 'Yakin?');
       console.log('2. Dialog result:', result); // Debug 2
       console.log('3. Is confirmed?', result.isConfirmed); // Debug 3
       if (!result.isConfirmed) return;
       console.log('4. Proceeding with delete'); // Debug 4
       // ... lanjut delete
   };
   ```

2. **Cek DevTools Console** untuk melihat mana yang jalan

3. **Jika dialog tidak muncul sama sekali:**
   - sweetalert2 tidak terinstall/import error
   - Jalankan `npm install sweetalert2` ulang

4. **Jika dialog muncul tapi button tidak jalan:**
   - `result.isConfirmed` mungkin undefined
   - Cek apakah async/await berfungsi

### File-file yang sudah terupdate:

**Components:**
- src/components/admin/users/UserTable.tsx
- src/components/admin/payment-method/PaymentMethodTable.tsx
- src/components/admin/lapangan/LapanganGrid.tsx
- src/components/admin/status-booking/StatusBookingTable.tsx
- src/components/admin/status-booking/SimpleStatusBookingTable.tsx
- src/components/admin/faq/FAQTable.tsx
- src/components/admin/Sidebar.tsx
- src/components/pelanggan/Navbar.tsx
- src/components/karyawan/SidebarKaryawan.tsx

**Hooks:**
- src/hooks/admin/useUsersPage.ts
- src/hooks/admin/usePaymentMethodPage.ts
- src/hooks/admin/useLapanganPage.ts
- src/hooks/admin/useStatusBookingPage.ts
- src/hooks/admin/useBookingAdminPage.ts

### Contact Support:

Jika masih error, screenshot error message dan share:
- Error dari console browser
- Error dari terminal/npm run dev
- Kondisi apa yang trigger error
