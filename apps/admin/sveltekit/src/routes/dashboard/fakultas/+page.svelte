<script lang="ts">
  import { onMount } from 'svelte';
  import { fakultasAPI, campusAPI, type Fakultas, type Campus, type CreateFakultasData, type UpdateFakultasData } from '$lib/api/campus-fakultas-jurusan';
  import Alert from '$lib/components/Alert.svelte';
  import { FormModal, DeleteModal } from '$lib/components/modals';
  import { Icon, ICON_NAMES } from '$lib/components/icons';
  import FilterControls, { type FilterState, type FilterOption, type SortOption } from '$lib/components/FilterControls.svelte';
  import AddButton from '$lib/components/AddButton.svelte';

  let items: Fakultas[] = [];
  let campuses: Campus[] = [];
  let loading = true;
  let error = '';

  // UI state
  let showCreateModal = false;
  let showEditModal = false;
  let showDeleteModal = false;
  let selectedItem: Fakultas | null = null;
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
    { value: 'all', label: 'Semua Campus' }
  ];
  
  const sortOptions: SortOption[] = [
    { value: 'name', label: 'Nama Fakultas' },
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
  let formData: CreateFakultasData = {
    name: '',
    campusId: ''
  };

  let formErrors: Partial<Record<keyof CreateFakultasData, string>> = {};

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
    loadCampuses();
  });

  async function loadItems() {
    try {
      loading = true;
      error = '';
      items = await fakultasAPI.getAll();
      updateFilterOptions();
      totalPages = Math.ceil(items.length / itemsPerPage);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal memuat data fakultas');
    } finally {
      loading = false;
    }
  }

  function updateFilterOptions() {
    // Get unique campus names from items
    const uniqueCampus = [...new Set(items.map(item => item.campus.name))];
    filterOptions = [
      { value: 'all', label: 'Semua Campus' },
      ...uniqueCampus.map(campusName => ({
        value: campusName,
        label: campusName
      }))
    ];
  }

  async function loadCampuses() {
    try {
      campuses = await campusAPI.getAll();
    } catch (err) {
      console.error('Failed to load campuses:', err);
    }
  }

  function resetForm() {
    formData = {
      name: '',
      campusId: ''
    };
    formErrors = {};
  }

  function openCreateModal() {
    resetForm();
    showCreateModal = true;
  }

  function openEditModal(item: Fakultas) {
    selectedItem = item;
    formData = {
      name: item.name,
      campusId: item.campusId
    };
    showEditModal = true;
  }

  function openDeleteModal(item: Fakultas) {
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

    if (!formData.name.trim()) formErrors.name = 'Nama fakultas wajib diisi';
    if (!formData.campusId.trim()) formErrors.campusId = 'Campus wajib dipilih';

    return Object.keys(formErrors).length === 0;
  }

  async function createItem() {
    if (!validateForm()) return;
    try {
      isSubmitting = true;
      error = '';
      await fakultasAPI.create(formData);
      await loadItems();
      closeModal();
      showAlert('success', 'Fakultas berhasil ditambahkan');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal menambahkan fakultas');
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
      const updateData: UpdateFakultasData = {
        name: formData.name,
        campusId: formData.campusId
      };
      await fakultasAPI.update(selectedItem.id, updateData);
      await loadItems();
      closeModal();
      showAlert('success', 'Fakultas berhasil diperbarui');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal memperbarui fakultas');
    } finally {
      isSubmitting = false;
    }
  }

  async function deleteItem() {
    if (!selectedItem) return;
    try {
      error = '';
      await fakultasAPI.remove(selectedItem.id);
      await loadItems();
      closeModal();
      showAlert('success', 'Fakultas berhasil dihapus');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal menghapus fakultas');
    }
  }

  // Filter and sort fakultas
  $: filteredItems = items
    .filter((f) => {
      // Search filter
      const matchesSearch = f.name.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
        f.campus.name.toLowerCase().includes(filterState.searchTerm.toLowerCase());
      
      // Campus filter
      const matchesCampus = filterState.selectedFilter === 'all' || f.campus.name === filterState.selectedFilter;
      
      return matchesSearch && matchesCampus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (filterState.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'campus':
          comparison = a.campus.name.localeCompare(b.campus.name);
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
          searchPlaceholder="Cari fakultas..."
          filterLabel="Filter Campus:"
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
          label="Tambah Fakultas" 
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
        <Icon name={ICON_NAMES.FAKULTAS} size={64} />
        <h3>Tidak ada data fakultas</h3>
        <p>Mulai dengan menambahkan data fakultas</p>
      </div>
    {:else}
      <table class="data-table">
        <thead>
          <tr>
            <th>Fakultas</th>
            <th>Campus</th>
            <th>Tanggal Dibuat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {#each paginatedItems as f}
            <tr>
              <td>
                <div class="item-info">
                  <div class="item-avatar">{f.name.split(' ').map(n => n[0]).join('')}</div>
                  <div style="display:flex; flex-direction:column; gap:4px;">
                    <span class="item-name">{f.name}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge">{f.campus.name}</span>
              </td>
              <td>{formatDate(f.createdAt)}</td>
              <td>
                <div class="actions">
                  <button class="btn-icon edit" aria-label="Edit fakultas" on:click={() => openEditModal(f)}>
                    <Icon name={ICON_NAMES.EDIT} size={16} />
                  </button>
                  <button class="btn-icon delete" aria-label="Hapus fakultas" on:click={() => openDeleteModal(f)}>
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
    title={showCreateModal ? 'Tambah Fakultas' : 'Edit Fakultas'}
    subtitle={showCreateModal
      ? 'Lengkapi detail fakultas untuk menambahkan data baru'
      : 'Perbarui informasi fakultas'}
    {isSubmitting}
    submitLabel={showCreateModal ? 'Tambah Fakultas' : 'Update Fakultas'}
    on:submit={showCreateModal ? createItem : updateItem}
    on:close={closeModal}
  >
    <div class="form-row">
      <div class="form-group {formErrors.name ? 'error' : ''}">
        <label for="name">Nama Fakultas</label>
        <input id="name" type="text" bind:value={formData.name} required placeholder="Masukkan nama fakultas" />
        {#if formErrors.name}<span class="input-error">{formErrors.name}</span>{/if}
      </div>

      <div class="form-group {formErrors.campusId ? 'error' : ''}">
        <label for="campusId">Campus</label>
        <select id="campusId" bind:value={formData.campusId} required>
          <option value="">Pilih Campus</option>
          {#each campuses as campus}
            <option value={campus.id}>{campus.name}</option>
          {/each}
        </select>
        {#if formErrors.campusId}<span class="input-error">{formErrors.campusId}</span>{/if}
      </div>
    </div>
  </FormModal>
{/if}

{#if showDeleteModal}
  <DeleteModal
    show={showDeleteModal}
    message="Data fakultas"
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
