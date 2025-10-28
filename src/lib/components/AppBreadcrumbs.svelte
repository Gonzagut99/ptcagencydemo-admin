<script lang="ts">
	import { page } from '$app/state';
	import { ChevronRight, House } from '@lucide/svelte';

	interface Breadcrumb {
		label: string;
		href: string;
	}

	const routeLabels: Record<string, string> = {
		liquidaciones: 'Liquidaciones',
		clientes: 'Clientes',
		personal: 'Personal',
		notificaciones: 'Notificaciones',
		nueva: 'Nueva',
		editar: 'Editar',
		ver: 'Ver'
	};

	let breadcrumbs = $derived.by(() => {
		const path = page.url.pathname;
		
		// Home page
		if (path === '/') {
			return [{ label: 'Inicio', href: '/' }];
		}

		const segments = path.split('/').filter(Boolean);
		const crumbs: Breadcrumb[] = [{ label: 'Inicio', href: '/' }];

		let currentPath = '';
		for (const segment of segments) {
			currentPath += `/${segment}`;
			const label = routeLabels[segment] || segment;
			crumbs.push({
				label: label.charAt(0).toUpperCase() + label.slice(1),
				href: currentPath
			});
		}

		return crumbs;
	});
</script>

<nav aria-label="Breadcrumb" class="flex items-center space-x-2 text-sm">
	{#each breadcrumbs as crumb, index}
		{#if index > 0}
			<ChevronRight class="h-4 w-4 text-muted-foreground" />
		{/if}
		
		{#if index === breadcrumbs.length - 1}
			<span class="font-medium text-foreground">
				{crumb.label}
			</span>
		{:else}
			<a
				href={crumb.href}
				class="text-muted-foreground transition-colors hover:text-foreground"
			>
				{#if index === 0}
					<House class="h-4 w-4" />
				{:else}
					{crumb.label}
				{/if}
			</a>
		{/if}
	{/each}
</nav>
