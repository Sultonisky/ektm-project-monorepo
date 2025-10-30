<script lang="ts">
  import { onMount } from 'svelte';
  import { jurusanAPI, fakultasAPI, type Jurusan, type Fakultas, type CreateJurusanData, type UpdateJurusanData } from '$lib/api/campus-fakultas-jurusan';
  import Alert from '$lib/components/Alert.svelte';
  import { FormModal, DeleteModal } from '$lib/components/modals';
  import { Icon, ICON_NAMES } from '$lib/components/icons';
  import FilterControls, { type FilterState, type FilterOption, type SortOption } from '$lib/components/FilterControls.svelte';
  import AddButton from '$lib/components/AddButton.svelte';

  let items: Jurusan[] = [];
  let fakultas: Fakultas[] = [];
  let loading = true;
  let error = '';

  // UI state
  let showCreateModal = false;
  let showEditModal = false;
  let showDeleteModal = false;
  let selectedItem: Jurusan | null = null;
  let isSubmitting = false;
  
  // Filter and Sort state
  let filterState: FilterState = {
    searchTerm: '',
    selectedFilter: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  };

  // Filter and Sort options
  let filterOptions: FilterOption[] = [
    { value: 'all', label: 'Semua Fakultas' }
  ];
  
  const sortOptions: SortOption[] = [
    { value: 'name', label: 'Nama Jurusan' },
    { value: 'fakultas', label: 'Nama Fakultas' },
    { value: 'campus', label: 'Nama Campus' },
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
  let formData: CreateJurusanData = {
    name: '',
    fakultasId: ''
  };

  let formErrors: Partial<Record<keyof CreateJurusanData, string>> = {};

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
    loadFakultas();
  });

  async function loadItems() {
    try {
      loading = true;
      error = '';
      items = await jurusanAPI.getAll();
      updateFilterOptions();
      totalPages = Math.ceil(items.length / itemsPerPage);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal memuat data jurusan');
    } finally {
      loading = false;
    }
  }

  function updateFilterOptions() {
    // Get unique fakultas names from items
    const uniqueFakultas = [...new Set(items.map(item => item.fakultas.name))];
    filterOptions = [
      { value: 'all', label: 'Semua Fakultas' },
      ...uniqueFakultas.map(fakultasName => ({
        value: fakultasName,
        label: fakultasName
      }))
    ];
  }

  async function loadFakultas() {
    try {
      fakultas = await fakultasAPI.getAll();
    } catch (err) {
      console.error('Failed to load fakultas:', err);
    }
  }

  function resetForm() {
    formData = {
      name: '',
      fakultasId: ''
    };
    formErrors = {};
  }

  function openCreateModal() {
    resetForm();
    showCreateModal = true;
  }

  function openEditModal(item: Jurusan) {
    selectedItem = item;
    formData = {
      name: item.name,
      fakultasId: item.fakultasId
    };
    showEditModal = true;
  }

  function openDeleteModal(item: Jurusan) {
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

    if (!formData.name.trim()) formErrors.name = 'Nama jurusan wajib diisi';
    if (!formData.fakultasId.trim()) formErrors.fakultasId = 'Fakultas wajib dipilih';

    return Object.keys(formErrors).length === 0;
  }

  async function createItem() {
    if (!validateForm()) return;
    try {
      isSubmitting = true;
      error = '';
      await jurusanAPI.create(formData);
      await loadItems();
      closeModal();
      showAlert('success', 'Jurusan berhasil ditambahkan');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal menambahkan jurusan');
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
      const updateData: UpdateJurusanData = {
        name: formData.name,
        fakultasId: formData.fakultasId
      };
      await jurusanAPI.update(selectedItem.id, updateData);
      await loadItems();
      closeModal();
      showAlert('success', 'Jurusan berhasil diperbarui');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal memperbarui jurusan');
    } finally {
      isSubmitting = false;
    }
  }

  async function deleteItem() {
    if (!selectedItem) return;
    try {
      error = '';
      await jurusanAPI.remove(selectedItem.id);
      await loadItems();
      closeModal();
      showAlert('success', 'Jurusan berhasil dihapus');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal menghapus jurusan');
    }
  }

  // Filter and sort jurusan
  $: filteredItems = items
    .filter((j) => {
      // Search filter
      const matchesSearch = j.name.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
        j.fakultas.name.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
        j.fakultas.campus.name.toLowerCase().includes(filterState.searchTerm.toLowerCase());
      
      // Fakultas filter
      const matchesFakultas = filterState.selectedFilter === 'all' || j.fakultas.name === filterState.selectedFilter;
      
      return matchesSearch && matchesFakultas;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (filterState.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'fakultas':
          comparison = a.fakultas.name.localeCompare(b.fakultas.name);
          break;
        case 'campus':
          comparison = a.fakultas.campus.name.localeCompare(b.fakultas.campus.name);
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

  function handleFilterChange(newState: FilterState) {
    filterState = newState;
    currentPage = 1; // Reset to first page when filter changes
  }

  function clearFilters() {
    filterState = {
      searchTerm: '',
      selectedFilter: 'all',
      sortBy: 'name',
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
          searchPlaceholder="Cari jurusan..."
          filterLabel="Filter Fakultas:"
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
          label="Tambah Jurusan" 
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
        <Icon name={ICON_NAMES.JURUSAN} size={64} />
        <h3>Tidak ada data jurusan</h3>
        <p>Mulai dengan menambahkan data jurusan</p>
      </div>
    {:else}
      <table class="data-table">
        <thead>
          <tr>
            <th>Jurusan</th>
            <th>Fakultas</th>
            <th>Campus</th>
            <th>Tanggal Dibuat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {#each paginatedItems as j}
            <tr>
              <td>
                <div class="item-info">
                  <div class="item-avatar">{j.name.split(' ').map(n => n[0]).join('')}</div>
                  <div style="display:flex; flex-direction:column; gap:4px;">
                    <span class="item-name">{j.name}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge badge-fakultas">{j.fakultas.name}</span>
              </td>
              <td>
                <span class="badge badge-campus">{j.fakultas.campus.name}</span>
              </td>
              <td>{formatDate(j.createdAt)}</td>
              <td>
                <div class="actions">
                  <button class="btn-icon edit" aria-label="Edit jurusan" on:click={() => openEditModal(j)}>
                    <Icon name={ICON_NAMES.EDIT} size={16} />
                  </button>
                  <button class="btn-icon delete" aria-label="Hapus jurusan" on:click={() => openDeleteModal(j)}>
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
    title={showCreateModal ? 'Tambah Jurusan' : 'Edit Jurusan'}
    subtitle={showCreateModal
      ? 'Lengkapi detail jurusan untuk menambahkan data baru'
      : 'Perbarui informasi jurusan'}
    {isSubmitting}
    submitLabel={showCreateModal ? 'Tambah Jurusan' : 'Update Jurusan'}
    on:submit={showCreateModal ? createItem : updateItem}
    on:close={closeModal}
  >
    <div class="form-row">
      <div class="form-group {formErrors.name ? 'error' : ''}">
        <label for="name">Nama Jurusan</label>
        <input id="name" type="text" bind:value={formData.name} required placeholder="Masukkan nama jurusan" />
        {#if formErrors.name}<span class="input-error">{formErrors.name}</span>{/if}
      </div>

      <div class="form-group {formErrors.fakultasId ? 'error' : ''}">
        <label for="fakultasId">Fakultas</label>
        <select id="fakultasId" bind:value={formData.fakultasId} required>
          <option value="">Pilih Fakultas</option>
          {#each fakultas as f}
            <option value={f.id}>{f.name} - {f.campus.name}</option>
          {/each}
        </select>
        {#if formErrors.fakultasId}<span class="input-error">{formErrors.fakultasId}</span>{/if}
      </div>
    </div>
  </FormModal>
{/if}

{#if showDeleteModal}
  <DeleteModal
    show={showDeleteModal}
    message="Data jurusan"
    itemName={selectedItem?.name || ''}
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

<style></style>
