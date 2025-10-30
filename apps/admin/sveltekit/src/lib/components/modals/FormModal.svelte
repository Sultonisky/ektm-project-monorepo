<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import BaseModal from './BaseModal.svelte';
  
  export let show = false;
  export let title = '';
  export let subtitle = '';
  export let isSubmitting = false;
  export let submitLabel = 'Simpan';
  export let cancelLabel = 'Batal';
  export let submitDisabled = false;
  
  const dispatch = createEventDispatcher();
  
  function handleSubmit(event: Event) {
    event.preventDefault();
    dispatch('submit');
  }
  
  function handleClose() {
    if (!isSubmitting) {
      dispatch('close');
    }
  }
</script>

<BaseModal 
  {show} 
  {title} 
  {subtitle} 
  size="lg"
  on:close={handleClose}
>
  <form on:submit={handleSubmit}>
    <slot />
    
    <div class="modal-actions">
      <button 
        type="button" 
        class="btn btn-secondary" 
        on:click={handleClose} 
        disabled={isSubmitting}
      >
        {cancelLabel}
      </button>
      <button 
        type="submit" 
        class="btn btn-primary" 
        disabled={isSubmitting || submitDisabled}
      >
        {#if isSubmitting}
          <span class="btn-spinner"></span>
          <span>Menyimpan...</span>
        {:else}
          <span>{submitLabel}</span>
        {/if}
      </button>
    </div>
  </form>
</BaseModal>

<style>
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
