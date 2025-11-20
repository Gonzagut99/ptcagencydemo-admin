<script lang="ts" generics="TData">
	import type { Table } from '@tanstack/svelte-table';
	import type { ServerPaginationTanstackTableConfig } from './custom-pagination-types';
	import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectTrigger
	} from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from '@lucide/svelte';

	interface DataTablePaginationProps<TData> {
		table: Table<TData>;
		serverPagination?: ServerPaginationTanstackTableConfig;
	}

	const { table, serverPagination }: DataTablePaginationProps<TData> = $props();
	const counRowOptions = [5, 10, 20, 30, 40, 50];
	// let selectValue = $state(table.getState().pagination.pageSize.toString());
	// const triggerContent = $derived(table.getState().pagination.pageSize);
</script>

<div class="flex items-center justify-between overflow-clip px-2">
	<div class="hidden flex-1 text-sm text-muted-foreground sm:block">
		{table.getFilteredSelectedRowModel().rows.length} de{' '}
		{serverPagination?.total ?? table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
	</div>
	<div class="flex items-center sm:space-x-6 lg:space-x-8">
		<div class="flex items-center space-x-2">
			<p class="hidden text-sm font-medium sm:block">Filas por página</p>
			<Select
				type="single"
				bind:value={
							() => `${table.getState().pagination.pageSize}`, (v) => table.setPageSize(Number(v))
						}
			>
				<SelectTrigger class="h-8 w-[70px]">
					{table.getState().pagination.pageSize}
				</SelectTrigger>
				<SelectContent side="top">
					<SelectGroup>
						{#each counRowOptions as pageSize (pageSize)}
							<SelectItem value={pageSize.toString()}>
								{pageSize}
							</SelectItem>
						{/each}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
		<div class="flex w-[100px] items-center justify-center text-sm font-medium">
			Página {table.getState().pagination.pageIndex + 1} de{' '}
			{serverPagination?.pageCount ?? table.getPageCount()}
		</div>
		<div class="flex items-center space-x-2">
			<Button
				type="button"
				variant="outline"
				class="hidden h-8 w-8 p-0 lg:flex"
				onclick={() => table.setPageIndex(0)}
				disabled={!table.getCanPreviousPage()}
			>
				<span class="sr-only">Ir a la primera página</span>
				<ChevronsLeft class="h-4 w-4" />
			</Button>
			<Button
				type="button"
				variant="outline"
				class="h-8 w-8 p-0"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				<span class="sr-only">Ir a la página anterior</span>
				<ChevronLeft class="h-4 w-4" />
			</Button>
			<Button
				type="button"
				variant="outline"
				class="h-8 w-8 p-0"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				<span class="sr-only">Ir a la página siguiente</span>
				<ChevronRight class="h-4 w-4" />
			</Button>
			<Button
				type="button"
				variant="outline"
				class="hidden h-8 w-8 p-0 lg:flex"
				onclick={() =>
					table.setPageIndex((serverPagination?.pageCount ?? table.getPageCount()) - 1)}
				disabled={!table.getCanNextPage()}
			>
				<span class="sr-only">Ir a la última página</span>
				<ChevronsRight class="h-4 w-4" />
			</Button>
		</div>
	</div>
</div>

<style>
	.overflow-clip {
		overflow-clip-margin: 1px;
	}
</style>
