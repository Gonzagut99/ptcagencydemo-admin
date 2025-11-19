<script lang="ts" module>
	export type FacetedFilterOption<TValue> = {
		label: string;
		value: TValue; // Usamos TValue directamente
		icon?: Component<IconProps>;
	};
	export type DataTableFacetedFilterProps<TData, TValue> = {
		column?: Column<TData, TValue>;
		title?: string;
		filterStrategy?: 'radio-group' | 'checkbox-group'; // Añadido para posibles futuras estrategias
		options: FacetedFilterOption<TValue>[];
		customOnSelect?: (value: TValue | TValue[] | undefined) => void; // Nueva prop para manejar selección externamente
	};
</script>

<script lang="ts" generics="TData, TValue">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
		CommandSeparator
	} from '$lib/components/ui/command';
	import Command from '$lib/components/ui/command/command.svelte';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { FunnelPlus, type IconProps } from '@lucide/svelte';
	import type { Column } from '@tanstack/svelte-table';
	import { onMount, type Component } from 'svelte';

	

	const {
		column,
		options,
		customOnSelect,
		filterStrategy,
		title
	}: DataTableFacetedFilterProps<TData, TValue> = $props();

	class FacetedFilterState {
		externalSelectedValues = $state<Set<TValue>>(new Set());
		filterValue = $derived(column?.getFilterValue());
		localSelectedValues = $derived.by(() => {
			if (this.filterValue === undefined || this.filterValue === null) {
				return new Set<TValue>();
			}
			if (Array.isArray(this.filterValue)) {
				return new Set<TValue>(this.filterValue as TValue[]);
			}
			return new Set<TValue>([this.filterValue as TValue]);
		});
		selectedValues = $derived.by(() => {
			return customOnSelect ? this.externalSelectedValues : this.localSelectedValues;
		});

		handleExternalSelect(value: TValue | TValue[] | undefined) {
			if (customOnSelect) {
				this.externalSelectedValues =
					value === undefined
						? new Set()
						: Array.isArray(value)
							? new Set(value)
							: new Set([value]);
				customOnSelect(value);
			} else {
				if (column) {
					column.setFilterValue(value);
				}
			}
		}

		handleSelect(optionValue: TValue) {
			const isSelected = this.selectedValues.has(optionValue);
			let newSelectedValues: Set<TValue>;

			if (filterStrategy === 'radio-group') {
				this.handleExternalSelect(optionValue);
			} else {
				newSelectedValues = new Set(this.selectedValues);
				if (isSelected) {
					newSelectedValues.delete(optionValue);
				} else {
					newSelectedValues.add(optionValue);
				}

				if (newSelectedValues.size === 1 && typeof Array.from(newSelectedValues)[0] === 'boolean') {
					this.handleExternalSelect(Array.from(newSelectedValues)[0]);
				} else {
					this.handleExternalSelect(
						newSelectedValues.size ? Array.from(newSelectedValues) : undefined
					);
				}
			}
		}
	}

	const facetedFilterState = new FacetedFilterState();

	onMount(() => {
		return () => {
			// Limpieza si es necesaria
			facetedFilterState.externalSelectedValues = new Set();
		};
	});
</script>

<Popover>
	<PopoverTrigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="sm" class="h-8 border-dashed">
				<FunnelPlus class="mr-2 h-4 w-4" />
				{title}
				{#if facetedFilterState.selectedValues?.size > 0 && filterStrategy !== 'radio-group'}
					<Separator orientation="vertical" class="mx-2 h-4" />
					<Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden"
						>{facetedFilterState.selectedValues.size} filtros seleccionados</Badge
					>
					<div class="hidden space-x-1 lg:flex">
						{#if facetedFilterState.selectedValues.size > 2}
							<Badge variant="secondary" class="rounded-sm px-1 font-normal">
								{facetedFilterState.selectedValues.size} seleccionados
							</Badge>
						{:else}
							{#each options.filter( (option) => facetedFilterState.selectedValues.has(option.value) ) as option (String(option.value))}
								<Badge variant="secondary" class="rounded-sm px-1 font-normal">
									{option.label}
								</Badge>
							{/each}
						{/if}
					</div>
				{/if}
			</Button>
		{/snippet}
	</PopoverTrigger>
	<PopoverContent class="w-[200px] p-0" align="start">
		<Command>
			<CommandInput placeholder={title} />
			<CommandList>
				<CommandEmpty>No se encontraron resultados.</CommandEmpty>
				<CommandGroup>
					{#each options as option (String(option.value))}
						{@const isSelected = facetedFilterState.selectedValues.has(option.value)}
						<CommandItem onSelect={() => facetedFilterState.handleSelect(option.value)}>
							<div
								class={'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ' +
									(isSelected ? '' : 'opacity-50 [&_svg]:invisible')}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
							{#if option.icon}
                                {@const Icon = option.icon}
								<Icon class="mr-2 h-4 w-4 text-muted-foreground" />
							{/if}
							<span>{option.label}</span>
						</CommandItem>
					{/each}
				</CommandGroup>
				{#if facetedFilterState.selectedValues.size > 0}
					<CommandSeparator />
					<CommandGroup>
						<CommandItem
							onSelect={() => {
								facetedFilterState.handleExternalSelect(undefined);
							}}
							class="justify-center text-center"
						>
							Limpiar filtros
						</CommandItem>
					</CommandGroup>
				{/if}
			</CommandList>
		</Command>
	</PopoverContent>
</Popover>
