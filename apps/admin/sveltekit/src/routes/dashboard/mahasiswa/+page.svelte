<script lang="ts">
  import { onMount } from 'svelte';
  import { mahasiswaAPI, type Mahasiswa, type CreateMahasiswaData, type UpdateMahasiswaData } from '$lib/api';
  import { campusAPI, fakultasAPI, jurusanAPI, type Campus, type Fakultas, type Jurusan } from '$lib/api/campus-fakultas-jurusan';
  import Alert from '$lib/components/Alert.svelte';
  import { FormModal, DeleteModal } from '$lib/components/modals';
  import { Icon, ICON_NAMES } from '$lib/components/icons';
  import FilterControls, { type FilterState, type FilterOption, type SortOption } from '$lib/components/FilterControls.svelte';
  import AddButton from '$lib/components/AddButton.svelte';

  let items: Mahasiswa[] = [];
  let loading = true;
  let error = '';

  // Dropdown data
  let campuses: Campus[] = [];
  let fakultas: Fakultas[] = [];
  let jurusan: Jurusan[] = [];
  let selectedCampusId = '';
  let selectedFakultasId = '';

  // UI state
  let showCreateModal = false;
  let showEditModal = false;
  let showDeleteModal = false;
  let selectedItem: Mahasiswa | null = null;
  let isSubmitting = false;
  let showPassword = false;
  
  // Filter and Sort state
  let filterState: FilterState = {
    searchTerm: '',
    selectedFilter: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  };

  // Filter and Sort options
  let filterOptions: FilterOption[] = [
    { value: 'all', label: 'Semua Jurusan' }
  ];
  
  const sortOptions: SortOption[] = [
    { value: 'name', label: 'Nama' },
    { value: 'nim', label: 'NIM' },
    { value: 'kelas', label: 'Kelas' },
    { value: 'semester', label: 'Semester' },
    { value: 'jurusan', label: 'Jurusan' },
    { value: 'createdAt', label: 'Tanggal Daftar' }
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
  let formData: CreateMahasiswaData = {
    name: '',
    email: '',
    password: '',
    nim: 0,
    kelas: '',
    phone: '',
    semester: 0,
    jurusanId: '',
    foto: ''
  };

  let formErrors: Partial<Record<keyof CreateMahasiswaData, string>> = {};

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
    loadDropdownData();
  });

  async function loadItems() {
    try {
      loading = true;
      error = '';
      items = await mahasiswaAPI.getAll();
      updateFilterOptions();
      totalPages = Math.ceil(items.length / itemsPerPage);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal memuat data mahasiswa');
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

  async function loadDropdownData() {
    try {
      campuses = await campusAPI.getAll();
    } catch (err) {
      console.error('Failed to load campuses:', err);
    }
  }

  async function loadFakultas(campusId: string) {
    try {
      if (campusId) {
        fakultas = await fakultasAPI.getAll(campusId);
        selectedFakultasId = '';
        jurusan = [];
      } else {
        fakultas = [];
        selectedFakultasId = '';
        jurusan = [];
      }
    } catch (err) {
      console.error('Failed to load fakultas:', err);
      fakultas = [];
    }
  }

  async function loadJurusan(fakultasId: string) {
    try {
      if (fakultasId) {
        jurusan = await jurusanAPI.getAll(fakultasId);
      } else {
        jurusan = [];
      }
    } catch (err) {
      console.error('Failed to load jurusan:', err);
      jurusan = [];
    }
  }

  function resetForm() {
    formData = {
      name: '',
      email: '',
      password: '',
      nim: 0,
      kelas: '',
      phone: '',
      semester: 0,
      jurusanId: '',
      foto: ''
    };
    formErrors = {};
    selectedCampusId = '';
    selectedFakultasId = '';
    fakultas = [];
    jurusan = [];
  }

  function openCreateModal() {
    resetForm();
    showCreateModal = true;
  }

  async function openEditModal(item: Mahasiswa) {
    selectedItem = item;
    formData = {
      name: item.name,
      email: item.email,
      password: '',
      nim: item.nim,
      kelas: item.kelas,
      phone: item.phone,
      semester: item.semester,
      jurusanId: item.jurusanId,
      foto: item.foto ?? ''
    };
    
    // Set dropdown values
    selectedCampusId = item.jurusan.fakultas.campus.id;
    selectedFakultasId = item.jurusan.fakultas.id;
    
    // Load fakultas and jurusan for the selected campus and fakultas
    await loadFakultas(selectedCampusId);
    await loadJurusan(selectedFakultasId);
    
    showEditModal = true;
  }

  function openDeleteModal(item: Mahasiswa) {
    selectedItem = item;
    showDeleteModal = true;
  }

  function closeModal() {
    showCreateModal = false;
    showEditModal = false;
    showDeleteModal = false;
    selectedItem = null;
    isSubmitting = false;
    showPassword = false;
    formErrors = {};
    resetForm();
  }

  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateForm(isCreate: boolean): boolean {
    formErrors = {};

    if (!formData.name.trim()) formErrors.name = 'Nama wajib diisi';
    if (!formData.email.trim()) formErrors.email = 'Email wajib diisi';
    else if (!validateEmail(formData.email)) formErrors.email = 'Format email tidak valid';

    if (isCreate) {
      if (!formData.password.trim()) formErrors.password = 'Password wajib diisi';
      else if (formData.password.length < 6) formErrors.password = 'Min. 6 karakter';
    } else if (formData.password && formData.password.length < 6) {
      formErrors.password = 'Min. 6 karakter';
    }

    if (!formData.nim || formData.nim <= 0) formErrors.nim = 'NIM wajib diisi dan harus berupa angka positif';
    if (!formData.kelas.trim()) formErrors.kelas = 'Kelas wajib diisi';
    if (!formData.phone.trim()) formErrors.phone = 'No. HP wajib diisi';
    if (!formData.jurusanId.trim()) formErrors.jurusanId = 'Jurusan wajib dipilih';

    return Object.keys(formErrors).length === 0;
  }

  async function createItem() {
    if (!validateForm(true)) return;
    try {
      isSubmitting = true;
      error = '';
      // Ensure nim is sent as number
      const createData = {
        ...formData,
        nim: Number(formData.nim)
      };
      await mahasiswaAPI.create(createData);
      await loadItems();
      closeModal();
      showAlert('success', 'Mahasiswa berhasil ditambahkan');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal menambahkan mahasiswa');
    } finally {
      isSubmitting = false;
    }
  }

  async function updateItem() {
    if (!selectedItem) return;
    if (!validateForm(false)) return;
    try {
      isSubmitting = true;
      error = '';
      const updateData: UpdateMahasiswaData = {
        name: formData.name,
        email: formData.email,
        nim: Number(formData.nim),
        kelas: formData.kelas,
        phone: formData.phone,
        jurusanId: formData.jurusanId,
        foto: formData.foto || undefined,
      };
      if (formData.password.trim()) updateData.password = formData.password;
      await mahasiswaAPI.update(selectedItem.id, updateData);
      await loadItems();
      closeModal();
      showAlert('success', 'Mahasiswa berhasil diperbarui');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal memperbarui mahasiswa');
    } finally {
      isSubmitting = false;
    }
  }

  async function deleteItem() {
    if (!selectedItem) return;
    try {
      error = '';
      await mahasiswaAPI.remove(selectedItem.id);
      await loadItems();
      closeModal();
      showAlert('success', 'Mahasiswa berhasil dihapus');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showAlert('error', 'Gagal menghapus mahasiswa');
    }
  }

  // Filter and sort mahasiswa
  $: filteredItems = items
    .filter((m) => {
      // Search filter
      const matchesSearch = m.name.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
        String(m.nim).includes(filterState.searchTerm) ||
        m.kelas.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
        m.jurusan.name.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
        m.jurusan.fakultas.name.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
        m.jurusan.fakultas.campus.name.toLowerCase().includes(filterState.searchTerm.toLowerCase());
      
      // Jurusan filter
      const matchesJurusan = filterState.selectedFilter === 'all' || m.jurusan.name === filterState.selectedFilter;
      
      return matchesSearch && matchesJurusan;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (filterState.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'nim':
          comparison = a.nim - b.nim;
          break;
        case 'kelas':
          comparison = a.kelas.localeCompare(b.kelas);
          break;
        case 'semester':
          comparison = a.semester - b.semester;
          break;
        case 'jurusan':
          comparison = a.jurusan.name.localeCompare(b.jurusan.name);
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
          searchPlaceholder="Cari mahasiswa..."
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
          label="Tambah Mahasiswa" 
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
        <Icon name={ICON_NAMES.MAHASISWA} size={64} />
        <h3>Tidak ada data mahasiswa</h3>
        <p>Mulai dengan menambahkan data mahasiswa</p>
      </div>
    {:else}
      <table class="data-table">
        <thead>
          <tr>
            <th>Mahasiswa</th>
            <th>NIM</th>
            <th>Kelas</th>
            <th>Semester</th>
            <th>Kampus</th>
            <th>Fakultas</th>
            <th>Jurusan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {#each paginatedItems as m}
            <tr>
              <td>
                <div class="item-info">
                  <div class="item-avatar">{m.name.split(' ').map(n => n[0]).join('')}</div>
                  <div style="display:flex; flex-direction:column; gap:4px;">
                    <span class="item-name">{m.name}</span>
                    <span style="color:#64748b; font-size:12px;">{m.email}</span>
                    <span style="color:#64748b; font-size:10px;">{m.phone}</span>
                  </div>
                </div>
              </td>
              <td>{m.nim}</td>
              <td>{m.kelas}</td>
              <td>{m.semester}</td>
              <td>{m.jurusan.fakultas.campus.name}</td>
              <td>{m.jurusan.fakultas.name}</td>
              <td>{m.jurusan.name}</td>
              <td>
                <div class="actions">
                  <button class="btn-icon edit" aria-label="Edit mahasiswa" on:click={() => openEditModal(m)}>
                    <Icon name={ICON_NAMES.EDIT} size={16} />
                  </button>
                  <button class="btn-icon delete" aria-label="Hapus mahasiswa" on:click={() => openDeleteModal(m)}>
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
    title={showCreateModal ? 'Tambah Mahasiswa' : 'Edit Mahasiswa'}
    subtitle={showCreateModal
      ? 'Lengkapi detail mahasiswa untuk menambahkan data baru'
      : 'Perbarui informasi mahasiswa. Kosongkan password jika tidak ingin mengubah'}
    {isSubmitting}
    submitLabel={showCreateModal ? 'Tambah Mahasiswa' : 'Update Mahasiswa'}
    on:submit={showCreateModal ? createItem : updateItem}
    on:close={closeModal}
  >
    <div class="form-row">
      <div class="form-group {formErrors.name ? 'error' : ''}">
        <label for="name">Nama</label>
        <input id="name" type="text" bind:value={formData.name} required placeholder="Masukkan nama lengkap" />
        {#if formErrors.name}<span class="input-error">{formErrors.name}</span>{/if}
      </div>

      <div class="form-group {formErrors.email ? 'error' : ''}">
        <label for="email">Email</label>
        <input id="email" type="email" bind:value={formData.email} required placeholder="Masukkan email" />
        {#if formErrors.email}<span class="input-error">{formErrors.email}</span>{/if}
      </div>
    </div>

    <div class="form-row">
      <div class="form-group password-group {formErrors.password ? 'error' : ''}">
        <label for="password">Password {showCreateModal ? '' : '(opsional)'}</label>
        <div class="password-input">
          <input id="password" type={showPassword ? 'text' : 'password'} bind:value={formData.password} required={showCreateModal} placeholder={showCreateModal ? 'Masukkan password' : 'Kosongkan jika tidak ingin mengubah'} />
          <button type="button" class="btn-eye" on:click={() => showPassword = !showPassword} aria-label="Toggle password">
            {#if showPassword}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2"/>
                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"/>
              </svg>
            {:else}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
            {/if}
          </button>
        </div>
        <div class="input-hint">Min. 6 karakter. Gunakan kombinasi huruf dan angka.</div>
        {#if formErrors.password}<span class="input-error">{formErrors.password}</span>{/if}
      </div>

      <div class="form-group {formErrors.nim ? 'error' : ''}">
        <label for="nim">NIM</label>
        <input id="nim" type="number" bind:value={formData.nim} required placeholder="Masukkan NIM" min="1" />
        {#if formErrors.nim}<span class="input-error">{formErrors.nim}</span>{/if}
      </div>
    </div>

    <div class="form-row">
      <div class="form-group {formErrors.kelas ? 'error' : ''}">
        <label for="kelas">Kelas</label>
        <input id="kelas" type="text" bind:value={formData.kelas} required placeholder="Contoh: TI-3A" />
        {#if formErrors.kelas}<span class="input-error">{formErrors.kelas}</span>{/if}
      </div>

      <div class="form-group {formErrors.phone ? 'error' : ''}">
        <label for="phone">No. HP</label>
        <input id="phone" type="text" bind:value={formData.phone} required placeholder="08xxxxxxxxxx" />
        {#if formErrors.phone}<span class="input-error">{formErrors.phone}</span>{/if}
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="campus">Kampus</label>
        <select id="campus" bind:value={selectedCampusId} on:change={() => loadFakultas(selectedCampusId)}>
          <option value="">Pilih Kampus</option>
          {#each campuses as campus}
            <option value={campus.id}>{campus.name}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label for="fakultas">Fakultas</label>
        <select id="fakultas" bind:value={selectedFakultasId} on:change={() => loadJurusan(selectedFakultasId)} disabled={!selectedCampusId}>
          <option value="">Pilih Fakultas</option>
          {#each fakultas as f}
            <option value={f.id}>{f.name}</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group {formErrors.jurusanId ? 'error' : ''}">
        <label for="jurusan">Jurusan</label>
        <select id="jurusan" bind:value={formData.jurusanId} disabled={!selectedFakultasId}>
          <option value="">Pilih Jurusan</option>
          {#each jurusan as j}
            <option value={j.id}>{j.name}</option>
          {/each}
        </select>
        {#if formErrors.jurusanId}<span class="input-error">{formErrors.jurusanId}</span>{/if}
      </div>

      <div class="form-group">
        <label for="foto">URL Foto (opsional)</label>
        <input id="foto" type="text" bind:value={formData.foto} placeholder="https://..." />
      </div>
    </div>
  </FormModal>
{/if}

{#if showDeleteModal}
  <DeleteModal
    show={showDeleteModal}
    message="Data mahasiswa"
    itemName={selectedItem?.name || ''}
    isDeleting={isSubmitting}
    on:confirm={deleteItem}
    on:close={closeModal}
  />
{/if}

<!-- Alert Component -->
<Alert 
  bind:show={alertShow} 
  type={alertType} 
  message={alertMessage} 
  on:hide={hideAlert}
/>

<style></style>
