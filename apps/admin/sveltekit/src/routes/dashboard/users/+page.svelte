<script lang="ts">
  import { onMount } from 'svelte';
  import { usersAPI, type User, type CreateUserData, type UpdateUserData } from '$lib/api';
  import Alert from '$lib/components/Alert.svelte';
  import { FormModal, DeleteModal } from '$lib/components/modals';
  import { Icon, ICON_NAMES } from '$lib/components/icons';
  import FilterControls, { type FilterState, type FilterOption, type SortOption } from '$lib/components/FilterControls.svelte';
  import AddButton from '$lib/components/AddButton.svelte';
  import profileDefault from '$lib/assets/images/profile/profile-default.jpeg';
  import profileAdmin from '$lib/assets/images/profile/admin.jpeg';

  let users: User[] = [];
  let loading = true;
  let error = '';
  let showCreateModal = false;
  let showEditModal = false;
  let showDeleteModal = false;
  let selectedUser: User | null = null;
  // Filter and Sort state
  let filterState: FilterState = {
    searchTerm: '',
    selectedFilter: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  };

  // Filter and Sort options
  const filterOptions: FilterOption[] = [
    { value: 'all', label: 'Semua Role' },
    { value: 'admin', label: 'Admin' },
    { value: 'mahasiswa', label: 'Mahasiswa' }
  ];

  const sortOptions: SortOption[] = [
    { value: 'name', label: 'Nama' },
    { value: 'email', label: 'Email' },
    { value: 'role', label: 'Role' },
    { value: 'createdAt', label: 'Tanggal Dibuat' }
  ];
  
  // Alert state
  let alertShow = false;
  let alertType: 'success' | 'error' | 'warning' | 'info' = 'info';
  let alertMessage = '';

  // Form data
  let formData: CreateUserData = {
    name: '',
    email: '',
    password: '',
    role: 'admin',
    foto: ''
  };

  // Form state helpers
  let isSubmitting = false;
  let showModalPassword = false;
  let formErrors: { name?: string; email?: string; password?: string } = {};

  // Pagination
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;

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
    loadUsers();
  });

  async function loadUsers() {
    try {
      loading = true;
      error = '';
      users = await usersAPI.getAllUsers();
      totalPages = Math.ceil(users.length / itemsPerPage);
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred';
      showAlert('error', 'Gagal memuat data user');
    } finally {
      loading = false;
    }
  }

  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateForm(isCreate: boolean): boolean {
    formErrors = {};
    if (!formData.name.trim()) formErrors.name = 'Nama wajib diisi';
    if (!formData.email.trim()) {
      formErrors.email = 'Email wajib diisi';
    } else if (!validateEmail(formData.email)) {
      formErrors.email = 'Format email tidak valid';
    }
    if (isCreate) {
      if (!formData.password.trim()) formErrors.password = 'Password wajib diisi';
      else if (formData.password.length < 6) formErrors.password = 'Min. 6 karakter';
    } else if (formData.password && formData.password.length < 6) {
      formErrors.password = 'Min. 6 karakter';
    }
    return Object.keys(formErrors).length === 0;
  }

  async function createUser() {
    if (!validateForm(true)) return;
    try {
      isSubmitting = true;
      error = '';
      await usersAPI.createUser(formData);
      await loadUsers();
      closeModal();
      resetForm();
      showAlert('success', 'User berhasil ditambahkan');
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred';
      showAlert('error', 'Gagal menambahkan user');
    } finally {
      isSubmitting = false;
    }
  }

  async function updateUser() {
    if (!selectedUser) return;
    if (!validateForm(false)) return;

    try {
      isSubmitting = true;
      error = '';
      const updateData: UpdateUserData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        foto: formData.foto
      };
      // Only include password if it's provided
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }
      await usersAPI.updateUser(selectedUser.id, updateData);
      await loadUsers();
      closeModal();
      resetForm();
      showAlert('success', 'User berhasil diperbarui');
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred';
      showAlert('error', 'Gagal memperbarui user');
    } finally {
      isSubmitting = false;
    }
  }

  async function deleteUser() {
    if (!selectedUser) return;

    try {
      error = '';
      await usersAPI.deleteUser(selectedUser.id);
      await loadUsers();
      closeModal();
      showAlert('success', 'User berhasil dihapus');
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred';
      showAlert('error', 'Gagal menghapus user');
    }
  }

  function openCreateModal() {
    resetForm();
    showCreateModal = true;
  }

  function openEditModal(user: User) {
    selectedUser = user;
    formData = {
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      foto: user.foto || ''
    };
    showEditModal = true;
  }

  function openDeleteModal(user: User) {
    selectedUser = user;
    showDeleteModal = true;
  }

  function closeModal() {
    showCreateModal = false;
    showEditModal = false;
    showDeleteModal = false;
    selectedUser = null;
    formErrors = {};
    isSubmitting = false;
    showModalPassword = false;
    resetForm();
  }

  function resetForm() {
    formData = {
      name: '',
      email: '',
      password: '',
      role: 'admin',
      foto: ''
    };
  }

  // Filter and sort users
  $: filteredUsers = users
    .filter(user => {
      // Search filter
      const matchesSearch = user.name.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(filterState.searchTerm.toLowerCase());
      
      // Role filter
      const matchesRole = filterState.selectedFilter === 'all' || user.role === filterState.selectedFilter;
      
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (filterState.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'role':
          comparison = a.role.localeCompare(b.role);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return filterState.sortOrder === 'asc' ? comparison : -comparison;
    });

  // Pagination
  $: paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  $: totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

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
          searchPlaceholder="Cari user..."
          filterLabel="Filter Role:"
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
          label="Tambah User" 
          icon={ICON_NAMES.PLUS}
          onClick={openCreateModal}
        />
      </div>
    </div>

    <!-- Error Message -->
    {#if error}
      <div class="error-message">
        <Icon name={ICON_NAMES.X} size={16} />
        {error}
      </div>
    {/if}
  </div>

  <!-- Scrollable Content Section -->
  <div class="scrollable-content">
    <!-- Users Table -->
    <div class="table-container">
    {#if loading}
      <div class="loading">
        <div class="spinner"></div>
        <p>Memuat data...</p>
      </div>
    {:else if paginatedUsers.length === 0}
      <div class="empty-state">
        <Icon name={ICON_NAMES.USERS} size={64} />
        <h3>Tidak ada user ditemukan</h3>
        <p>Mulai dengan menambahkan user baru</p>
      </div>
    {:else}
      <table class="data-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Tanggal Dibuat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {#each paginatedUsers as user}
            <tr>
              <td>
                <div class="item-info">
                  <div class="item-avatar">
                    <img src={user.foto || (user.role === 'admin' ? profileAdmin : profileDefault)} alt={user.name} />
                  </div>
                  <span class="item-name">{user.name}</span>
                </div>
              </td>
              <td>{user.email}</td>
              <td>
                <span class="role-badge {user.role}">
                  {user.role === 'admin' ? 'Admin' : 'Mahasiswa'}
                </span>
              </td>
              <td>{formatDate(user.createdAt)}</td>
              <td>
                <div class="actions">
                  <button class="btn-icon edit" aria-label="Edit user" on:click={() => openEditModal(user)}>
                    <Icon name={ICON_NAMES.EDIT} size={16} />
                  </button>
                  <button class="btn-icon delete" aria-label="Hapus user" on:click={() => openDeleteModal(user)}>
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

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="pagination">
        <button 
          class="btn-pagination" 
          disabled={currentPage === 1}
          on:click={() => currentPage--}
        >
          Previous
        </button>
        
        {#each Array(totalPages) as _, i}
          <button 
            class="btn-pagination {currentPage === i + 1 ? 'active' : ''}"
            on:click={() => currentPage = i + 1}
          >
            {i + 1}
          </button>
        {/each}
        
        <button 
          class="btn-pagination" 
          disabled={currentPage === totalPages}
          on:click={() => currentPage++}
        >
          Next
        </button>
      </div>
    {/if}
  </div>
</div>

<!-- Create/Edit Modal -->
<FormModal
  show={showCreateModal || showEditModal}
  title={showCreateModal ? 'Tambah User Baru' : 'Edit User'}
  subtitle={showCreateModal 
    ? 'Lengkapi detail user untuk menambahkan akun baru'
    : 'Perbarui informasi user. Kosongkan password jika tidak ingin mengubah'}
  {isSubmitting}
  submitLabel={showCreateModal ? 'Tambah User' : 'Update User'}
  on:submit={showCreateModal ? createUser : updateUser}
  on:close={closeModal}
>
  <div class="form-row">
    <div class="form-group {formErrors.name ? 'error' : ''}">
      <label for="name">Nama</label>
      <input
        id="name"
        type="text"
        bind:value={formData.name}
        required
        placeholder="Masukkan nama lengkap"
      />
      {#if formErrors.name}
        <span class="input-error">{formErrors.name}</span>
      {/if}
    </div>

    <div class="form-group {formErrors.email ? 'error' : ''}">
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        bind:value={formData.email}
        required
        placeholder="Masukkan email"
      />
      {#if formErrors.email}
        <span class="input-error">{formErrors.email}</span>
      {/if}
    </div>
  </div>

  <div class="form-row">
    <div class="form-group password-group {formErrors.password ? 'error' : ''}">
      <label for="password">Password {showCreateModal ? '' : '(opsional)'}</label>
      <div class="password-input">
        <input
          id="password"
          type={showModalPassword ? 'text' : 'password'}
          bind:value={formData.password}
          required={showCreateModal}
          placeholder={showCreateModal ? 'Masukkan password' : 'Kosongkan jika tidak ingin mengubah'}
        />
        <button type="button" class="btn-eye" on:click={() => showModalPassword = !showModalPassword} aria-label="Toggle password">
          {#if showModalPassword}
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
      {#if formErrors.password}
        <span class="input-error">{formErrors.password}</span>
      {/if}
    </div>

    <div class="form-group">
      <label for="role">Role</label>
      <select id="role" bind:value={formData.role}>
        <option value="admin">Admin</option>
        <option value="mahasiswa">Mahasiswa</option>
      </select>
    </div>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="foto">Foto URL (opsional)</label>
      <input
        id="foto"
        type="url"
        bind:value={formData.foto}
        placeholder="https://..."
      />
    </div>
  </div>
</FormModal>

<!-- Delete Confirmation Modal -->
<DeleteModal
  show={showDeleteModal}
  message="User"
  itemName={selectedUser?.name || ''}
  isDeleting={isSubmitting}
  on:confirm={deleteUser}
  on:close={closeModal}
/>

<!-- Alert Component -->
<Alert 
  bind:show={alertShow} 
  type={alertType} 
  message={alertMessage} 
  on:hide={hideAlert}
/>

<style>
  .item-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
</style>
