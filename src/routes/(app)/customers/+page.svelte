<script lang="ts">
	import { useCustomers } from '$lib/api/queries/customers';
	import { columns } from '$lib/components/data-tables/customers/columns';
	import CustomerFilters from '$lib/components/data-tables/customers/filters.svelte';
	import CustomerForm from '$lib/components/customers/CustomerForm.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Plus } from 'lucide-svelte';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table';
	import {
		getCoreRowModel,
		getSortedRowModel,
		getFilteredRowModel,
		type SortingState,
		type ColumnFiltersState
	} from '@tanstack/table-core';
	import * as Table from '$lib/components/ui/table';

	// Pagination state
	let page = $state(0);
	let pageSize = $state(10);

	// Filter state
	let documentTypeFilter = $state('');
	let searchQuery = $state('');

	// Debounced search query
	let debouncedSearchQuery = $state('');
	let searchTimeout: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if (searchTimeout) clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			debouncedSearchQuery = searchQuery;
		}, 300);
	});

	// Query customers
	const customersQuery = $derived(useCustomers(page, pageSize));

	const data = $derived(customersQuery.data?.content || []);
	const totalPages = $derived(customersQuery.data?.page?.totalPages || 0);
	const totalElements = $derived(customersQuery.data?.page?.totalElements || 0);
	const isLoading = $derived(customersQuery.isLoading);

	// Table state
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);

	// Update column filters when filter state changes
	$effect(() => {
		const filters: ColumnFiltersState = [];

		if (debouncedSearchQuery) {
			filters.push({ id: 'firstName', value: debouncedSearchQuery });
		}

		if (documentTypeFilter) {
			filters.push({ id: 'idDocumentType', value: documentTypeFilter });
		}

		columnFilters = filters;
	});

	// Create table
	const table = $derived(
		createSvelteTable({
			data,
			columns,
			state: {
				sorting,
				columnFilters
			},
			onSortingChange: (updater) => {
				if (typeof updater === 'function') {
					sorting = updater(sorting);
				} else {
					sorting = updater;
				}
			},
			onColumnFiltersChange: (updater) => {
				if (typeof updater === 'function') {
					columnFilters = updater(columnFilters);
				} else {
					columnFilters = updater;
				}
			},
			getCoreRowModel: getCoreRowModel(),
			getSortedRowModel: getSortedRowModel(),
			getFilteredRowModel: getFilteredRowModel(),
			manualPagination: true,
			pageCount: totalPages
		})
	);

	// Dialog state
	let isDialogOpen = $state(false);

	function handleCustomerCreated() {
		isDialogOpen = false;
	}

	function nextPage() {
		if (page < totalPages - 1) {
			page++;
		}
	}

	function previousPage() {
		if (page > 0) {
			page--;
		}
	}

	function goToPage(pageNumber: number) {
		if (pageNumber >= 0 && pageNumber < totalPages) {
			page = pageNumber;
		}
	}
</script>

<div class="space-y-4">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Clientes</h1>
			<p class="text-sm text-muted-foreground">
				{totalElements} clientes en total
			</p>
		</div>
		<Dialog.Root bind:open={isDialogOpen}>
			<Dialog.Trigger>
				{#snippet child({ props })}
					<Button {...props}>
						<Plus class="mr-2 h-4 w-4" />
						Nuevo Cliente
					</Button>
				{/snippet}
			</Dialog.Trigger>
			<Dialog.Content class="max-h-[90vh] max-w-2xl overflow-y-auto">
				<Dialog.Header>
					<Dialog.Title>Crear Nuevo Cliente</Dialog.Title>
					<Dialog.Description>
						Completa el formulario para registrar un nuevo cliente en el sistema.
					</Dialog.Description>
				</Dialog.Header>
				<CustomerForm onSuccess={handleCustomerCreated} />
			</Dialog.Content>
		</Dialog.Root>
	</div>

	<!-- Filters -->
	<CustomerFilters bind:documentTypeFilter bind:searchQuery />

	<!-- Data Table -->
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup}
					<Table.Row>
						{#each headerGroup.headers as header}
							<Table.Head colspan={header.colSpan}>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#if isLoading}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">
							<div class="flex items-center justify-center">
								<div
									class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"
								></div>
								Cargando clientes...
							</div>
						</Table.Cell>
					</Table.Row>
				{:else if table.getRowModel().rows.length === 0}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">
							No se encontraron clientes.
						</Table.Cell>
					</Table.Row>
				{:else}
					{#each table.getRowModel().rows as row}
						<Table.Row data-state={row.getIsSelected() && 'selected'}>
							{#each row.getVisibleCells() as cell}
								<Table.Cell>
									<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</div>

	<!-- Pagination -->
	<div class="flex items-center justify-between">
		<div class="text-sm text-muted-foreground">
			Página {page + 1} de {totalPages} ({totalElements} clientes en total)
		</div>
		<div class="flex items-center gap-2">
			<Button variant="outline" size="sm" onclick={previousPage} disabled={page === 0}>
				Anterior
			</Button>

			<!-- Page numbers -->
			<div class="flex items-center gap-1">
				{#each Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
					const startPage = Math.max(0, Math.min(page - 2, totalPages - 5));
					return startPage + i;
				}) as pageNum}
					<Button
						variant={pageNum === page ? 'default' : 'outline'}
						size="sm"
						onclick={() => goToPage(pageNum)}
					>
						{pageNum + 1}
					</Button>
				{/each}
			</div>

			<Button variant="outline" size="sm" onclick={nextPage} disabled={page >= totalPages - 1}>
				Siguiente
			</Button>
		</div>
	</div>
</div>
