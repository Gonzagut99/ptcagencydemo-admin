import type { ColumnDef } from "@tanstack/table-core";
import type { Snippet } from "svelte";
import { z } from "zod/v4";

export const schema = z.object({
	id: z.number(),
	header: z.string(),
	type: z.string(),
	status: z.string(),
	target: z.string(),
	limit: z.string(),
	reviewer: z.string(),
});

export type CustomDatatableProps<TData, TValue> = {
	columns: ColumnDef<TData, TValue>[]; 
	data: TData[]; //rows
	toolbarActions?: Snippet[] ;
}

export type Schema = z.infer<typeof schema>;
