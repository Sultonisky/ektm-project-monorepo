<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import BaseModal from './BaseModal.svelte';
  
  export let show = false;
  export let title = 'Detail';
  export let subtitle = '';
  
  const dispatch = createEventDispatcher();
  
  function handleClose() {
    dispatch('close');
  }
</script>

<BaseModal 
  {show} 
  {title} 
  {subtitle} 
  size="lg"
  on:close={handleClose}
>
  <slot />
  
  <div slot="actions" class="modal-actions">
    <button 
      type="button" 
      class="btn btn-secondary" 
      on:click={handleClose}
    >
      Tutup
    </button>
  </div>
</BaseModal>
