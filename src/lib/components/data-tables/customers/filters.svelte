<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { X } from '@lucide/svelte';

	let { documentTypeFilter = $bindable(''), searchQuery = $bindable('') } = $props<{
		documentTypeFilter: string;
		searchQuery: string;
	}>();

	const documentTypeOptions = [
		{ value: '', label: 'Todos' },
		{ value: 'PASSPORT', label: 'Pasaporte' },
		{ value: 'DNI', label: 'DNI' },
		{ value: 'DRIVER_LICENSE', label: 'Licencia de Conducir' },
		{ value: 'RUC', label: 'RUC' },
		{ value: 'CE', label: 'CE' }
	];

	function clearFilters() {
		documentTypeFilter = '';
		searchQuery = '';
	}

	const hasActiveFilters = $derived(documentTypeFilter.length > 0 || searchQuery.length > 0);

	let selectedDocType = $state<{ value: string; label: string }>(documentTypeOptions[0]);
	let selectedValue = $state<string>('');

	$effect(() => {
		documentTypeFilter = selectedDocType.value;
	});

	const triggerContent = $derived(
		documentTypeOptions.find((option) => option.value === selectedValue)?.label ??
			'Tipo de Documento'
	);
</script>

<div class="flex flex-wrap gap-4">
	<Input
		type="search"
		placeholder="Buscar por nombre o email..."
		bind:value={searchQuery}
		class="max-w-sm"
	/>

	<!-- <Select.Root
		onSelectedChange={(v) => {
			if (v) {
				selectedDocType = v;
			}
		}}
	> -->
	<Select.Root type="single" bind:value={selectedValue}>
		<Select.Trigger class="w-[200px]">
			{triggerContent}
		</Select.Trigger>
		<Select.Content>
			{#each documentTypeOptions as option}
				<Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>

	{#if hasActiveFilters}
		<Button variant="ghost" onclick={clearFilters}>
			<X class="mr-2 h-4 w-4" />
			Limpiar Filtros
		</Button>
	{/if}
</div>
