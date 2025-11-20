import type { Table } from '@tanstack/svelte-table';
import type { IconProps } from 'lucide-svelte';
import type { Component, Snippet } from 'svelte';

export type ToolbarActionsSnippet<TData> = Snippet<[{
    table: Table<TData>;
}]>;

export type FacetedFilter<TValue> = {
    column: string;
    title: string;
    options: {
        label: string;
        value: TValue;
        icon?: Component<IconProps>
    }[];
    onFilterChange?: (value: TValue | TValue[] | undefined | unknown) => void;
    filterStrategy?: 'checkbox-group' | 'radio-group';
};

export type DataTableToolbarProps<TData, TValue> = {
	table: Table<TData>;
	toolbarActions?: ToolbarActionsSnippet<TData>;
	filterPlaceholder?: string;
	facetedFilters?: FacetedFilter<TValue>[];
	externalFilterValue?: string;
	onGlobalFilterChange?: (value: string) => void;
};
