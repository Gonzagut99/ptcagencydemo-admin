<script lang="ts">
	import { browser } from '$app/environment';
	import { sidebarStore } from '$lib/stores/sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/layout/custom-sidebar/app-sidebar.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import { DynamicRouteDictionaryContext, dynamicRouteDictionaryContext } from '$lib/components/layout/custom-breadcrumb/route-breadcrumb-context.svelte';
	import type { DynamicRouteDictionary } from '$lib/components/layout/custom-breadcrumb/dynamic-routes-breadcrumb.types';

	let { children } = $props();

	//CONFIGURACION NECESARIA PARA EL BREADCRUMB AUTOMATICO
	// Inicializar el contexto INMEDIATAMENTE con array vacío para que el breadcrumb no falle
	// Los layouts hijos pueden actualizarlo con sus rutas dinámicas en su onMount
	const dynamicRoutes: DynamicRouteDictionary[] = [];
	if (!dynamicRouteDictionaryContext.exists()) {
		dynamicRouteDictionaryContext.set(new DynamicRouteDictionaryContext());
		dynamicRouteDictionaryContext.get().dynamicRoutes = dynamicRoutes;
	}

	// Initialize sidebar store if in browser
	if (browser) {
		sidebarStore.initialize();
	}
</script>

<Sidebar.Provider
	style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
	<AppSidebar variant="inset" />
	<Sidebar.Inset>
		<SiteHeader />
		<article class="flex flex-1 flex-col">
			<div class="@container/main flex flex-1 flex-col gap-2">
				<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 md:px-6 lg:px-8 ">
					{@render children()}
				</div>
			</div>
		</article>
	</Sidebar.Inset>
</Sidebar.Provider>
