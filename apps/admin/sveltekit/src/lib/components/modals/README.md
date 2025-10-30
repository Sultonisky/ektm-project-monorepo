# Modal Components

Komponen modal yang reusable untuk mengurangi duplikasi kode dan meningkatkan performa aplikasi.

## Komponen yang Tersedia

### 1. BaseModal.svelte
Komponen modal dasar yang dapat dikustomisasi dengan berbagai ukuran dan fitur.

**Props:**
- `show` (boolean): Menampilkan/menyembunyikan modal
- `title` (string): Judul modal
- `subtitle` (string, optional): Subtitle modal
- `size` ('sm' | 'md' | 'lg' | 'xl'): Ukuran modal
- `closable` (boolean): Apakah modal bisa ditutup
- `loading` (boolean): Status loading

**Events:**
- `close`: Dipanggil saat modal ditutup

**Slots:**
- `default`: Konten utama modal
- `actions`: Tombol aksi di bagian bawah

### 2. FormModal.svelte
Modal khusus untuk form create/edit dengan tombol submit dan cancel.

**Props:**
- `show` (boolean): Menampilkan/menyembunyikan modal
- `title` (string): Judul modal
- `subtitle` (string, optional): Subtitle modal
- `isSubmitting` (boolean): Status submit form
- `submitLabel` (string): Label tombol submit
- `cancelLabel` (string): Label tombol cancel
- `submitDisabled` (boolean): Disable tombol submit

**Events:**
- `submit`: Dipanggil saat form disubmit
- `close`: Dipanggil saat modal ditutup

### 3. DeleteModal.svelte
Modal konfirmasi untuk menghapus data.

**Props:**
- `show` (boolean): Menampilkan/menyembunyikan modal
- `title` (string): Judul modal (default: "Konfirmasi Hapus")
- `message` (string): Pesan konfirmasi
- `itemName` (string): Nama item yang akan dihapus
- `isDeleting` (boolean): Status proses hapus
- `confirmLabel` (string): Label tombol konfirmasi
- `cancelLabel` (string): Label tombol batal

**Events:**
- `confirm`: Dipanggil saat konfirmasi hapus
- `close`: Dipanggil saat modal ditutup

### 4. DetailModal.svelte
Modal untuk menampilkan detail data dengan tombol tutup.

**Props:**
- `show` (boolean): Menampilkan/menyembunyikan modal
- `title` (string): Judul modal
- `subtitle` (string, optional): Subtitle modal

**Events:**
- `close`: Dipanggil saat modal ditutup

## Keuntungan Menggunakan Komponen Modal Reusable

1. **Mengurangi Duplikasi Kode**: Tidak perlu menulis ulang struktur modal di setiap halaman
2. **Konsistensi UI**: Semua modal memiliki tampilan dan perilaku yang konsisten
3. **Mudah Maintenance**: Perubahan pada modal hanya perlu dilakukan di satu tempat
4. **Performansi Lebih Baik**: Komponen modal hanya dimuat sekali dan digunakan berulang
5. **Type Safety**: Menggunakan TypeScript untuk memastikan props yang benar
6. **Accessibility**: Mendukung keyboard navigation dan screen reader

## Contoh Penggunaan

```svelte
<script>
  import { FormModal, DeleteModal, DetailModal } from '$lib/components/modals';
  
  let showFormModal = false;
  let showDeleteModal = false;
  let showDetailModal = false;
  let isSubmitting = false;
</script>

<!-- Form Modal -->
<FormModal
  show={showFormModal}
  title="Tambah Data"
  subtitle="Lengkapi form di bawah ini"
  {isSubmitting}
  submitLabel="Simpan"
  on:submit={handleSubmit}
  on:close={() => showFormModal = false}
>
  <!-- Form content -->
</FormModal>

<!-- Delete Modal -->
<DeleteModal
  show={showDeleteModal}
  message="Data"
  itemName="Item Name"
  isDeleting={isSubmitting}
  on:confirm={handleDelete}
  on:close={() => showDeleteModal = false}
/>

<!-- Detail Modal -->
<DetailModal
  show={showDetailModal}
  title="Detail Data"
  subtitle="Informasi lengkap"
  on:close={() => showDetailModal = false}
>
  <!-- Detail content -->
</DetailModal>
```

## Refactoring yang Telah Dilakukan

1. **Users Page**: Menggunakan FormModal dan DeleteModal
2. **Mahasiswa Page**: Menggunakan FormModal dan DeleteModal  
3. **Payment Page**: Menggunakan FormModal, DeleteModal, dan DetailModal

Setiap halaman sekarang lebih ringan dan mudah di-maintain dengan menggunakan komponen modal yang reusable.
