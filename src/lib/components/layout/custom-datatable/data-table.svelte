<script lang="ts" module>
	export { DragHandle };
	// export const columns: ColumnDef<Schema>[] = [
	// 	{
	// 		id: 'drag',
	// 		header: () => null,
	// 		cell: () => renderSnippet(DragHandle)
	// 	},
	// 	{
	// 		id: 'select',
	// 		header: ({ table }) =>
	// 			renderComponent(DataTableCheckbox, {
	// 				checked: table.getIsAllPageRowsSelected(),
	// 				indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
	// 				onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
	// 				'aria-label': 'Select all'
	// 			}),
	// 		cell: ({ row }) =>
	// 			renderComponent(DataTableCheckbox, {
	// 				checked: row.getIsSelected(),
	// 				onCheckedChange: (value) => row.toggleSelected(!!value),
	// 				'aria-label': 'Select row'
	// 			}),
	// 		enableSorting: false,
	// 		enableHiding: false
	// 	},
	// 	{
	// 		accessorKey: 'header',
	// 		header: 'Header',
	// 		cell: ({ row }) => renderComponent(DataTableCellViewer, { item: row.original }),
	// 		enableHiding: false
	// 	},
	// 	{
	// 		accessorKey: 'type',
	// 		header: 'Section Type',
	// 		cell: ({ row }) => renderSnippet(DataTableType, { row })
	// 	},
	// 	{
	// 		accessorKey: 'status',
	// 		header: 'Status',
	// 		cell: ({ row }) => renderSnippet(DataTableStatus, { row })
	// 	},
	// 	{
	// 		accessorKey: 'target',
	// 		header: () =>
	// 			renderSnippet(
	// 				createRawSnippet(() => ({
	// 					render: () => '<div class="w-full text-right">Target</div>'
	// 				}))
	// 			),
	// 		cell: ({ row }) => renderSnippet(DataTableTarget, { row })
	// 	},
	// 	{
	// 		accessorKey: 'limit',
	// 		header: () =>
	// 			renderSnippet(
	// 				createRawSnippet(() => ({
	// 					render: () => '<div class="w-full text-right">Limit</div>'
	// 				}))
	// 			),
	// 		cell: ({ row }) => renderSnippet(DataTableLimit, { row })
	// 	},
	// 	{
	// 		id: 'actions',
	// 		cell: () => renderSnippet(DataTableActions)
	// 	}
	// ];
	export const datatableStateContextKey = Symbol('datatable-state-key');
</script>

