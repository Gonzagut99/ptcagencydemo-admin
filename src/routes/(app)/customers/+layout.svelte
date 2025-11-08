<script lang="ts">
	import type { DynamicRouteDictionary } from '$lib/components/layout/custom-breadcrumb/dynamic-routes-breadcrumb.types';
	import { dynamicRouteDictionaryContext } from '$lib/components/layout/custom-breadcrumb/route-breadcrumb-context';

	let { children } = $props();

	const dynamicRoutes: DynamicRouteDictionary[] = [
		{ slug: 'id', name: 'Detalle del Cliente' },
		{ slug: 'contactId', name: 'Detalle del Contacto' }
	];

	dynamicRouteDictionaryContext.set(dynamicRoutes);

	// onDestroy(() => {
	// 	// Optionally clear the context when this layout is destroyed
	// 	dynamicRouteDictionaryContext.set([]);
	// });

	// const currentDynamicRoutes = $derived(dynamicRouteDictionaryContext.get());
	// $inspect(currentDynamicRoutes);
</script>

{@render children()}
