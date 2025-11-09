<script lang="ts">
	import { Collapsible as CollapsiblePrimitive, type WithoutChildrenOrChild } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	let {
		ref = $bindable(null),
		children,
		...restProps
	}: WithoutChildrenOrChild<CollapsiblePrimitive.ContentProps> & {
		children?: Snippet;
	} = $props();
</script>

<CollapsiblePrimitive.Content
	bind:ref
	data-slot="collapsible-content"
	{...restProps}
	forceMount={true}
>
	{#snippet child({ props, open })}
		{#if open}
			<div {...props} transition:slide>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</CollapsiblePrimitive.Content>