<script lang="ts" generics="TData extends BasicEntity, TValue">
	import {
		getCoreRowModel,
		getFacetedRowModel,
		getFacetedUniqueValues,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		type ColumnDef,
		type ColumnFiltersState,
		type FilterFn,
		type PaginationState,
		type Row,
		type RowSelectionState,
		type SortingState,
		type TableOptions,
		type VisibilityState
	} from '@tanstack/svelte-table';
	import type { Attachment } from 'svelte/attachments';
	import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
	import { createSvelteTable } from '$lib/components/ui/data-table/data-table.svelte.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import {
		FlexRender,
		renderComponent,
		renderSnippet
	} from '$lib/components/ui/data-table/index.js';
	import LayoutColumnsIcon from '@tabler/icons-svelte/icons/layout-columns';
	import GripVerticalIcon from '@tabler/icons-svelte/icons/grip-vertical';
	import ChevronDownIcon from '@tabler/icons-svelte/icons/chevron-down';
	import PlusIcon from '@tabler/icons-svelte/icons/plus';
	import ChevronsLeftIcon from '@tabler/icons-svelte/icons/chevrons-left';
	import ChevronLeftIcon from '@tabler/icons-svelte/icons/chevron-left';
	import ChevronRightIcon from '@tabler/icons-svelte/icons/chevron-right';
	import ChevronsRightIcon from '@tabler/icons-svelte/icons/chevrons-right';
	import CircleCheckFilledIcon from '@tabler/icons-svelte/icons/circle-check-filled';
	import LoaderIcon from '@tabler/icons-svelte/icons/loader';
	import DotsVerticalIcon from '@tabler/icons-svelte/icons/dots-vertical';
	import { toast } from 'svelte-sonner';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import DataTableCellViewer from './data-table-cell-viewer.svelte';
	import { createRawSnippet, onMount, setContext, untrack } from 'svelte';
	import { DragDropProvider } from '@dnd-kit-svelte/svelte';
	import { move } from '@dnd-kit/helpers';
	import { useSortable } from '@dnd-kit-svelte/svelte/sortable';
	import { Database } from '@lucide/svelte';
	import { setDatatableState, useDatatableContext } from './use-datatable-state.svelte';
	import type { CustomDataTableProps } from './datatable-types.svelte';
	import DataTableToolbar from './toolbar/data-table-toolbar.svelte';
	import type { BasicEntity } from '$lib/api/config';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { v4 as uuidv4 } from 'uuid';
	import { cn } from '$lib/utils';
	import DatatablePagination from './pagination/datatable-pagination.svelte';
	// class ServerPaginationState implements PaginationState{
	// 	#pageIndex: number = $state(0);
	// 	#pageSize: number = $state(10);

	// 	constructor({
	// 		pageIndex = 0,
	// 		pageSize = 10
	// 	}: Partial<PaginationState>){
	// 		this.#pageIndex = pageIndex;
	// 		this.#pageSize = pageSize;
	// 	}

	// 	get pageIndex() {
	// 		return this.#pageIndex;
	// 	}

	// 	set pageIndex(value: number) {
	// 		this.#pageIndex = value;
	// 	}

	// 	get pageSize() {
	// 		return this.#pageSize;
	// 	}

	// 	set pageSize(value: number) {
	// 		this.#pageSize = value;
	// 	}

	// 	setPagination(pagination: PaginationState) {
	// 		this.pageIndex = pagination.pageIndex;
	// 		this.pageSize = pagination.pageSize;
	// 	}

	// 	handlePaginationChange(updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) {
	//         const newPagination = typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue;

	//         this.setPagination(newPagination);
	//         if (serverPagination?.onPaginationChange) {
	//             serverPagination.onPaginationChange(newPagination.pageIndex, newPagination.pageSize);
	//         }
	//     }
	// }

	// const serverPaginationConfig = new ServerPaginationState({

	// });

	let {
		data,
		columns,
		externalGlobalFilter,
		facetedFilters,
		filterPlaceholder,
		toolbarActions,
		loadingRowsCount = 5,
		isLoading = false,
		strikethroughCondition,
		strikethroughField,
		strikethroughValue,
		serverPagination,
		updatedColumnVisibilityConfig,
		getRowCanExpand,
		getSubRows,
		renderExpandedRow,
		onClickRow,
		initialColumnVisibility,
		onGlobalFilterChange,
		externalFilterValue = $bindable()
	}: CustomDataTableProps<TData, TValue> = $props();
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let rowSelection = $state<RowSelectionState>({});
	let globalFilter = $state(externalGlobalFilter ?? '');
	let columnVisibility = $state<VisibilityState>(
		(initialColumnVisibility as VisibilityState) ?? {}
	);
	const handlePaginationChange = (
		updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)
	) => {
		const newPagination =
			typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue;

		pagination = newPagination;
		if (serverPagination?.onPaginationChange) {
			serverPagination.onPaginationChange(newPagination.pageIndex, newPagination.pageSize);
		}
	};
	const globalFilterFn: FilterFn<any> = (row, columnId, value) => {
		const getValue = (row: Row<any>) => {
			// Accede a los valores originales de la fila
			const rowValue =
				columnId === '_all' ? Object.values(row.original).join(' ') : row.getValue(columnId);

			// Convierte a string para la comparación
			return typeof rowValue === 'string' ? rowValue.toLowerCase() : String(rowValue).toLowerCase();
		};

		const searchValue = value.toLowerCase();
		return getValue(row).includes(searchValue);
	};

	const handleGlobalFilterChange = (value: string) => {
		globalFilter = value;
		if (onGlobalFilterChange) {
			onGlobalFilterChange(value);
		}
	};

	$effect(() => {
		if (updatedColumnVisibilityConfig) {
			untrack(() => {
				table.setColumnVisibility((prev) => {
					// Mantenemos la visibilidad de las columnas que ya están visibles
					const updatedVisibility = { ...prev, ...updatedColumnVisibilityConfig };
					return updatedVisibility;
				});
			});
		}
	});
	$effect(() => {
		if (externalFilterValue !== undefined) {
			globalFilter = externalFilterValue;
		}
	});

	const options: TableOptions<TData> = $derived({
		get data() {
			return data;
		},
		columns,
		getRowCanExpand,
		getSubRows,
		onClickRow,
		initialColumnVisibility,
		externalFilterValue,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			},
			get columnFilters() {
				return columnFilters;
			},
			get globalFilter() {
				return globalFilter;
			}
		},
		//getRowId: (row) => row.id.toString(),
		enableRowSelection: true,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: serverPagination ? undefined : getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: handlePaginationChange,
		onGlobalFilterChange: handleGlobalFilterChange,
		globalFilterFn,
		// Aplicar el filtro global a todas las columnas
		filterFns: {
			global: globalFilterFn
		},
		pageCount: serverPagination?.pageCount ?? -1,
		manualPagination: !!serverPagination,
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
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		}
		// adiciones customizadas
	});

	const table = $derived(createSvelteTable(options));
	// setDatatableState<TData>(() => table);
	setDatatableState<TData>(() => table);
	const datatableState = useDatatableContext<TData>();

	let views = [
		{
			id: 'outline',
			label: 'Outline',
			badge: 0
		},
		{
			id: 'past-performance',
			label: 'Past Performance',
			badge: 3
		},
		{
			id: 'key-personnel',
			label: 'Key Personnel',
			badge: 2
		},
		{
			id: 'focus-documents',
			label: 'Focus Documents',
			badge: 0
		}
	];

	let view = $state('outline');
	let viewLabel = $derived(views.find((v) => view === v.id)?.label ?? 'Select a view');
	const getStrikeThroughClass = (rowOriginal: TData) => {
		return (strikethroughCondition && strikethroughCondition(rowOriginal)) ||
			(strikethroughField &&
				strikethroughValue !== undefined &&
				rowOriginal[strikethroughField] === strikethroughValue)
			? 'line-through opacity-60'
			: '';
	};
