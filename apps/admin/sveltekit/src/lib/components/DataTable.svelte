<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    width?: string;
  }> = [];

  export let data: any[] = [];
  export let loading = false;
  export let error = '';
  export let searchTerm = '';
  export let currentPage = 1;
  export let itemsPerPage = 10;
  export let emptyStateMessage = 'Tidak ada data';
  export let emptyStateIcon = '';
  export let showPagination = true;
  export let showSearch = true;
  export let searchPlaceholder = 'Cari...';
  export let actions = true;

  const dispatch = createEventDispatcher();

  // Derived values
  $: filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return Object.values(item).some(value => 
      String(value).toLowerCase().includes(q)
    );
  });

  $: paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  $: totalPages = Math.ceil(filteredData.length / itemsPerPage);

  function handleEdit(item: any) {
    dispatch('edit', item);
  }

  function handleDelete(item: any) {
    dispatch('delete', item);
  }

  function handleView(item: any) {
    dispatch('view', item);
  }

  function handlePageChange(page: number) {
    currentPage = page;
    dispatch('pageChange', page);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
</script>

<div class="data-table-container">
  {#if showSearch}
    <div class="search-container">
      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2"/>
        </svg>
        <input 
          type="text" 
          placeholder={searchPlaceholder} 
          bind:value={searchTerm}
          class="search-input"
        />
      </div>
    </div>
  {/if}

  {#if error}
    <div class="error-message">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
        <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
      </svg>
      {error}
    </div>
  {/if}

  <div class="table-container">
    {#if loading}
      <div class="loading">
        <div class="spinner"></div>
        <p>Memuat data...</p>
      </div>
    {:else if paginatedData.length === 0}
      <div class="empty-state">
        {#if emptyStateIcon}
          {@html emptyStateIcon}
        {:else}
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
          </svg>
        {/if}
        <h3>{emptyStateMessage}</h3>
        <p>Mulai dengan menambahkan data baru</p>
      </div>
    {:else}
      <table class="data-table">
        <thead>
          <tr>
            {#each columns as column}
              <th style="width: {column.width || 'auto'}">
                {column.label}
              </th>
            {/each}
            {#if actions}
              <th class="actions-header">Aksi</th>
            {/if}
          </tr>
        </thead>
        <tbody>
          {#each paginatedData as item, index}
            <tr>
              {#each columns as column}
                <td>
                  {#if column.key === 'createdAt' || column.key === 'updatedAt'}
                    {formatDate(item[column.key])}
                  {:else if column.key.includes('name') && !column.key.includes('email')}
                    <div class="item-info">
                      <div class="item-avatar">{getInitials(item[column.key])}</div>
                      <div class="item-details">
                        <span class="item-name">{item[column.key]}</span>
                        {#if item.email}
                          <span class="item-subtitle">{item.email}</span>
                        {/if}
                      </div>
                    </div>
                  {:else}
                    <span class="item-value">{item[column.key]}</span>
                  {/if}
                </td>
              {/each}
              {#if actions}
                <td>
                  <div class="actions">
                    <button 
                      class="btn-icon edit" 
                      aria-label="Edit" 
                      on:click={() => handleEdit(item)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </button>
                    <button 
                      class="btn-icon delete" 
                      aria-label="Hapus" 
                      on:click={() => handleDelete(item)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2"/>
                        <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>

  {#if showPagination && totalPages > 1}
    <div class="pagination">
      <button 
        class="btn-pagination" 
        disabled={currentPage === 1} 
        on:click={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </button>
      {#each Array(totalPages) as _, i}
        <button 
          class="btn-pagination {currentPage === i + 1 ? 'active' : ''}" 
          on:click={() => handlePageChange(i + 1)}
        >
          {i + 1}
        </button>
      {/each}
      <button 
        class="btn-pagination" 
        disabled={currentPage === totalPages} 
        on:click={() => handlePageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  {/if}
</div>

<style>
  .data-table-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .search-container {
    padding: 20px;
    border-bottom: 1px solid #e2e8f0;
  }

  .search-box {
    position: relative;
    max-width: 400px;
  }

  .search-box svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
  }

  .search-input {
    width: 100%;
    padding: 12px 12px 12px 40px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background: #f8fafc;
    transition: all 0.2s;
  }

  .search-input:focus {
    outline: none;
    border-color: #1E69DD;
    background: white;
    box-shadow: 0 0 0 3px rgba(30, 105, 221, 0.1);
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 20px;
    background: #fef2f2;
    color: #dc2626;
    border-left: 4px solid #dc2626;
    font-size: 14px;
  }

  .table-container {
    overflow-x: auto;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #64748b;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e2e8f0;
    border-top: 3px solid #1E69DD;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #64748b;
    text-align: center;
  }

  .empty-state svg {
    margin-bottom: 16px;
    opacity: 0.5;
  }

  .empty-state h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: #334155;
  }

  .empty-state p {
    margin: 0;
    font-size: 14px;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table th {
    padding: 16px 20px;
    text-align: left;
    font-weight: 600;
    color: #334155;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    font-size: 14px;
  }

  .actions-header {
    text-align: center;
    width: 120px;
  }

  .data-table td {
    padding: 16px 20px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 14px;
    color: #334155;
  }

  .data-table tr:hover {
    background: #f8fafc;
  }

  .item-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .item-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #1E69DD, #57D4D4);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 14px;
    flex-shrink: 0;
  }

  .item-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .item-name {
    font-weight: 600;
    color: #334155;
  }

  .item-subtitle {
    font-size: 12px;
    color: #64748b;
  }

  .item-value {
    color: #334155;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
  }

  .btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-icon.edit {
    color: #64748b;
  }

  .btn-icon.edit:hover {
    background: rgba(30, 105, 221, 0.1);
    color: #1E69DD;
  }

  .btn-icon.delete {
    color: #64748b;
  }

  .btn-icon.delete:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 20px;
    border-top: 1px solid #e2e8f0;
  }

  .btn-pagination {
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    background: white;
    color: #64748b;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }

  .btn-pagination:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #1E69DD;
    color: #1E69DD;
  }

  .btn-pagination.active {
    background: #1E69DD;
    border-color: #1E69DD;
    color: white;
  }

  .btn-pagination:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
