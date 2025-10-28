import type { ColumnDef } from '@tanstack/table-core';
import type { components } from '$lib/api/api';
import { renderComponent } from '$lib/components/ui/data-table';
import CustomerActions from './actions.svelte';

type Customer = components['schemas']['DCustomer'];

export const columns: ColumnDef<Customer>[] = [
	{
		accessorKey: 'firstName',
		header: 'Nombre',
		cell: ({ row }) => {
			const firstName = row.getValue('firstName') as string;
			const lastName = row.original.lastName;
			return `${firstName} ${lastName}`;
		},
		enableSorting: true
	},
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }) => row.getValue('email') as string,
		enableSorting: true
	},
	{
		accessorKey: 'phoneNumber',
		header: 'Teléfono',
		cell: ({ row }) => row.getValue('phoneNumber') as string || '-'
	},
	{
		accessorKey: 'idDocumentType',
		header: 'Tipo de Documento',
		cell: ({ row }) => {
			const type = row.getValue('idDocumentType') as string;
			const typeLabels: Record<string, string> = {
				PASSPORT: 'Pasaporte',
				DNI: 'DNI',
				DRIVER_LICENSE: 'Licencia',
				RUC: 'RUC',
				CE: 'CE'
			};
			return typeLabels[type] || type;
		}
	},
	{
		accessorKey: 'idDocumentNumber',
		header: 'Número de Documento',
		cell: ({ row }) => row.getValue('idDocumentNumber') as string
	},
	{
		id: 'actions',
		cell: ({ row }) => renderComponent(CustomerActions, { customer: row.original })
	}
];
