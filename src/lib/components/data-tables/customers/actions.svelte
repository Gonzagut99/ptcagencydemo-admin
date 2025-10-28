<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { MoreHorizontal, Eye, Edit } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import type { components } from '$lib/api/api';

	type Customer = components['schemas']['DCustomer'];

	let { customer } = $props<{ customer: Customer }>();

	function handleView() {
		goto(`/clientes/${customer.id}`);
	}

	function handleEdit() {
		// TODO: Open edit modal or navigate to edit page
		console.log('Edit customer:', customer.id);
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon">
				<MoreHorizontal class="h-4 w-4" />
				<span class="sr-only">Abrir menú</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={handleView}>
			<Eye class="mr-2 h-4 w-4" />
			Ver Detalle
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={handleEdit}>
			<Edit class="mr-2 h-4 w-4" />
			Editar
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
