<script lang="ts">
  import { onMount } from 'svelte';
  import { campusAPI, type Campus, type CreateCampusData, type UpdateCampusData } from '$lib/api/campus-fakultas-jurusan';
  import Alert from '$lib/components/Alert.svelte';
  import { FormModal, DeleteModal } from '$lib/components/modals';
  import { Icon, ICON_NAMES } from '$lib/components/icons';
  import FilterControls, { type FilterState, type FilterOption, type SortOption } from '$lib/components/FilterControls.svelte';
  import AddButton from '$lib/components/AddButton.svelte';
  import campusDefault from '$lib/assets/images/campus/campus-default.png';

  let items: Campus[] = [];
  let loading = true;
  let error = '';

  // UI state
  let showCreateModal = false;
  let showEditModal = false;
  let showDeleteModal = false;
  let selectedItem: Campus | null = null;
  let isSubmitting = false;
  
  // Filter and Sort state
  let filterState: FilterState = {
    searchTerm: '',
    selectedFilter: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  };

  // Filter and Sort options - Campus is simple, no additional filters needed
  const filterOptions: FilterOption[] = [];
  
  const sortOptions: SortOption[] = [
    { value: 'name', label: 'Nama Campus' },
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
  let formData: CreateCampusData = {
    name: '',
    address: '',
    foto: ''
  };

  let formErrors: Partial<Record<keyof CreateCampusData, string>> = {};

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
  });

  async function loadItems() {
    try {
      loading = true;
      error = '';
      items = await campusAPI.getAll();
      totalPages = Math.ceil(items.length / itemsPerPage);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal memuat data campus');
    } finally {
      loading = false;
    }
  }

  function resetForm() {
    formData = {
      name: '',
      address: '',
      foto: ''
    };
    formErrors = {};
  }

  function openCreateModal() {
    resetForm();
    showCreateModal = true;
  }

  function openEditModal(item: Campus) {
    selectedItem = item;
    formData = {
      name: item.name,
      address: item.address || '',
      foto: item.foto || ''
    };
    showEditModal = true;
  }

  function openDeleteModal(item: Campus) {
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

    if (!formData.name.trim()) formErrors.name = 'Nama campus wajib diisi';

    return Object.keys(formErrors).length === 0;
  }

  async function createItem() {
    if (!validateForm()) return;
    try {
      isSubmitting = true;
      error = '';
      await campusAPI.create(formData);
      await loadItems();
      closeModal();
      showAlert('success', 'Campus berhasil ditambahkan');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal menambahkan campus');
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
      const updateData: UpdateCampusData = {
        name: formData.name,
        address: formData.address,
        foto: formData.foto,
      };
      await campusAPI.update(selectedItem.id, updateData);
      await loadItems();
      closeModal();
      showAlert('success', 'Campus berhasil diperbarui');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal memperbarui campus');
    } finally {
      isSubmitting = false;
    }
  }

  async function deleteItem() {
    if (!selectedItem) return;
    try {
      error = '';
      await campusAPI.remove(selectedItem.id);
      await loadItems();
      closeModal();
      showAlert('success', 'Campus berhasil dihapus');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal menghapus campus');
    }
  }

  // Filter and sort campus
  $: filteredItems = items
    .filter((c) => {
      // Search filter
      const matchesSearch = c.name.toLowerCase().includes(filterState.searchTerm.toLowerCase());
      
      // No additional filters for campus (simple data structure)
      return matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (filterState.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
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
          searchPlaceholder="Cari campus..."
          filterLabel=""
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
          label="Tambah Campus" 
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
        <Icon name={ICON_NAMES.CAMPUS} size={64} />
        <h3>Tidak ada data campus</h3>
        <p>Mulai dengan menambahkan data campus</p>
      </div>
    {:else}
      <table class="data-table">
        <thead>
          <tr>
            <th>Campus</th>
            <th>Address</th>
            <th>Foto Campus</th>
            <th>Tanggal Dibuat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {#each paginatedItems as c}
            <tr>
              <td>
                <div class="item-info">
                  
                  <div style="display:flex; flex-direction:column; gap:4px;">
                    <span class="item-name">{c.name}</span>
                  </div>
                </div>
              </td>
              <td>{c.address}</td>
              <td><img src={c.foto || campusDefault} alt={c.name} /></td>
              <td>{formatDate(c.createdAt)}</td>
              <td>
                <div class="actions">
                  <button class="btn-icon edit" aria-label="Edit campus" on:click={() => openEditModal(c)}>
                    <Icon name={ICON_NAMES.EDIT} size={16} />
                  </button>
                  <button class="btn-icon delete" aria-label="Hapus campus" on:click={() => openDeleteModal(c)}>
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
    title={showCreateModal ? 'Tambah Campus' : 'Edit Campus'}
    subtitle={showCreateModal
      ? 'Lengkapi detail campus untuk menambahkan data baru'
      : 'Perbarui informasi campus'}
    {isSubmitting}
    submitLabel={showCreateModal ? 'Tambah Campus' : 'Update Campus'}
    on:submit={showCreateModal ? createItem : updateItem}
    on:close={closeModal}
  >
    <div class="form-row">
      <div class="form-group {formErrors.name ? 'error' : ''}">
        <label for="name">Nama Campus</label>
        <input id="name" type="text" bind:value={formData.name} required placeholder="Masukkan nama campus" />
        {#if formErrors.name}<span class="input-error">{formErrors.name}</span>{/if}
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="address">Alamat (opsional)</label>
        <input id="address" type="text" bind:value={formData.address} placeholder="Masukkan alamat" />
      </div>
      <div class="form-group">
        <label for="foto">Foto URL (opsional)</label>
        <input id="foto" type="url" bind:value={formData.foto} placeholder="https://..." />
      </div>
    </div>
  </FormModal>
{/if}

{#if showDeleteModal}
  <DeleteModal
    show={showDeleteModal}
    message="Data campus"
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

<style>
  .item-avatar img,
  .data-table td img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 10px;
    display: block;
  }
</style>
