<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let show = false;
  export let title = '';
  export let subtitle = '';
  export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  export let closable = true;
  export let loading = false;
  
  const dispatch = createEventDispatcher();
  
  function handleClose() {
    if (closable && !loading) {
      dispatch('close');
    }
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && closable && !loading) {
      handleClose();
    }
  }
  
  function handleOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget && closable && !loading) {
      handleClose();
    }
  }
</script>

{#if show}
  <div 
    class="modal-overlay" 
    role="presentation" 
    tabindex="-1" 
    on:keydown={handleKeydown} 
    on:click={handleOverlayClick}
  >
    <div 
      class="modal modal-{size}" 
      role="dialog" 
      tabindex="0" 
      aria-modal="true" 
      aria-label={title}
      on:click|stopPropagation 
      on:keydown={handleKeydown}
    >
      <div class="modal-header">
        <div>
          <h2>{title}</h2>
          {#if subtitle}
            <p class="modal-subtitle">{subtitle}</p>
          {/if}
        </div>
        {#if closable}
          <button 
            class="btn-close" 
            on:click={handleClose} 
            aria-label="Tutup modal"
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        {/if}
      </div>
      
      <div class="modal-body">
        <slot />
      </div>
      
      {#if $$slots.actions}
        <div class="modal-actions">
          <slot name="actions" />
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }
  
  .modal {
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .modal-sm { max-width: 400px; }
  .modal-md { max-width: 600px; }
  .modal-lg { max-width: 800px; }
  .modal-xl { max-width: 1000px; }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem 1.5rem 0 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 1.5rem;
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }
  
  .modal-subtitle {
    margin: 0.5rem 0 0 0;
    color: #6b7280;
    font-size: 0.875rem;
  }
  
  .btn-close {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 6px;
    color: #6b7280;
    transition: all 0.2s;
  }
  
  .btn-close:hover:not(:disabled) {
    background: #f3f4f6;
    color: #374151;
  }
  
  .btn-close:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .modal-body {
    padding: 0 1.5rem;
    flex: 1;
    overflow-y: auto;
  }
  
  .modal-actions {
    padding: 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }
  
  /* Responsive modal styles */
  @media (max-width: 768px) {
    .modal-overlay {
      padding: 0.5rem;
      align-items: flex-start;
      padding-top: 2rem;
    }
    
    .modal {
      max-height: calc(100vh - 4rem);
      border-radius: 8px;
    }
    
    .modal-sm, .modal-md, .modal-lg, .modal-xl {
      max-width: 100%;
    }
    
    .modal-header {
      padding: 1rem 1rem 0 1rem;
      margin-bottom: 1rem;
    }
    
    .modal-header h2 {
      font-size: 1.125rem;
    }
    
    .modal-subtitle {
      font-size: 0.8rem;
    }
    
    .modal-body {
      padding: 0 1rem;
    }
    
    .modal-actions {
      padding: 1rem;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .modal-actions :global(.btn) {
      width: 100%;
      justify-content: center;
    }
  }
  
  @media (max-width: 480px) {
    .modal-overlay {
      padding: 0.25rem;
      padding-top: 1rem;
    }
    
    .modal {
      max-height: calc(100vh - 2rem);
      border-radius: 6px;
    }
    
    .modal-header {
      padding: 0.75rem 0.75rem 0 0.75rem;
      margin-bottom: 0.75rem;
    }
    
    .modal-header h2 {
      font-size: 1rem;
    }
    
    .modal-subtitle {
      font-size: 0.75rem;
    }
    
    .modal-body {
      padding: 0 0.75rem;
    }
    
    .modal-actions {
      padding: 0.75rem;
    }
  }
</style>
