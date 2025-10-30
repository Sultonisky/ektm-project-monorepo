<script lang="ts">
  import { onMount } from 'svelte';
  import { paymentService, type Payment, type BiayaDefaultResponse } from '$lib/api/payment';
  import { mahasiswaAPI, type Mahasiswa } from '$lib/api/mahasiswa';
  import Alert from '$lib/components/Alert.svelte';
  import { FormModal, DeleteModal, DetailModal } from '$lib/components/modals';
  import { Icon, ICON_NAMES } from '$lib/components/icons';
  import FilterControls, { type FilterState, type FilterOption, type SortOption } from '$lib/components/FilterControls.svelte';
  import AddButton from '$lib/components/AddButton.svelte';
  import '$lib/styles/admin.css';

  let payments: Payment[] = [];
  let mahasiswas: Mahasiswa[] = [];
  let loading = true;
  let error = '';
  // UI state
  let showCreateModal = false;
  let showEditModal = false;
  let showDeleteModal = false;
  let showDetailModal = false;
  let selectedPayment: Payment | null = null;
  let isSubmitting = false;
  
  // Filter and Sort state
  let filterState: FilterState = {
    searchTerm: '',
    selectedFilter: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  };

  // Filter and Sort options
  let filterOptions: FilterOption[] = [
    { value: 'all', label: 'Semua Status' },
    { value: 'belum', label: 'Belum Lunas' },
    { value: 'lunas', label: 'Lunas' }
  ];
  
  const sortOptions: SortOption[] = [
    { value: 'paymentCode', label: 'Kode Pembayaran' },
    { value: 'mahasiswa', label: 'Nama Mahasiswa' },
    { value: 'totalPayment', label: 'Total Pembayaran' },
    { value: 'paymentMethod', label: 'Metode Pembayaran' },
    { value: 'status', label: 'Status' },
    { value: 'createdAt', label: 'Tanggal Dibuat' }
  ];
  
  // Alert state
  let alertShow = false;
  let alertType: 'success' | 'error' | 'warning' | 'info' = 'info';
  let alertMessage = '';

  // Form state
  let formData = {
    paymentCode: '',
    mahasiswaId: '',
    semester: 1,
    biayaPokok: '',
    biayaTambahanJurusan: '',
    biayaPraktikum: '',
    biayaUjian: '',
    biayaKegiatan: '',
    paymentMethod: 'bank' as 'bank' | 'e_wallet' | 'credit_card',
    status: 'belum' as 'belum' | 'lunas'
  };

  let formErrors: Partial<Record<keyof typeof formData, string>> = {};

  // Biaya default state
  let biayaDefaultData: BiayaDefaultResponse | null = null;
  let loadingBiayaDefault = false;
  let autoPopulateEnabled = true;

  // Alert functions
  function showAlert(type: 'success' | 'error' | 'warning' | 'info', message: string) {
    alertType = type;
    alertMessage = message;
    alertShow = true;
  }

  function hideAlert() {
    alertShow = false;
  }

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    try {
      loading = true;
      error = '';
      
      // Load mahasiswas for dropdown
      mahasiswas = await mahasiswaAPI.getAll();
      
      // Load all payments
      payments = await paymentService.getAllPayments();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load data';
      console.error('Error loading data:', err);
      showAlert('error', 'Gagal memuat data pembayaran');
    } finally {
      loading = false;
    }
  }

  // Filter and sort payments
  $: filteredPayments = payments
    .filter((payment) => {
      // Search filter
      const mahasiswa = mahasiswas.find(m => m.id === payment.mahasiswaId);
      const matchesSearch = payment.paymentCode.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
        mahasiswa?.name.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
        mahasiswa?.nim.toString().includes(filterState.searchTerm) ||
        paymentService.getPaymentMethodLabel(payment.paymentMethod).toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
        payment.status.toLowerCase().includes(filterState.searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = filterState.selectedFilter === 'all' || payment.status === filterState.selectedFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      const mahasiswaA = mahasiswas.find(m => m.id === a.mahasiswaId);
      const mahasiswaB = mahasiswas.find(m => m.id === b.mahasiswaId);
      
      switch (filterState.sortBy) {
        case 'paymentCode':
          comparison = a.paymentCode.localeCompare(b.paymentCode);
          break;
        case 'mahasiswa':
          comparison = (mahasiswaA?.name || '').localeCompare(mahasiswaB?.name || '');
          break;
        case 'totalPayment':
          comparison = Number(a.totalPayment || 0) - Number(b.totalPayment || 0);
          break;
        case 'paymentMethod':
          comparison = paymentService.getPaymentMethodLabel(a.paymentMethod).localeCompare(paymentService.getPaymentMethodLabel(b.paymentMethod));
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return filterState.sortOrder === 'asc' ? comparison : -comparison;
    });

  function resetForm() {
    formData = {
      paymentCode: '',
      mahasiswaId: '',
      semester: 1,
      biayaPokok: '',
      biayaTambahanJurusan: '',
      biayaPraktikum: '',
      biayaUjian: '',
      biayaKegiatan: '',
      paymentMethod: 'bank',
      status: 'belum'
    };
    formErrors = {};
  }

  function openCreateModal() {
    resetForm();
    showCreateModal = true;
  }

  function openEditModal(payment: Payment) {
    selectedPayment = payment;
    formData = {
      paymentCode: payment.paymentCode,
      mahasiswaId: payment.mahasiswaId,
      semester: 1, // Default semester for existing payments
      biayaPokok: payment.biayaPokok || '',
      biayaTambahanJurusan: payment.biayaTambahanJurusan || '',
      biayaPraktikum: payment.biayaPraktikum || '',
      biayaUjian: payment.biayaUjian || '',
      biayaKegiatan: payment.biayaKegiatan || '',
      paymentMethod: payment.paymentMethod,
      status: payment.status
    };
    showEditModal = true;
  }

  function openDeleteModal(payment: Payment) {
    selectedPayment = payment;
    showDeleteModal = true;
  }

  function openDetailModal(payment: Payment) {
    selectedPayment = payment;
    showDetailModal = true;
  }

  function closeModal() {
    showCreateModal = false;
    showEditModal = false;
    showDeleteModal = false;
    showDetailModal = false;
    selectedPayment = null;
    isSubmitting = false;
    formErrors = {};
    resetForm();
  }

  function validateForm(): boolean {
    formErrors = {};

    if (!formData.paymentCode.trim()) formErrors.paymentCode = 'Kode pembayaran wajib diisi';
    if (!formData.mahasiswaId) formErrors.mahasiswaId = 'Mahasiswa wajib dipilih';
    if (!formData.biayaPokok || parseFloat(formData.biayaPokok) <= 0) formErrors.biayaPokok = 'Biaya pokok harus lebih dari 0';
    if (!formData.paymentMethod) formErrors.paymentMethod = 'Metode pembayaran wajib dipilih';

    return Object.keys(formErrors).length === 0;
  }

  async function createPayment() {
    if (!validateForm()) return;
    try {
      isSubmitting = true;
      error = '';
      
      // Convert form data to match backend expectations (all amounts as strings)
      const createData = {
        mahasiswaId: formData.mahasiswaId,
        paymentCode: formData.paymentCode || `PAY-${Date.now()}`, // Generate if empty
        biayaPokok: formData.biayaPokok || undefined,
        biayaTambahanJurusan: formData.biayaTambahanJurusan || undefined,
        biayaPraktikum: formData.biayaPraktikum || undefined,
        biayaUjian: formData.biayaUjian || undefined,
        biayaKegiatan: formData.biayaKegiatan || undefined,
        paymentMethod: formData.paymentMethod
      };
      
      await paymentService.createPayment(createData);
      await loadData();
      closeModal();
      showAlert('success', 'Pembayaran berhasil ditambahkan');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal menambahkan pembayaran');
    } finally {
      isSubmitting = false;
    }
  }

  async function updatePayment() {
    if (!selectedPayment || !validateForm()) return;
    try {
      isSubmitting = true;
      error = '';
      
      // Convert form data to match backend expectations (all amounts as strings)
      const updateData = {
        paymentCode: formData.paymentCode || undefined,
        biayaPokok: formData.biayaPokok || undefined,
        biayaTambahanJurusan: formData.biayaTambahanJurusan || undefined,
        biayaPraktikum: formData.biayaPraktikum || undefined,
        biayaUjian: formData.biayaUjian || undefined,
        biayaKegiatan: formData.biayaKegiatan || undefined,
        paymentMethod: formData.paymentMethod,
        status: formData.status
      };
      
      await paymentService.updatePayment(selectedPayment.id, updateData);
      await loadData();
      closeModal();
      showAlert('success', 'Pembayaran berhasil diperbarui');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal memperbarui pembayaran');
    } finally {
      isSubmitting = false;
    }
  }

  async function deletePayment() {
    if (!selectedPayment) return;
    try {
      error = '';
      await paymentService.deletePayment(selectedPayment.id);
      await loadData();
      closeModal();
      showAlert('success', 'Pembayaran berhasil dihapus');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal menghapus pembayaran');
    }
  }

  function openPaymentUrl(payment: Payment) {
    if (payment.midtransPaymentUrl) {
      window.open(payment.midtransPaymentUrl, '_blank');
    }
  }

  // Auto-populate biaya when mahasiswa is selected
  async function onMahasiswaChange() {
    if (!formData.mahasiswaId || !autoPopulateEnabled) {
      biayaDefaultData = null;
      return;
    }

    try {
      loadingBiayaDefault = true;
      biayaDefaultData = await paymentService.getBiayaDefaultByMahasiswa(formData.mahasiswaId, formData.semester);
      
      if (biayaDefaultData?.biayaDefault) {
        // Auto-populate form with biaya default
        formData.biayaPokok = biayaDefaultData.biayaDefault.biayaPokok.toString();
        formData.biayaTambahanJurusan = biayaDefaultData.biayaDefault.biayaTambahanJurusan.toString();
        formData.biayaPraktikum = biayaDefaultData.biayaDefault.biayaPraktikum.toString();
        formData.biayaUjian = biayaDefaultData.biayaDefault.biayaUjian.toString();
        formData.biayaKegiatan = biayaDefaultData.biayaDefault.biayaKegiatan.toString();
        
        showAlert('info', `Biaya default untuk ${biayaDefaultData.mahasiswa.jurusan.name} Semester ${biayaDefaultData.biayaDefault.semester} telah dimuat`);
      } else {
        showAlert('warning', biayaDefaultData?.message || 'Tidak ada biaya default untuk jurusan ini');
      }
    } catch (err) {
      console.error('Error loading biaya default:', err);
      showAlert('error', 'Gagal memuat biaya default');
    } finally {
      loadingBiayaDefault = false;
    }
  }

  function toggleAutoPopulate() {
    autoPopulateEnabled = !autoPopulateEnabled;
    if (!autoPopulateEnabled) {
      biayaDefaultData = null;
    }
  }

  function handleFilterChange(newState: FilterState) {
    filterState = newState;
  }

  function clearFilters() {
    filterState = {
      searchTerm: '',
      selectedFilter: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
  }
</script>

<div class="page-container">
  <!-- Fixed Header Section -->
  <div class="fixed-header">
    <!-- Search and Filters with Add Button -->
    <div class="controls-container">
      <div class="filter-section">
        <FilterControls
          searchPlaceholder="Cari pembayaran..."
          filterLabel="Filter Status:"
          sortLabel="Urutkan:"
          orderLabel="Arah:"
          resetLabel="Reset Filter"
          {filterOptions}
          {sortOptions}
          {filterState}
          onFilterChange={handleFilterChange}
          onReset={clearFilters}
        />
      </div>
      <div class="button-section">
        <AddButton 
          label="Tambah Pembayaran" 
          icon={ICON_NAMES.PLUS}
          onClick={openCreateModal}
        />
      </div>
    </div>

    {#if error}
      <div class="error-message">
        <Icon name={ICON_NAMES.X} size={16} />
        {error}
      </div>
    {/if}
  </div>

  <!-- Scrollable Content Section -->
  <div class="scrollable-content">
    <div class="table-container">
  {#if loading}
      <div class="loading">
        <div class="spinner"></div>
        <p>Memuat data pembayaran...</p>
      </div>
    {:else if filteredPayments.length === 0}
      <div class="empty-state">
        <Icon name={ICON_NAMES.PAYMENT} size={64} />
        <h3>Tidak ada data pembayaran</h3>
        <p>Mulai dengan menambahkan data pembayaran</p>
      </div>
  {:else}
      <table class="data-table">
        <thead>
          <tr>
            <th>Kode Pembayaran</th>
            <th>Mahasiswa</th>
            <th>Total</th>
            <th>Metode</th>
            <th>Status</th>
            <th>Tanggal Dibuat</th>
            <th>Aksi</th>
            </tr>
          </thead>
        <tbody>
          {#each filteredPayments as payment}
              {@const mahasiswa = mahasiswas.find(m => m.id === payment.mahasiswaId)}
            <tr>
              <td>
                <div class="item-info">
                  <div style="display:flex; flex-direction:column; gap:4px;">
                    <span class="item-name">{payment.paymentCode}</span>
                  </div>
                </div>
                </td>
              <td>
                  {mahasiswa?.name || 'Unknown'} ({mahasiswa?.nim || 'N/A'})
                </td>
              <td>
                  {payment.totalPayment ? paymentService.formatCurrency(payment.totalPayment) : 'N/A'}
                </td>
              <td>
                  {paymentService.getPaymentMethodLabel(payment.paymentMethod)}
                </td>
              <td>
                <span class="role-badge {paymentService.getStatusBadgeClass(payment.status)}">
                    {payment.status}
                  </span>
                </td>
              <td>{new Date(payment.createdAt).toLocaleDateString('id-ID')}</td>
              <td>
                <div class="actions">
                  <button class="btn-icon edit" aria-label="Lihat detail" on:click={() => openDetailModal(payment)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                  {#if payment.midtransPaymentUrl}
                    <button class="btn-icon edit" aria-label="Buka URL pembayaran" on:click={() => openPaymentUrl(payment)}>
                      <Icon name={ICON_NAMES.PAYMENT} size={16} />
                    </button>
                  {/if}
                  <button class="btn-icon edit" aria-label="Edit pembayaran" on:click={() => openEditModal(payment)}>
                    <Icon name={ICON_NAMES.EDIT} size={16} />
                  </button>
                  <button class="btn-icon delete" aria-label="Hapus pembayaran" on:click={() => openDeleteModal(payment)}>
                    <Icon name={ICON_NAMES.DELETE} size={16} />
                  </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    </div>
  </div>
</div>

<!-- Create/Edit Payment Modal -->
<FormModal
  show={showCreateModal || showEditModal}
  title={showCreateModal ? 'Tambah Pembayaran' : 'Edit Pembayaran'}
  subtitle={showCreateModal
    ? 'Lengkapi detail pembayaran untuk menambahkan data baru'
    : 'Perbarui informasi pembayaran'}
  {isSubmitting}
  submitLabel={showCreateModal ? 'Tambah Pembayaran' : 'Update Pembayaran'}
  on:submit={showCreateModal ? createPayment : updatePayment}
  on:close={closeModal}
>
  <div class="form-row">
    <div class="form-group {formErrors.paymentCode ? 'error' : ''}">
      <label for="paymentCode">Kode Pembayaran</label>
      <input id="paymentCode" type="text" bind:value={formData.paymentCode} placeholder="Masukkan kode pembayaran" />
      {#if formErrors.paymentCode}<span class="input-error">{formErrors.paymentCode}</span>{/if}
    </div>

    <div class="form-group {formErrors.mahasiswaId ? 'error' : ''}">
      <label for="mahasiswaId">Mahasiswa</label>
      <select id="mahasiswaId" bind:value={formData.mahasiswaId} required on:change={onMahasiswaChange}>
        <option value="">Pilih Mahasiswa</option>
        {#each mahasiswas as mahasiswa}
          <option value={mahasiswa.id}>{mahasiswa.name} ({mahasiswa.nim})</option>
        {/each}
      </select>
      {#if formErrors.mahasiswaId}<span class="input-error">{formErrors.mahasiswaId}</span>{/if}
    </div>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="semester">Semester</label>
      <select id="semester" bind:value={formData.semester} on:change={onMahasiswaChange}>
        <option value={1}>Semester 1</option>
        <option value={2}>Semester 2</option>
        <option value={3}>Semester 3</option>
        <option value={4}>Semester 4</option>
        <option value={5}>Semester 5</option>
        <option value={6}>Semester 6</option>
        <option value={7}>Semester 7</option>
        <option value={8}>Semester 8</option>
      </select>
    </div>
  </div>

  <!-- Auto-populate toggle and biaya default info -->
  <div class="form-row">
    <div class="form-group">
      <label>
        <input type="checkbox" bind:checked={autoPopulateEnabled} on:change={toggleAutoPopulate} />
        Auto-populate biaya dari jurusan mahasiswa
      </label>
    </div>
  </div>

  {#if loadingBiayaDefault}
    <div class="loading-info">
      <div class="spinner"></div>
      <span>Memuat biaya default...</span>
    </div>
  {/if}

  {#if biayaDefaultData && autoPopulateEnabled}
    <div class="biaya-default-info">
      <h4>Biaya Default untuk {biayaDefaultData.mahasiswa.jurusan.name} - Semester {biayaDefaultData.biayaDefault?.semester}</h4>
      <div class="biaya-summary">
        <div class="biaya-item">
          <span>Total: <strong>{paymentService.formatCurrency(biayaDefaultData.biayaDefault?.total || 0)}</strong></span>
        </div>
        <div class="biaya-breakdown">
          {#if biayaDefaultData.biayaDefault?.biayaPokok && biayaDefaultData.biayaDefault.biayaPokok > 0}
            <span class="biaya-tag">Pokok: {paymentService.formatCurrency(biayaDefaultData.biayaDefault.biayaPokok)}</span>
          {/if}
          {#if biayaDefaultData.biayaDefault?.biayaTambahanJurusan && biayaDefaultData.biayaDefault.biayaTambahanJurusan > 0}
            <span class="biaya-tag">Tambahan: {paymentService.formatCurrency(biayaDefaultData.biayaDefault.biayaTambahanJurusan)}</span>
          {/if}
          {#if biayaDefaultData.biayaDefault?.biayaPraktikum && biayaDefaultData.biayaDefault.biayaPraktikum > 0}
            <span class="biaya-tag">Praktikum: {paymentService.formatCurrency(biayaDefaultData.biayaDefault.biayaPraktikum)}</span>
          {/if}
          {#if biayaDefaultData.biayaDefault?.biayaUjian && biayaDefaultData.biayaDefault.biayaUjian > 0}
            <span class="biaya-tag">Ujian: {paymentService.formatCurrency(biayaDefaultData.biayaDefault.biayaUjian)}</span>
          {/if}
          {#if biayaDefaultData.biayaDefault?.biayaKegiatan && biayaDefaultData.biayaDefault.biayaKegiatan > 0}
            <span class="biaya-tag">Kegiatan: {paymentService.formatCurrency(biayaDefaultData.biayaDefault.biayaKegiatan)}</span>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <div class="form-row">
    <div class="form-group {formErrors.paymentMethod ? 'error' : ''}">
      <label for="paymentMethod">Metode Pembayaran</label>
      <select id="paymentMethod" bind:value={formData.paymentMethod} required>
        <option value="bank">Bank Transfer</option>
        <option value="e_wallet">E-Wallet</option>
        <option value="credit_card">Credit Card</option>
      </select>
      {#if formErrors.paymentMethod}<span class="input-error">{formErrors.paymentMethod}</span>{/if}
    </div>

    <div class="form-group {formErrors.biayaPokok ? 'error' : ''}">
      <label for="biayaPokok">Biaya Pokok</label>
      <input id="biayaPokok" type="number" bind:value={formData.biayaPokok} min="0" required placeholder="Masukkan biaya pokok" />
      {#if formErrors.biayaPokok}<span class="input-error">{formErrors.biayaPokok}</span>{/if}
    </div>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="biayaTambahanJurusan">Biaya Tambahan Jurusan</label>
      <input id="biayaTambahanJurusan" type="number" bind:value={formData.biayaTambahanJurusan} min="0" placeholder="Masukkan biaya tambahan" />
    </div>

    <div class="form-group">
      <label for="biayaPraktikum">Biaya Praktikum</label>
      <input id="biayaPraktikum" type="number" bind:value={formData.biayaPraktikum} min="0" placeholder="Masukkan biaya praktikum" />
    </div>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="biayaKegiatan">Biaya Kegiatan</label>
      <input id="biayaKegiatan" type="number" bind:value={formData.biayaKegiatan} min="0" placeholder="Masukkan biaya kegiatan" />
    </div>

    <div class="form-group">
      <label for="status">Status</label>
      <select id="status" bind:value={formData.status}>
        <option value="belum">Belum Lunas</option>
        <option value="lunas">Lunas</option>
      </select>
    </div>
  </div>
</FormModal>

<!-- Delete Confirmation Modal -->
<DeleteModal
  show={showDeleteModal}
  message="Data pembayaran"
  itemName={selectedPayment?.paymentCode || ''}
  isDeleting={isSubmitting}
  on:confirm={deletePayment}
  on:close={closeModal}
/>

<!-- Payment Detail Modal -->
<DetailModal
  show={showDetailModal}
  title="Detail Pembayaran"
  subtitle="Informasi lengkap pembayaran"
  on:close={closeModal}
>
  {#if selectedPayment}
    {@const mahasiswa = mahasiswas.find(m => m.id === selectedPayment?.mahasiswaId)}
    <div class="form-row">
      <div class="form-group">
        <label for="detail-payment-code">Kode Pembayaran</label>
        <div id="detail-payment-code" class="form-value">{selectedPayment?.paymentCode}</div>
      </div>
      <div class="form-group">
        <label for="detail-mahasiswa">Mahasiswa</label>
        <div id="detail-mahasiswa" class="form-value">{mahasiswa?.name || 'Unknown'} ({mahasiswa?.nim || 'N/A'})</div>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="detail-payment-method">Metode Pembayaran</label>
        <div id="detail-payment-method" class="form-value">{paymentService.getPaymentMethodLabel(selectedPayment.paymentMethod)}</div>
      </div>
      <div class="form-group">
        <label for="detail-status">Status</label>
        <div id="detail-status" class="form-value">
          <span class="role-badge {paymentService.getStatusBadgeClass(selectedPayment.status)}">
            {selectedPayment.status}
          </span>
        </div>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="detail-biaya-pokok">Biaya Pokok</label>
        <div id="detail-biaya-pokok" class="form-value">{selectedPayment.biayaPokok ? paymentService.formatCurrency(selectedPayment.biayaPokok) : 'N/A'}</div>
      </div>
      <div class="form-group">
        <label for="detail-biaya-tambahan">Biaya Tambahan Jurusan</label>
        <div id="detail-biaya-tambahan" class="form-value">{selectedPayment.biayaTambahanJurusan ? paymentService.formatCurrency(selectedPayment.biayaTambahanJurusan) : 'N/A'}</div>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="detail-biaya-praktikum">Biaya Praktikum</label>
        <div id="detail-biaya-praktikum" class="form-value">{selectedPayment.biayaPraktikum ? paymentService.formatCurrency(selectedPayment.biayaPraktikum) : 'N/A'}</div>
      </div>
      <div class="form-group">
        <label for="detail-biaya-ujian">Biaya Ujian</label>
        <div id="detail-biaya-ujian" class="form-value">{selectedPayment.biayaUjian ? paymentService.formatCurrency(selectedPayment.biayaUjian) : 'N/A'}</div>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="detail-biaya-kegiatan">Biaya Kegiatan</label>
        <div id="detail-biaya-kegiatan" class="form-value">{selectedPayment.biayaKegiatan ? paymentService.formatCurrency(selectedPayment.biayaKegiatan) : 'N/A'}</div>
      </div>
      <div class="form-group">
        <label for="detail-total">Total Pembayaran</label>
        <div id="detail-total" class="form-value font-bold">{selectedPayment.totalPayment ? paymentService.formatCurrency(selectedPayment.totalPayment) : 'N/A'}</div>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="detail-created">Tanggal Dibuat</label>
        <div id="detail-created" class="form-value">{new Date(selectedPayment.createdAt).toLocaleDateString('id-ID')}</div>
      </div>
      <div class="form-group">
        <label for="detail-updated">Terakhir Diupdate</label>
        <div id="detail-updated" class="form-value">{new Date(selectedPayment.updatedAt).toLocaleDateString('id-ID')}</div>
      </div>
    </div>

    {#if selectedPayment.midtransPaymentUrl}
      <div class="form-row">
        <div class="form-group">
          <label for="detail-payment-url">URL Pembayaran</label>
          <div id="detail-payment-url" class="form-value">
            <button class="btn btn-primary" on:click={() => selectedPayment && openPaymentUrl(selectedPayment)}>
              Buka URL Pembayaran
            </button>
          </div>
        </div>
      </div>
    {/if}
  {/if}
</DetailModal>

<!-- Alert Component -->
<Alert 
  bind:show={alertShow} 
  type={alertType} 
  message={alertMessage} 
  on:hide={hideAlert}
/>

<style>
  .loading-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: #f3f4f6;
    border-radius: 8px;
    margin: 16px 0;
    font-size: 14px;
    color: #6b7280;
  }

  .biaya-default-info {
    background: linear-gradient(135deg, #e0f2fe, #b3e5fc);
    border: 1px solid #81d4fa;
    border-radius: 12px;
    padding: 16px;
    margin: 16px 0;
  }

  .biaya-default-info h4 {
    margin: 0 0 12px 0;
    color: #0277bd;
    font-size: 16px;
    font-weight: 600;
  }

  .biaya-summary {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .biaya-item {
    font-size: 16px;
    color: #01579b;
  }

  .biaya-breakdown {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .biaya-tag {
    background: rgba(255, 255, 255, 0.8);
    color: #0277bd;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
  }

  .form-group label input[type="checkbox"] {
    margin-right: 8px;
  }

  @media (max-width: 768px) {
    .biaya-breakdown {
      flex-direction: column;
    }
    
    .biaya-tag {
      text-align: center;
    }
  }
</style>
