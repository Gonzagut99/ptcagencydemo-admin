<script>
	import Badge from "$lib/components/ui/badge/badge.svelte";
    const { children } = $props();

</script>

<Badge class="rounded-full px-1 py-0 text-xs">
	{#if children}
		{@render children()}
	{/if}
</Badge>
