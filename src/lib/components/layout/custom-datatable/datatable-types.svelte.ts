import type { ColumnDef, Row, Table } from '@tanstack/svelte-table';
import type { Snippet } from 'svelte';
import type { FacetedFilter } from './toolbar/data-table-toolbar.types.svelte';
import type { ServerPaginationTanstackTableConfig } from './custom-pagination-types';

export type ColumnVisibility<T> = Partial<Record<keyof T, boolean>>;

export type CustomDataTableProps<TData, TValue> = {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	toolbarActions?: Snippet<[]> | ((table: Table<TData>) => Snippet<[]>);
	filterPlaceholder?: string;
	facetedFilters?: FacetedFilter<TValue>[];
	// Nuevas props para paginación del servidor
	serverPagination?: ServerPaginationTanstackTableConfig;
	getRowCanExpand?: (row: Row<TData>) => boolean;
	getSubRows?: ((originalRow: TData, index: number) => TData[] | undefined) | undefined;
	renderExpandedRow?: (row: TData) => Snippet<[]>;
	onClickRow?: (row: TData) => void;
	initialColumnVisibility?: ColumnVisibility<TData>;
	// Props para manejar filtros externos
	externalGlobalFilter?: string;
	onGlobalFilterChange?: (value: string) => void;
	updatedColumnVisibilityConfig?: ColumnVisibility<TData>;
	// Prop para manejar loading interno
	isLoading?: boolean;
	loadingRowsCount?: number;
	// Prop para mostrar valor en input sin filtrar (server-side filtering)
	externalFilterValue?: string;
	// Props para tachar filas completas
	strikethroughField?: keyof TData;
	strikethroughValue?: unknown;
	strikethroughCondition?: (row: TData) => boolean;
};
