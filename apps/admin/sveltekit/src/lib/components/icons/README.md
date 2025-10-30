# Icon System Documentation

## Overview
Sistem icon yang mudah digunakan dan maintainable untuk aplikasi SvelteKit. Menggunakan komponen `Icon.svelte` yang reusable dengan definisi icon terpusat.

## Icon Improvements
Icon-icon telah diperbarui agar lebih spesifik dan mudah dikenali untuk masing-masing menu:

- **Users**: Icon **multiple users** (dua orang) untuk menunjukkan "manage users/admin"
- **Mahasiswa**: Icon **graduation cap** untuk menunjukkan "student/mahasiswa" 
- **Payment**: Icon **credit card** yang detail dengan chip dan garis
- **Course**: Icon **buku terbuka** dengan detail tambahan (circle dan garis)
- **Campus**: Icon **building** sederhana dengan 4 titik untuk menunjukkan "institution"
- **Fakultas**: Icon **building** dengan 7 titik untuk menunjukkan "faculty structure"
- **Jurusan**: Icon **building** dengan 10 titik untuk menunjukkan "department specialization"

### Perbedaan Visual yang Jelas:
- **Users vs Mahasiswa**: Multiple users vs Graduation cap (sangat berbeda)
- **Campus vs Fakultas vs Jurusan**: Building dengan jumlah titik yang berbeda (4, 7, 10)
- **Course**: Buku terbuka dengan detail khusus untuk mata kuliah

## Cara Penggunaan

### 1. Import Icon Component
```typescript
import { Icon, ICON_NAMES } from '$lib/components/icons';
```

### 2. Menggunakan Icon di Template
```svelte
<!-- Icon dengan ukuran default (16px) -->
<Icon name={ICON_NAMES.USERS} />

<!-- Icon dengan ukuran custom -->
<Icon name={ICON_NAMES.EDIT} size={20} />

<!-- Icon dengan warna custom -->
<Icon name={ICON_NAMES.DELETE} size={16} color="#ef4444" />

<!-- Icon dengan stroke width custom -->
<Icon name={ICON_NAMES.PLUS} size={24} strokeWidth={1.5} />
```

### 3. Daftar Icon yang Tersedia

#### Navigation Icons
- `ICON_NAMES.DASHBOARD` - Dashboard icon
- `ICON_NAMES.USERS` - Users icon
- `ICON_NAMES.USER` - Single user icon
- `ICON_NAMES.MAHASISWA` - Student icon
- `ICON_NAMES.PAYMENT` - Payment icon
- `ICON_NAMES.COURSE` - Course icon
- `ICON_NAMES.CAMPUS` - Campus icon
- `ICON_NAMES.FAKULTAS` - Faculty icon
- `ICON_NAMES.JURUSAN` - Department icon

#### Action Icons
- `ICON_NAMES.MENU` - Menu hamburger
- `ICON_NAMES.PLUS` - Plus/add icon
- `ICON_NAMES.EDIT` - Edit icon
- `ICON_NAMES.DELETE` - Delete icon
- `ICON_NAMES.SEARCH` - Search icon
- `ICON_NAMES.EYE` - Eye/visible icon
- `ICON_NAMES.EYE_OFF` - Eye off/hidden icon
- `ICON_NAMES.LOGOUT` - Logout icon
- `ICON_NAMES.WARNING` - Warning icon
- `ICON_NAMES.CHECK` - Check/success icon
- `ICON_NAMES.X` - X/close icon

#### Navigation Arrows
- `ICON_NAMES.CHEVRON_LEFT` - Left arrow
- `ICON_NAMES.CHEVRON_RIGHT` - Right arrow
- `ICON_NAMES.CHEVRON_UP` - Up arrow
- `ICON_NAMES.CHEVRON_DOWN` - Down arrow

#### Other Icons
- `ICON_NAMES.CALENDAR` - Calendar icon
- `ICON_NAMES.CLOCK` - Clock icon
- `ICON_NAMES.MAIL` - Mail icon
- `ICON_NAMES.PHONE` - Phone icon

