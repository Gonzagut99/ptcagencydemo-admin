<script lang="ts">
	import type { DynamicRouteDictionary } from '$lib/components/layout/custom-breadcrumb/dynamic-routes-breadcrumb.types';
	import { dynamicRouteDictionaryContext } from '$lib/components/layout/custom-breadcrumb/route-breadcrumb-context.svelte';

	let { children } = $props();

	const dynamicRoutes: DynamicRouteDictionary[] = [
		{ slug: 'userId', name: 'Detalle del usuario' },
		{ slug: 'contactId', name: 'Detalle del staff' }
	];

	dynamicRouteDictionaryContext.exists() &&
		(dynamicRouteDictionaryContext.get().dynamicRoutes = dynamicRoutes);

	// onDestroy(() => {
	// 	// Optionally clear the context when this layout is destroyed
	// 	dynamicRouteDictionaryContext.set([]);
	// });

	// const currentDynamicRoutes = $derived(dynamicRouteDictionaryContext.get());
	// $inspect(currentDynamicRoutes);
</script>

{@render children()}
