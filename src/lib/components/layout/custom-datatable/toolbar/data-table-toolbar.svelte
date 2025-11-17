<script lang="ts" generics="TData, TValue">
	import Input from '$lib/components/ui/input/input.svelte';
	import type { DataTableToolbarProps } from './data-table-toolbar.types.svelte';

	let {
		table,
		externalFilterValue = $bindable(table.getState().globalFilter ?? ''),
		facetedFilters,
		filterPlaceholder,
		onGlobalFilterChange,
		toolbarActions
	}: DataTableToolbarProps<TData, TValue> = $props();

	const currentFilterValue = externalFilterValue ?? table.getState().globalFilter ?? '';
	const isFiltered = table.getState().columnFilters.length > 0 || currentFilterValue !== '';

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
			<!-- {facetedFilters.map((filter) => {
                        const column = table.getColumn(filter.column);
                        return (
                            column && (
                                <DataTableFacetedFilter
                                    //key={filter.column}
                                    column={column}
                                    title={filter.title}
                                    options={filter.options}
                                />
                            )
                        );
                    })} -->
		</div>
		<!-- {isFiltered && (
                    <Button variant="ghost" onClick={handleClearFilters} className="h-8 px-2 lg:px-3">
                        Limpiar
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )} -->
	</div>
	<div class="flex items-center space-x-2">
		<!-- {typeof toolbarActions === 'function' ? toolbarActions(table) : toolbarActions} -->
		{#if toolbarActions}
            {@render toolbarActions({
                table
            })}
        {/if}
		<DataTableViewOptions {table} />
	</div>
</div>
