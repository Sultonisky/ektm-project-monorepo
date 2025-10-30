<script lang="ts">
  import { Icon, ICON_NAMES } from './icons';

  export let label: string = 'Tambah';
  export let icon: string = ICON_NAMES.PLUS;
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let onClick: () => void = () => {};

  function handleClick() {
    if (!disabled && !loading) {
      onClick();
    }
  }
</script>

<button 
  class="btn btn-primary add-button" 
  class:disabled 
  class:loading
  on:click={handleClick}
  {disabled}
>
  {#if loading}
    <div class="spinner"></div>
  {:else}
    <Icon name={icon} size={16} />
  {/if}
  <span class="button-text">{label}</span>
</button>

<style>
  .add-button.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .add-button.loading {
    cursor: not-allowed;
  }

  .button-text {
    white-space: nowrap;
  }

  /* Loading spinner */
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .add-button {
      width: 100%;
      justify-content: center;
    }
  }
</style>
