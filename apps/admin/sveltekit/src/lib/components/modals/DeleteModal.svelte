<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import BaseModal from './BaseModal.svelte';
  import {Icon, ICON_NAMES} from '$lib/components/icons';

  export let show = false;
  export let title = 'Konfirmasi Hapus';
  export let message = '';
  export let itemName = '';
  export let isDeleting = false;
  export let confirmLabel = 'Hapus';
  export let cancelLabel = 'Batal';
  
  const dispatch = createEventDispatcher();
  
  function handleConfirm() {
    dispatch('confirm');
  }
  
  function handleClose() {
    if (!isDeleting) {
      dispatch('close');
    }
  }
</script>

<BaseModal 
  {show} 
  {title} 
  size="sm"
  on:close={handleClose}
>
  <div class="delete-content">
    <div class="warning-icon">
      <Icon name={ICON_NAMES.WARNING} size={48} />
    </div>
    <h3>Apakah Anda yakin?</h3>
    <p>{message} <strong>{itemName}</strong> akan dihapus permanen.</p>
  </div>
  
  <div slot="actions" class="modal-actions">
    <button 
      type="button" 
      class="btn btn-secondary" 
      on:click={handleClose} 
      disabled={isDeleting}
    >
      {cancelLabel}
    </button>
    <button 
      type="button" 
      class="btn btn-danger" 
      on:click={handleConfirm} 
      disabled={isDeleting}
    >
      {#if isDeleting}
        <span class="btn-spinner"></span>
        <span>Menghapus...</span>
      {:else}
        <span>{confirmLabel}</span>
      {/if}
    </button>
  </div>
</BaseModal>

<style>
  .delete-content {
    text-align: center;
    padding: 1rem 0;
  }
  
  .warning-icon {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
    color: #f59e0b;
  }
  
  .delete-content h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
  }
  
  .delete-content p {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
  }
  
  .btn-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
