<script context="module" lang="ts">
  export interface FilterOption {
    value: string;
    label: string;
  }

  export interface SortOption {
    value: string;
    label: string;
  }

  export interface FilterState {
    searchTerm: string;
    selectedFilter: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }
</script>

<script lang="ts">
  import { Icon, ICON_NAMES } from './icons';

  export let searchPlaceholder = 'Cari...';
  export let filterLabel = 'Filter:';
  export let sortLabel = 'Urutkan:';
  export let orderLabel = 'Arah:';
  export let resetLabel = 'Reset Filter';
  
  export let filterOptions: FilterOption[] = [];
  export let sortOptions: SortOption[] = [];
  
  export let filterState: FilterState;
  export let onFilterChange: (state: FilterState) => void;
  export let onReset: () => void;

  function handleSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const newState = { ...filterState, searchTerm: target.value };
    filterState = newState;
    onFilterChange(newState);
  }

  function handleFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newState = { ...filterState, selectedFilter: target.value };
    filterState = newState;
    onFilterChange(newState);
  }

  function handleSortChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newState = { ...filterState, sortBy: target.value };
    filterState = newState;
    onFilterChange(newState);
  }

  function handleOrderChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newState = { ...filterState, sortOrder: target.value as 'asc' | 'desc' };
    filterState = newState;
    onFilterChange(newState);
  }

  function handleReset() {
    onReset();
  }
</script>

<div class="filters">
  <div class="search-box">
    <Icon name={ICON_NAMES.SEARCH} size={16} />
    <input
      type="text"
      placeholder={searchPlaceholder}
      value={filterState.searchTerm}
      on:input={handleSearchChange}
    />
  </div>
  
  <div class="filter-controls">
    <!-- Dynamic Filter -->
    {#if filterOptions.length > 0}
      <div class="filter-group">
        <label for="filter-select">{filterLabel}</label>
        <select id="filter-select" value={filterState.selectedFilter} on:change={handleFilterChange}>
          {#each filterOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
    {/if}
    
    <!-- Sort By -->
    {#if sortOptions.length > 0}
      <div class="filter-group">
        <label for="sort-select">{sortLabel}</label>
        <select id="sort-select" value={filterState.sortBy} on:change={handleSortChange}>
          {#each sortOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
    {/if}
    
    <!-- Sort Order -->
    <div class="filter-group">
      <label for="order-select">{orderLabel}</label>
      <select id="order-select" value={filterState.sortOrder} on:change={handleOrderChange}>
        <option value="asc">A-Z / Terlama</option>
        <option value="desc">Z-A / Terbaru</option>
      </select>
    </div>
    
    <!-- Reset Button -->
    <button class="btn btn-secondary btn-sm" on:click={handleReset}>
      <Icon name={ICON_NAMES.X} size={14} />
      {resetLabel}
    </button>
  </div>
</div>

<style>
  .filters {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    height: 100%;
    justify-content: flex-end;
  }

  .search-box {
    position: relative;
    display: flex;
    align-items: center;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
    transition: border-color 0.2s;
  }

  .search-box:focus-within {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  .search-box input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.875rem;
    margin-left: 0.5rem;
  }

  .filter-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: end;
    margin-top: auto;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 120px;
  }

  .filter-group label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #6c757d;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .filter-group select {
    padding: 0.5rem 0.75rem;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    background: white;
    font-size: 0.875rem;
    color: #495057;
    transition: border-color 0.2s;
  }

  .filter-group select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  .btn-sm {
    padding: 0.60rem 0.75rem;
    font-size: 0.75rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .btn-secondary {
    background: #3a92ea;
    color: white;
    border: 1px solid;
  }

  .btn-secondary:hover {
    background: #2980d6;
    border-color: #2980d6;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .filters {
      padding: 0.75rem;
      margin-bottom: 1rem;
    }
    
    .filter-controls {
      flex-direction: column;
      align-items: stretch;
      gap: 0.75rem;
    }

    .filter-group {
      min-width: auto;
    }
    
    .search-box {
      margin-bottom: 0.5rem;
    }
    
    .btn-sm {
      width: 100%;
      justify-content: center;
    }
  }
  
  @media (max-width: 480px) {
    .filters {
      padding: 0.5rem;
    }
    
    .filter-group label {
      font-size: 0.7rem;
    }
    
    .filter-group select {
      padding: 0.4rem 0.6rem;
      font-size: 0.8rem;
    }
    
    .search-box input {
      font-size: 0.8rem;
    }
  }
</style>
