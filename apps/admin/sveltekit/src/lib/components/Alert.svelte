<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  export let type: 'success' | 'error' | 'warning' | 'info' = 'info';
  export let message: string = '';
  export let duration: number = 5000; // Auto-hide after 5 seconds
  export let show: boolean = false;

  const dispatch = createEventDispatcher();

  let timeoutId: number | null = null;

  $: if (show && duration > 0) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      hide();
    }, duration);
  }

  function hide() {
    show = false;
    dispatch('hide');
  }

  function handleClose() {
    if (timeoutId) clearTimeout(timeoutId);
    hide();
  }

  onMount(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  });
</script>

{#if show}
  <div class="alert alert-{type}" role="alert">
    <div class="alert-content">
      <div class="alert-icon">
        {#if type === 'success'}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          </svg>
        {:else if type === 'error'}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
          </svg>
        {:else if type === 'warning'}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" stroke="currentColor" stroke-width="2"/>
          </svg>
        {:else}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 16v-4" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8h.01" stroke="currentColor" stroke-width="2"/>
          </svg>
        {/if}
      </div>
      <div class="alert-message">
        <p>{message}</p>
      </div>
      <button class="alert-close" on:click={handleClose} aria-label="Tutup alert">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    </div>
  </div>
{/if}

<style>
  .alert {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    max-width: 400px;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    animation: slideIn 0.3s ease-out;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .alert:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }

  .alert-content {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 20px;
  }

  .alert-icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    transition: transform 0.2s ease;
  }

  .alert:hover .alert-icon {
    transform: scale(1.05);
  }

  .alert-message {
    flex: 1;
    min-width: 0;
  }

  .alert-message p {
    margin: 0;
    font-weight: 600;
    line-height: 1.5;
    font-size: 14px;
  }

  .alert-close {
    flex-shrink: 0;
    background: none;
    border: none;
    padding: 6px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s ease;
    opacity: 0.7;
  }

  .alert-close:hover {
    background-color: rgba(0, 0, 0, 0.1);
    opacity: 1;
    transform: scale(1.1);
  }

  /* Alert Types */
  .alert-success {
    background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
    border: 1px solid #1E69DD;
    color: #1e3a8a;
    box-shadow: 0 4px 20px rgba(30, 105, 221, 0.15);
  }

  .alert-success .alert-icon {
    background: linear-gradient(135deg, #1E69DD, #3b82f6);
    color: white;
  }

  .alert-error {
    background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
    border: 1px solid #dc2626;
    color: #991b1b;
    box-shadow: 0 4px 20px rgba(220, 38, 38, 0.15);
  }

  .alert-error .alert-icon {
    background: linear-gradient(135deg, #dc2626, #ef4444);
    color: white;
  }

  .alert-warning {
    background: linear-gradient(135deg, #ffffff 0%, #fffbeb 100%);
    border: 1px solid #d97706;
    color: #92400e;
    box-shadow: 0 4px 20px rgba(217, 119, 6, 0.15);
  }

  .alert-warning .alert-icon {
    background: linear-gradient(135deg, #d97706, #f59e0b);
    color: white;
  }

  .alert-info {
    background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
    border: 1px solid #0ea5e9;
    color: #0c4a6e;
    box-shadow: 0 4px 20px rgba(14, 165, 233, 0.15);
  }

  .alert-info .alert-icon {
    background: linear-gradient(135deg, #0ea5e9, #3b82f6);
    color: white;
  }

  /* Hover effects for each alert type */
  .alert-success:hover {
    box-shadow: 0 15px 35px rgba(30, 105, 221, 0.25);
  }

  .alert-error:hover {
    box-shadow: 0 15px 35px rgba(220, 38, 38, 0.25);
  }

  .alert-warning:hover {
    box-shadow: 0 15px 35px rgba(217, 119, 6, 0.25);
  }

  .alert-info:hover {
    box-shadow: 0 15px 35px rgba(14, 165, 233, 0.25);
  }

  /* Animations */
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  /* Responsive */
  @media (max-width: 640px) {
    .alert {
      top: 10px;
      right: 10px;
      left: 10px;
      max-width: none;
    }
  }
</style>
