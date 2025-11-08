<script lang="ts">
	import { browser } from '$app/environment';
	import { sidebarStore } from '$lib/stores/sidebar.svelte';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { queryClient } from '$lib/api/queryClient';
	import '../app.css';

	let { children } = $props();

	// Initialize sidebar store if in browser
	if (browser) {
		sidebarStore.initialize();
	}
</script>

<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>
