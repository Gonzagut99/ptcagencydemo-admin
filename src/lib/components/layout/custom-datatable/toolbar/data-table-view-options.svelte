<script lang="ts" generics="TData">
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		DropdownMenu,
		DropdownMenuLabel,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuSeparator,
		DropdownMenuCheckboxItem
	} from '$lib/components/ui/dropdown-menu';
	import { SlidersHorizontal } from '@lucide/svelte';
	import { useDatatableContext } from '../use-datatable-state.svelte';
	const table = useDatatableContext<TData>();

	const columns = table
		.getAllColumns()
		.filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide());
</script>

<DropdownMenu>
	<DropdownMenuTrigger>
		<Button variant="outline" size="sm" class="ml-auto hidden h-8 lg:flex">
			<SlidersHorizontal class="h-4 w-4" />
		</Button>
	</DropdownMenuTrigger>
	<DropdownMenuContent align="end" class="w-[150px]">
		<DropdownMenuLabel>Columnas</DropdownMenuLabel>
		<DropdownMenuSeparator />
		{#each columns as column (column.id)}
			{@const columnName = column.columnDef.meta?.title ?? column.id ?? column.columnDef.header}
			<DropdownMenuCheckboxItem
				checked={column.getIsVisible()}
				class="capitalize"
				onCheckedChange={(value) => column.toggleVisibility(!!value)}
			>
				<span class="truncate" title={columnName}>{columnName}</span>
			</DropdownMenuCheckboxItem>
		{/each}
	</DropdownMenuContent>
</DropdownMenu>
