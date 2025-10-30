<script lang="ts">
  import { onMount } from 'svelte';
  import { biayaAPI, type Biaya, type CreateBiayaData, type UpdateBiayaData } from '$lib/api/biaya';
  import { jurusanAPI, type Jurusan } from '$lib/api/campus-fakultas-jurusan';
  import Alert from '$lib/components/Alert.svelte';
  import { FormModal, DeleteModal } from '$lib/components/modals';
  import { Icon, ICON_NAMES } from '$lib/components/icons';
  import FilterControls, { type FilterState, type FilterOption, type SortOption } from '$lib/components/FilterControls.svelte';
  import AddButton from '$lib/components/AddButton.svelte';

  let items: Biaya[] = [];
  let jurusan: Jurusan[] = [];
  let loading = true;
  let error = '';

  // UI state
  let showCreateModal = false;
  let showEditModal = false;
  let showDeleteModal = false;
  let selectedItem: Biaya | null = null;
  let isSubmitting = false;
  
  // Filter and Sort state
  let filterState: FilterState = {
    searchTerm: '',
    selectedFilter: 'all',
    sortBy: 'jurusan',
    sortOrder: 'asc'
  };

  // Filter and Sort options
  let filterOptions: FilterOption[] = [
    { value: 'all', label: 'Semua Jurusan' }
  ];
  
  const sortOptions: SortOption[] = [
    { value: 'jurusan', label: 'Nama Jurusan' },
    { value: 'semester', label: 'Semester' },
    { value: 'total', label: 'Total Biaya' },
    { value: 'biayaPokok', label: 'Biaya Pokok' },
    { value: 'createdAt', label: 'Tanggal Dibuat' }
  ];
  
  // Alert state
  let alertShow = false;
  let alertType: 'success' | 'error' | 'warning' | 'info' = 'info';
  let alertMessage = '';

  // Pagination
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;

  // Form state
  let formData: CreateBiayaData = {
    jurusanId: '',
    semester: 1,
    biayaPokok: undefined,
    biayaTambahanJurusan: undefined,
    biayaPraktikum: undefined,
    biayaUjian: undefined,
    biayaKegiatan: undefined
  };

  let formErrors: Partial<Record<keyof CreateBiayaData, string>> = {};

  // Alert functions
  function showAlert(type: 'success' | 'error' | 'warning' | 'info', message: string) {
    alertType = type;
    alertMessage = message;
    alertShow = true;
  }

  function hideAlert() {
    alertShow = false;
  }

  onMount(() => {
    loadItems();
    loadJurusan();
  });

  async function loadItems() {
    try {
      loading = true;
      error = '';
      items = await biayaAPI.getAll();
      updateFilterOptions();
      totalPages = Math.ceil(items.length / itemsPerPage);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal memuat data biaya');
    } finally {
      loading = false;
    }
  }

  function updateFilterOptions() {
    // Get unique jurusan names from items
    const uniqueJurusan = [...new Set(items.map(item => item.jurusan.name))];
    filterOptions = [
      { value: 'all', label: 'Semua Jurusan' },
      ...uniqueJurusan.map(jurusanName => ({
        value: jurusanName,
        label: jurusanName
      }))
    ];
  }

  async function loadJurusan() {
    try {
      jurusan = await jurusanAPI.getAll();
    } catch (err) {
      console.error('Failed to load jurusan:', err);
    }
  }

  function resetForm() {
    formData = {
      jurusanId: '',
      semester: 1,
      biayaPokok: undefined,
      biayaTambahanJurusan: undefined,
      biayaPraktikum: undefined,
      biayaUjian: undefined,
      biayaKegiatan: undefined
    };
    formErrors = {};
  }

  function openCreateModal() {
    resetForm();
    showCreateModal = true;
  }

  function openEditModal(item: Biaya) {
    selectedItem = item;
    formData = {
      jurusanId: item.jurusanId,
      semester: item.semester,
      biayaPokok: item.biayaPokok,
      biayaTambahanJurusan: item.biayaTambahanJurusan,
      biayaPraktikum: item.biayaPraktikum,
      biayaUjian: item.biayaUjian,
      biayaKegiatan: item.biayaKegiatan
    };
    showEditModal = true;
  }

  function openDeleteModal(item: Biaya) {
    selectedItem = item;
    showDeleteModal = true;
  }

  function closeModal() {
    showCreateModal = false;
    showEditModal = false;
    showDeleteModal = false;
    selectedItem = null;
    isSubmitting = false;
    formErrors = {};
    resetForm();
  }

  function validateForm(): boolean {
    formErrors = {};

    if (!formData.jurusanId.trim()) formErrors.jurusanId = 'Jurusan wajib dipilih';

    // Check if at least one biaya is provided
    const hasAnyBiaya = formData.biayaPokok || formData.biayaTambahanJurusan || 
                       formData.biayaPraktikum || formData.biayaUjian || formData.biayaKegiatan;
    
    if (!hasAnyBiaya) {
      formErrors.biayaPokok = 'Minimal satu jenis biaya harus diisi';
    }

    return Object.keys(formErrors).length === 0;
  }

  async function createItem() {
    if (!validateForm()) return;
    try {
      isSubmitting = true;
      error = '';
      await biayaAPI.create(formData);
      await loadItems();
      closeModal();
      showAlert('success', 'Biaya default berhasil ditambahkan');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal menambahkan biaya default');
    } finally {
      isSubmitting = false;
    }
  }

  async function updateItem() {
    if (!selectedItem) return;
    if (!validateForm()) return;
    try {
      isSubmitting = true;
      error = '';
      const updateData: UpdateBiayaData = {
        biayaPokok: formData.biayaPokok,
        biayaTambahanJurusan: formData.biayaTambahanJurusan,
        biayaPraktikum: formData.biayaPraktikum,
        biayaUjian: formData.biayaUjian,
        biayaKegiatan: formData.biayaKegiatan
      };
      await biayaAPI.update(selectedItem.id, updateData);
      await loadItems();
      closeModal();
      showAlert('success', 'Biaya default berhasil diperbarui');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal memperbarui biaya default');
    } finally {
      isSubmitting = false;
    }
  }

  async function deleteItem() {
    if (!selectedItem) return;
    try {
      error = '';
      await biayaAPI.remove(selectedItem.id);
      await loadItems();
      closeModal();
      showAlert('success', 'Biaya default berhasil dihapus');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal menghapus biaya default');
    }
  }

  // Filter and sort biaya
  $: filteredItems = items
    .filter((b) => {
      // Search filter
      const matchesSearch = b.jurusan.name.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
        b.jurusan.fakultas.name.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
        b.jurusan.fakultas.campus.name.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
        b.semester.toString().includes(filterState.searchTerm) ||
        b.biayaPokok?.toString().includes(filterState.searchTerm) ||
        b.biayaTambahanJurusan?.toString().includes(filterState.searchTerm) ||
        b.biayaPraktikum?.toString().includes(filterState.searchTerm) ||
        b.biayaUjian?.toString().includes(filterState.searchTerm) ||
        b.biayaKegiatan?.toString().includes(filterState.searchTerm);
      
      // Jurusan filter
      const matchesJurusan = filterState.selectedFilter === 'all' || b.jurusan.name === filterState.selectedFilter;
      
      return matchesSearch && matchesJurusan;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (filterState.sortBy) {
        case 'jurusan':
          comparison = a.jurusan.name.localeCompare(b.jurusan.name);
          break;
        case 'semester':
          comparison = a.semester - b.semester;
          break;
        case 'total':
          comparison = calculateTotal(a) - calculateTotal(b);
          break;
        case 'biayaPokok':
          comparison = (a.biayaPokok || 0) - (b.biayaPokok || 0);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return filterState.sortOrder === 'asc' ? comparison : -comparison;
    });

  $: paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  $: totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatCurrency(amount: number | undefined): string {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  function calculateTotal(biaya: Biaya): number {
    return (
      (biaya.biayaPokok || 0) +
      (biaya.biayaTambahanJurusan || 0) +
      (biaya.biayaPraktikum || 0) +
      (biaya.biayaUjian || 0) +
      (biaya.biayaKegiatan || 0)
    );
  }

  function handleFilterChange(newState: FilterState) {
    filterState = newState;
    currentPage = 1; // Reset to first page when filter changes
  }

  function clearFilters() {
    filterState = {
      searchTerm: '',
      selectedFilter: 'all',
      sortBy: 'jurusan',
      sortOrder: 'asc'
    };
    currentPage = 1;
  }
</script>

<div class="page-container">
  <!-- Fixed Header Section -->
  <div class="fixed-header">
    <!-- Search and Filters with Add Button -->
    <div class="controls-container">
      <div class="filter-section">
        <FilterControls
          searchPlaceholder="Cari biaya default..."
          filterLabel="Filter Jurusan:"
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
          label="Tambah Biaya Default" 
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
        <p>Memuat data...</p>
      </div>
    {:else if paginatedItems.length === 0}
      <div class="empty-state">
        <Icon name={ICON_NAMES.BIAYA} size={64} />
        <h3>Tidak ada data biaya default</h3>
        <p>Mulai dengan menambahkan data biaya default</p>
      </div>
    {:else}
      <table class="data-table">
        <thead>
          <tr>
            <th>Jurusan</th>
            <th>Semester</th>
            <th>Pokok</th>
            <th>Tambahan</th>
            <th>Praktikum</th>
            <th>Ujian</th>
            <th>Kegiatan</th>
            <th>Total</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {#each paginatedItems as b}
            <tr>
              <td>
                <div class="item-info">
                  <div style="display:flex; flex-direction:column; gap:4px;">
                    <span class="item-name">{b.jurusan.name}</span>
                    <span class="item-subtitle">{b.jurusan.fakultas.name} - {b.jurusan.fakultas.campus.name}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="semester-badge">Semester {b.semester}</span>
              </td>
              <td>
                <span class="amount {b.biayaPokok ? 'has-amount' : 'no-amount'}">
                  {formatCurrency(b.biayaPokok)}
                </span>
              </td>
              <td>
                <span class="amount {b.biayaTambahanJurusan ? 'has-amount' : 'no-amount'}">
                  {formatCurrency(b.biayaTambahanJurusan)}
                </span>
              </td>
              <td>
                <span class="amount {b.biayaPraktikum ? 'has-amount' : 'no-amount'}">
                  {formatCurrency(b.biayaPraktikum)}
                </span>
              </td>
              <td>
                <span class="amount {b.biayaUjian ? 'has-amount' : 'no-amount'}">
                  {formatCurrency(b.biayaUjian)}
                </span>
              </td>
              <td>
                <span class="amount {b.biayaKegiatan ? 'has-amount' : 'no-amount'}">
                  {formatCurrency(b.biayaKegiatan)}
                </span>
              </td>
              <td>
                <span class="total-amount">
                  {formatCurrency(calculateTotal(b))}
                </span>
              </td>
              <td>
                <div class="actions">
                  <button class="btn-icon edit" aria-label="Edit biaya default" on:click={() => openEditModal(b)}>
                    <Icon name={ICON_NAMES.EDIT} size={16} />
                  </button>
                  <button class="btn-icon delete" aria-label="Hapus biaya default" on:click={() => openDeleteModal(b)}>
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

    {#if totalPages > 1}
      <div class="pagination">
        <button class="btn-pagination" disabled={currentPage === 1} on:click={() => currentPage--}>Previous</button>
        {#each Array(totalPages) as _, i}
          <button class="btn-pagination {currentPage === i + 1 ? 'active' : ''}" on:click={() => currentPage = i + 1}>{i + 1}</button>
        {/each}
        <button class="btn-pagination" disabled={currentPage === totalPages} on:click={() => currentPage++}>Next</button>
      </div>
    {/if}
  </div>
</div>

{#if showCreateModal || showEditModal}
  <FormModal
    show={showCreateModal || showEditModal}
    title={showCreateModal ? 'Tambah Biaya Default' : 'Edit Biaya Default'}
    subtitle={showCreateModal
      ? 'Lengkapi detail biaya default untuk jurusan'
      : 'Perbarui informasi biaya default'}
    {isSubmitting}
    submitLabel={showCreateModal ? 'Tambah Biaya Default' : 'Update Biaya Default'}
    on:submit={showCreateModal ? createItem : updateItem}
    on:close={closeModal}
  >
    <div class="form-row">
      <div class="form-group {formErrors.jurusanId ? 'error' : ''}">
        <label for="jurusanId">Jurusan</label>
        <select id="jurusanId" bind:value={formData.jurusanId} required disabled={showEditModal}>
          <option value="">Pilih Jurusan</option>
          {#each jurusan as j}
            <option value={j.id}>{j.name} - {j.fakultas.name} ({j.fakultas.campus.name})</option>
          {/each}
        </select>
        {#if formErrors.jurusanId}<span class="input-error">{formErrors.jurusanId}</span>{/if}
      </div>

      <div class="form-group">
        <label for="semester">Semester</label>
        <select id="semester" bind:value={formData.semester} disabled={showEditModal}>
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

    <div class="form-row">
      <div class="form-group {formErrors.biayaPokok ? 'error' : ''}">
        <label for="biayaPokok">Biaya Pokok</label>
        <input 
          id="biayaPokok" 
          type="number" 
          bind:value={formData.biayaPokok} 
          placeholder="Masukkan biaya pokok"
          min="0"
          step="1000"
        />
        {#if formErrors.biayaPokok}<span class="input-error">{formErrors.biayaPokok}</span>{/if}
      </div>

      <div class="form-group">
        <label for="biayaTambahanJurusan">Biaya Tambahan Jurusan</label>
        <input 
          id="biayaTambahanJurusan" 
          type="number" 
          bind:value={formData.biayaTambahanJurusan} 
          placeholder="Masukkan biaya tambahan jurusan"
          min="0"
          step="1000"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="biayaPraktikum">Biaya Praktikum</label>
        <input 
          id="biayaPraktikum" 
          type="number" 
          bind:value={formData.biayaPraktikum} 
          placeholder="Masukkan biaya praktikum"
          min="0"
          step="1000"
        />
      </div>

      <div class="form-group">
        <label for="biayaUjian">Biaya Ujian</label>
        <input 
          id="biayaUjian" 
          type="number" 
          bind:value={formData.biayaUjian} 
          placeholder="Masukkan biaya ujian"
          min="0"
          step="1000"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="biayaKegiatan">Biaya Kegiatan</label>
        <input 
          id="biayaKegiatan" 
          type="number" 
          bind:value={formData.biayaKegiatan} 
          placeholder="Masukkan biaya kegiatan"
          min="0"
          step="1000"
        />
      </div>
    </div>
  </FormModal>
{/if}

{#if showDeleteModal}
  <DeleteModal
    show={showDeleteModal}
    message="Data biaya default"
    itemName={selectedItem?.jurusan.name || ''}
    isDeleting={isSubmitting}
    on:confirm={deleteItem}
    on:close={closeModal}
  />
{/if}

<Alert
  bind:show={alertShow}
  type={alertType}
  message={alertMessage}
  on:hide={hideAlert}
/>

<style>
  .item-subtitle {
    font-size: 12px;
    color: #6b7280;
    font-weight: 400;
  }

  .amount {
    font-weight: 600;
    font-size: 14px;
  }

  .amount.has-amount {
    color: #059669;
  }

  .amount.no-amount {
    color: #9ca3af;
  }

  .total-amount {
    font-weight: 700;
    font-size: 15px;
    color: #1f2937;
    background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
    padding: 4px 8px;
    border-radius: 6px;
  }

  .semester-badge {
    display: inline-block;
    color: black;
    padding: 4px 8px;
    border-radius: 6px;
    font-weight: 600;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  .form-row:last-child {
    margin-bottom: 0;
  }

  .form-row:has(.form-group:only-child) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
