<script lang="ts">
	import favicon from '$lib/assets/images/logo/logo.png';
	import '$lib/styles/admin.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