</script>

<Tabs.Root value="outline" class="w-full flex-col justify-start gap-6">
	<div class="flex items-center justify-between px-4 lg:px-6">
		<Label for="view-selector" class="sr-only">View</Label>
		<Select.Root type="single" bind:value={view}>
			<Select.Trigger class="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
				{viewLabel}
			</Select.Trigger>
			<Select.Content>
				{#each views as view (view.id)}
					<Select.Item value={view.id}>{view.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<Tabs.List
			class="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex"
		>
			{#each views as view (view.id)}
				<Tabs.Trigger value={view.id}>
					{view.label}
					{#if view.badge > 0}
						<Badge variant="secondary">{view.badge}</Badge>
					{/if}
				</Tabs.Trigger>
			{/each}
		</Tabs.List>
		<div class="flex items-center gap-2">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" size="sm" {...props}>
							<LayoutColumnsIcon />
							<span class="hidden lg:inline">Customize Columns</span>
							<span class="lg:hidden">Columns</span>
							<ChevronDownIcon />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="w-56">
					{#each table
						.getAllColumns()
						.filter((col) => typeof col.accessorFn !== 'undefined' && col.getCanHide()) as column (column.id)}
						<DropdownMenu.CheckboxItem
							class="capitalize"
							checked={column.getIsVisible()}
							onCheckedChange={(value) => column.toggleVisibility(!!value)}
						>
							{column.id}
						</DropdownMenu.CheckboxItem>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<Button variant="outline" size="sm">
				<PlusIcon />
				<span class="hidden lg:inline">Add Section</span>
			</Button>
		</div>
	</div>
	<Tabs.Content value="outline" class="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
		<div class="space-y-4">
			<div class="overflow-hidden rounded-lg border">
				<DataTableToolbar
					{table}
					{facetedFilters}
					{filterPlaceholder}
					bind:externalFilterValue
					onGlobalFilterChange={(value: string) => {
						// externalGlobalFilter = value;
						console.log(value);
					}}
					{toolbarActions}
				></DataTableToolbar>
				<DragDropProvider
					modifiers={[
						// @ts-expect-error @dnd-kit/abstract types are botched atm
						RestrictToVerticalAxis
					]}
					onDragEnd={(e) => (data = move(data, e))}
				>
					<Table.Root>
						<Table.Header class="sticky top-0 z-10 bg-muted">
							{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
								<Table.Row>
									{#each headerGroup.headers as header (header.id)}
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
						<Table.Body class="**:data-[slot=table-cell]:first:w-8">
							{#if isLoading}
								{@render SkeletonRows()}
							{:else if table.getRowModel().rows?.length}
								{#each table.getRowModel().rows as row, index (row.id)}
									{@render DraggableRow({ row, index })}
								{/each}
							{:else}
								{@render EmptyData()}
							{/if}
						</Table.Body>
					</Table.Root>
				</DragDropProvider>
			</div>
			<DatatablePagination {table} {serverPagination} />
		</div>
	</Tabs.Content>
	<Tabs.Content value="past-performance" class="flex flex-col px-4 lg:px-6">
		<div class="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
	</Tabs.Content>
	<Tabs.Content value="key-personnel" class="flex flex-col px-4 lg:px-6">
		<div class="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
	</Tabs.Content>
	<Tabs.Content value="focus-documents" class="flex flex-col px-4 lg:px-6">
		<div class="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
	</Tabs.Content>
</Tabs.Root>

<!-- {#snippet DataTableLimit({ row }: { row: Row<Schema> })}
	<form
		onsubmit={(e) => {
			e.preventDefault();
			toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
				loading: `Saving ${row.original.header}`,
				success: 'Done',
				error: 'Error'
			});
		}}
	>
		<Label for="{row.original.id}-limit" class="sr-only">Limit</Label>
		<Input
			class="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
			value={row.original.limit}
			id="{row.original.id}-limit"
		/>
	</form>
{/snippet} -->

<!-- {#snippet DataTableTarget<TData extends { id: string }>({ row }: { row: Row<TData> })}
	<form
		onsubmit={(e) => {
			e.preventDefault();
			toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
				loading: `Saving ${row.original.header}`,
				success: 'Done',
				error: 'Error'
			});
		}}
	>
		<Label for="{row.original.id}-target" class="sr-only">Target</Label>
		<Input
			class="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
			value={row.original.target}
			id="{row.original.id}-target"
		/>
	</form>
{/snippet} -->

<!-- {#snippet DataTableType<TData extends { id: string }>({ row }: { row: Row<TData> })}
	<div class="w-32">
		<Badge variant="outline" class="px-1.5 text-muted-foreground">
			{row.original.type}
		</Badge>
	</div>
{/snippet} -->

<!-- {#snippet DataTableStatus<TData extends { id: string }>({ row }: { row: Row<TData> })}
	<Badge variant="outline" class="px-1.5 text-muted-foreground">
		{#if row.original.status === 'Done'}
			<CircleCheckFilledIcon class="fill-green-500 dark:fill-green-400" />
		{:else}
			<LoaderIcon />
		{/if}
		{row.original.status}
	</Badge>
{/snippet} -->

<!-- {#snippet DataTableActions()}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class="flex size-8 text-muted-foreground data-[state=open]:bg-muted">
			{#snippet child({ props })}
				<Button variant="ghost" size="icon" {...props}>
					<DotsVerticalIcon />
					<span class="sr-only">Abrir Menu</span>
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end" class="w-32">
			<DropdownMenu.Item>Edit</DropdownMenu.Item>
			<DropdownMenu.Item>Make a copy</DropdownMenu.Item>
			<DropdownMenu.Item>Favorite</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item variant="destructive">Delete</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet} -->

{#snippet DraggableRow({ row, index }: { row: Row<TData>; index: number })}
	{@const localId =
		row.original && typeof row.original === 'object' && 'id' in row.original
			? (row.original.id as string)
			: uuidv4()}
	{@const { ref, isDragging, handleRef } = useSortable({
		id: localId,
		index: () => index
	})}
	{@const strikeThroughClass = getStrikeThroughClass(row.original)}
	{@const expandedClass = row.getIsExpanded() ? 'bg-muted' : ''}
	{@const clickRowCallback = () => onClickRow?.(row.original)}

	<Table.Row
		data-state={row.getIsSelected() && 'selected'}
		data-dragging={isDragging.current}
		class={cn(
			'relative z-0 cursor-pointer data-[dragging=true]:z-10 data-[dragging=true]:opacity-80',
			strikeThroughClass,
			expandedClass
		)}
		onclick={clickRowCallback}
		{@attach ref}
	>
		{#each row.getVisibleCells() as cell (cell.id)}
			<Table.Cell>
				<FlexRender
					attach={handleRef}
					content={cell.column.columnDef.cell}
					context={cell.getContext()}
				/>
			</Table.Cell>
		{/each}
	</Table.Row>
	{#if row.getIsExpanded()}
		<Table.Row class="bg-muted">
			<Table.Cell colspan={row.getVisibleCells().length} class="p-0">
				{#if renderExpandedRow}
					{@render renderExpandedRow({ row: row.original })}
				{:else}
					{'No hay datos disponibles.'}
				{/if}
			</Table.Cell>
		</Table.Row>
	{/if}
{/snippet}

{#snippet DragHandle({ attach }: { attach: Attachment })}
	<Button
		{@attach attach}
		variant="ghost"
		size="icon"
		class="size-7 text-muted-foreground hover:bg-transparent"
	>
		<GripVerticalIcon class="size-3 text-muted-foreground" />
		<span class="sr-only">Jale para reordenar</span>
	</Button>
{/snippet}

{#snippet SkeletonRows()}
	{#each Array.from({ length: loadingRowsCount }) as item, i}
		<Table.Row>
			{#each columns as col}
				<Table.Cell>
					<Skeleton class="h-4 w-full rounded-md" />
				</Table.Cell>
			{/each}
		</Table.Row>
	{/each}
{/snippet}

{#snippet EmptyData()}
	<Table.Row>
		<Table.Cell colspan={columns.length} class="h-24 text-center">
			<Database class="size-10 text-slate-300" strokeWidth={1}></Database>
			Sin datos
		</Table.Cell>
	</Table.Row>
	<!-- <div class="mx-auto flex w-fit flex-col items-center font-light text-slate-400">
		<Database class="size-10 text-slate-300" strokeWidth={1} />
		Sin datos
	</div> -->
{/snippet}
