/* eslint-disable @typescript-eslint/no-unused-vars */

import { type RowData } from '@tanstack/svelte-table';

declare module '@tanstack/svelte-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        title: string;
    }
}
