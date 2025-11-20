<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { EllipsisVertical } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	interface DataTableActionsProps {
		children?: Snippet<[]>;
	}
	const { children }: DataTableActionsProps = $props();
</script>

<DropdownMenu>
	<DropdownMenuTrigger class="flex size-8 text-muted-foreground data-[state=open]:bg-muted">
		{#snippet child({ props })}
			<Button variant="ghost" size="icon" {...props}>
				<EllipsisVertical />
				<span class="sr-only">Abrir Menu</span>
			</Button>
		{/snippet}
	</DropdownMenuTrigger>
	<DropdownMenuContent align="end" class="w-32">
		{#if children}
			{@render children()}
		{/if}
	</DropdownMenuContent>
</DropdownMenu>
