<script lang="ts">
	import { dynamicRouteDictionaryContext } from '$lib/components/layout/custom-breadcrumb/route-breadcrumb-context';
	import { onMount } from 'svelte';

    let { children } = $props();

	onMount(() => {
		const dynamicRoutes: {
			slug: string;
			name: string;
		}[] = [
			{ slug: 'id', name: 'Detalle del Cliente' },
			{ slug: 'contactId', name: 'Detalle del Contacto' }
			// Add more dynamic routes and their titles here
		];
		dynamicRouteDictionaryContext.set(dynamicRoutes);
	});
</script>

{@render children()}
