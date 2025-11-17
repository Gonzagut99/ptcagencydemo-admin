import type { Table } from '@tanstack/svelte-table';
import type { IconProps } from 'lucide-svelte';
import type { Component, Snippet } from 'svelte';

export type FacetedFilter<TValue> = {
    column: string;
    title: string;
    options: {
        label: string;
        value: TValue;
        icon?: Component<IconProps>
    }[];
};

export type DataTableToolbarProps<TData, TValue> = {
	table: Table<TData>;
	toolbarActions?: Snippet<[{
        table: Table<TData>;
    }]>
	filterPlaceholder?: string;
	facetedFilters?: FacetedFilter<TValue>[];
	externalFilterValue?: string;
	onGlobalFilterChange?: (value: string) => void;
};
