import { type Table } from '@tanstack/svelte-table';
import { Context } from 'runed';
export class DataTableState<TData> {
	#table: Table<TData>;

	constructor(table: Table<TData>) {
		this.#table = $derived(table);
	}
	// set table(tableOptions: TableOptions<TData>) {
	// 	this.#table = $derived(createSvelteTable(tableOptions));
	// }

	get table() {
		return this.#table;
	}
}

const DATATABLE_CONTEXT_KEY = 'CustomDataTableContextKey';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dataTableContext: Context<Table<any>> = new Context<Table<any>>(
	DATATABLE_CONTEXT_KEY
);

export const setDatatableState = <TData>(table: () => Table<TData>) => {
	dataTableContext.set(table());
};

export const useDatatableContext = <TData>(): Table<TData> => {
	return dataTableContext.get() as Table<TData>;
};
