<script>
    import { page } from '$app/state';
	import DataTableDemo from '$lib/components/layout/custom-datatable-demo/data-table-demo.svelte';
    const data = [
    { id: 1, header: 'Contacto 1', type: 'Email', status: 'Activo', target: 'ckoo', limit: 'N/A', reviewer: 'Admin' },
    { id: 2, header: 'Contacto 2', type: 'Teléfono', status: 'Inactivo', target: 'ckoo', limit: 'N/A', reviewer: 'Admin' },
    { id: 3, header: 'Contacto 3', type: 'Dirección', status: 'Activo', target: 'ckoo', limit: 'N/A', reviewer: 'Admin' }
]
</script>
<div class="font-bold flex flex-col">
    <span>{'Url: '}{page.url}</span>
    <span>{'Param Id: '}{page.params.id}</span>
    <span>{'Param Contact Id: '}{page.params.contactId === undefined ? 'No definido' : page.params.contactId}</span>
</div>
<!-- data: {
    id: number;
    header: string;
    type: string;
    status: string;
    target: string;
    limit: string;
    reviewer: string;
}[] -->
<DataTableDemo data={data}></DataTableDemo>