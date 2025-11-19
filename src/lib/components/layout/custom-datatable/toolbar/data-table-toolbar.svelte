<script lang="ts" generics="TData, TValue">
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import { X } from '@lucide/svelte';
	import { useDatatableContext } from '../use-datatable-state.svelte';
	import DataTableFacetedFilter, {
		type FacetedFilterOption
	} from './data-table-faceted-filter.svelte';
	import type { DataTableToolbarProps } from './data-table-toolbar.types.svelte';
	import DataTableViewOptions from './data-table-view-options.svelte';

	const table = useDatatableContext<TData>();

	let {
		//table,
		externalFilterValue = $bindable(table.getState().globalFilter ?? ''),
		filterPlaceholder,
		onGlobalFilterChange,
		toolbarActions,
		facetedFilters = []
	}: DataTableToolbarProps<TData, TValue> = $props();

	const currentFilterValue = $derived(externalFilterValue ?? table.getState().globalFilter ?? '');
	const isFiltered = $derived.by(() => {
		return table.getState().columnFilters.length > 0 || currentFilterValue !== '';
	});

	$effect(() => {
		if (currentFilterValue !== table.getState().globalFilter) {
			if (onGlobalFilterChange) {
				onGlobalFilterChange(currentFilterValue);
			} else {
				table.setGlobalFilter(currentFilterValue);
			}
		}
	});

	const handleFilterChange = (value: string) => {
		if (onGlobalFilterChange) {
			onGlobalFilterChange(value);
		} else {
			table.setGlobalFilter(value);
		}
	};

	const handleClearFilters = () => {
		table.resetColumnFilters();
		if (onGlobalFilterChange) {
			onGlobalFilterChange('');
		} else {
			table.setGlobalFilter('');
		}
	};
</script>

<div class="flex flex-col gap-2 sm:flex-row">
	<div
		class="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2"
	>
		<Input
			placeholder={filterPlaceholder}
			bind:value={externalFilterValue}
			class="h-8 w-[150px] lg:w-[250px]"
		/>
		<div class="flex flex-wrap items-center gap-2">
			{#each facetedFilters as filter (filter.column)}
				{@const column = table.getColumn(filter.column)}
				{#if column}
					<DataTableFacetedFilter
						{column}
						title={filter.title}
						options={filter.options as FacetedFilterOption<TValue>[]}
						filterStrategy={filter.filterStrategy}
						customOnSelect={filter.onFilterChange}
					/>
				{/if}
			{/each}
		</div>
		{#if isFiltered}
			<Button variant="ghost" onclick={handleClearFilters} class="h-8 px-2 lg:px-3">
				Limpiar
				<X class="ml-2 h-4 w-4" />
			</Button>
		{/if}
	</div>
	<div class="flex items-center space-x-2">
		<!-- {typeof toolbarActions === 'function' ? toolbarActions(table) : toolbarActions} -->
		{#if toolbarActions}
			{@render toolbarActions({
				table
			})}
		{/if}
		<!-- <DataTableViewOptions {table} /> -->
		<DataTableViewOptions />
	</div>
</div>