#### Additional Specific Icons
- `ICON_NAMES.GRADUATION_CAP` - Graduation cap icon (for education/students)
- `ICON_NAMES.BUILDING` - Building icon (for institutions/organizations)
- `ICON_NAMES.CREDIT_CARD` - Credit card icon (for payments/transactions)
- `ICON_NAMES.BOOK` - Book icon (for courses/materials)
- `ICON_NAMES.SETTINGS` - Settings icon (for configuration)
- `ICON_NAMES.DOWNLOAD` - Download icon (for file downloads)
- `ICON_NAMES.UPLOAD` - Upload icon (for file uploads)
- `ICON_NAMES.FILTER` - Filter icon (for data filtering)
- `ICON_NAMES.SORT` - Sort icon (for data sorting)
- `ICON_NAMES.REFRESH` - Refresh icon (for reloading data)
- `ICON_NAMES.INFO` - Info icon (for information)

## Menambah Icon Baru

### 1. Tambahkan Definisi Icon
Edit file `Icon.svelte` dan tambahkan icon baru di object `icons`:

```typescript
const icons: Record<string, string> = {
  // ... existing icons
  'new-icon': '<path d="..." stroke="currentColor" stroke-width="2"/>'
};
```

### 2. Tambahkan Constant
Edit file `index.ts` dan tambahkan constant baru:

```typescript
export const ICON_NAMES = {
  // ... existing constants
  NEW_ICON: 'new-icon'
} as const;
```

### 3. Gunakan Icon Baru
```svelte
<Icon name={ICON_NAMES.NEW_ICON} size={16} />
```

## Keuntungan Sistem Ini

### ✅ **Consistency**
- Semua icon menggunakan styling yang konsisten
- Ukuran dan stroke width yang seragam

### ✅ **Maintainability**
- Icon definitions terpusat di satu tempat
- Mudah mengubah icon di seluruh aplikasi

### ✅ **Performance**
- Icon SVG inline, tidak perlu request HTTP tambahan
- Tree-shaking friendly

### ✅ **Type Safety**
- Menggunakan TypeScript constants untuk nama icon
- IntelliSense support di IDE

### ✅ **Flexibility**
- Ukuran, warna, dan stroke width dapat disesuaikan
- Mudah ditambahkan icon baru

## Contoh Penggunaan Lengkap

```svelte
<script>
  import { Icon, ICON_NAMES } from '$lib/components/icons';
</script>

<!-- Button dengan icon -->
<button class="btn btn-primary">
  <Icon name={ICON_NAMES.PLUS} size={16} />
  Tambah Data
</button>

<!-- Search input dengan icon -->
<div class="search-box">
  <Icon name={ICON_NAMES.SEARCH} size={16} />
  <input type="text" placeholder="Cari..." />
</div>

<!-- Action buttons -->
<div class="actions">
  <button class="btn-icon edit">
    <Icon name={ICON_NAMES.EDIT} size={16} />
  </button>
  <button class="btn-icon delete">
    <Icon name={ICON_NAMES.DELETE} size={16} />
  </button>
</div>
```

## Migration dari SVG Manual

### Sebelum (SVG Manual):
```svelte
<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2"/>
  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/>
</svg>
```

### Sesudah (Icon Component):
```svelte
<Icon name={ICON_NAMES.EDIT} size={16} />
```

## Tips & Best Practices

1. **Gunakan Constants**: Selalu gunakan `ICON_NAMES.CONSTANT_NAME` untuk menghindari typo
2. **Konsisten Size**: Gunakan ukuran yang konsisten (16px untuk button, 20px untuk nav, 24px untuk header)
3. **Semantic Names**: Pilih nama icon yang semantic dan mudah dipahami
4. **Fallback**: Icon component sudah memiliki fallback ke icon 'x' jika icon tidak ditemukan
5. **Performance**: Icon SVG inline lebih cepat dari external SVG files
