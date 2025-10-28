<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { sidebarStore } from '$lib/stores/sidebar.svelte';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { queryClient } from '$lib/api/queryClient';
	import '../app.css';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import SiteHeader from '$lib/components/site-header.svelte';
	import SectionCards from '$lib/components/section-cards.svelte';
	import ChartAreaInteractive from '$lib/components/chart-area-interactive.svelte';
	import DataTable from '$lib/components/data-table.svelte';
	import data from './dashboard-01/data'

	let { children } = $props();

	// Initialize sidebar store if in browser
	if (browser) {
		sidebarStore.initialize();
	}

	let isLoginPage = $derived(page.url.pathname === '/login');
</script>

<QueryClientProvider client={queryClient}>
	{#if isLoginPage}
		{@render children()}
	{:else}
		<Sidebar.Provider
			style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
		>
			<Sidebar.Inset>
				<SiteHeader />
				<div class="flex flex-1 flex-col">
					<div class="@container/main flex flex-1 flex-col gap-2">
						<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
							<SectionCards />
							<div class="px-4 lg:px-6">
								<ChartAreaInteractive />
							</div>
							<DataTable {data} />
						</div>
					</div>
				</div>
			</Sidebar.Inset>
		</Sidebar.Provider>
	{/if}
</QueryClientProvider>
