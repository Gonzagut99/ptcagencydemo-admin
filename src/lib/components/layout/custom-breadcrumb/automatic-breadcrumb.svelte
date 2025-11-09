<script lang="ts">
	import * as Breadcrumb from '../../ui/breadcrumb';
	import { PUBLIC_HOME_ENDPOINT } from '$env/static/public';
	import { page } from '$app/state';
	import { dynamicRouteDictionaryContext } from './route-breadcrumb-context.svelte';
	import { sidebarStaticRoutesDictionary } from '../custom-sidebar/sidebar-data';
	import { onMount } from 'svelte';
	import type { DynamicRouteDictionary } from './dynamic-routes-breadcrumb.types';
	import { MediaQuery } from 'svelte/reactivity';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { buttonVariants } from '$lib/components/ui/button';
	type Segment = { segment: string; value: string; url: string };
	type Dictionary = Record<string, string>;
	class DynamicBreadcrumbTitleDictionary {
		private homeEndpoint: string = this.getHomeEndpoint(PUBLIC_HOME_ENDPOINT || 'home');
		private staticRouteDictionary: Record<string, string> = sidebarStaticRoutesDictionary;
		#dynamicSegmentsDictionary: DynamicRouteDictionary[] = $derived(
			dynamicRouteDictionaryContext.get().dynamicRoutes
		);
		#segments: Segment[] = $derived.by(() =>
			this.getRouteSegments(page.route.id || '', page.url.pathname)
		);
		#dictionary: Dictionary = $derived.by(() =>
			this.assignBreadcrumbTitles(this.staticRouteDictionary)
		);

		private getRouteSegments(route: string, pathName: string): Segment[] {
			// Separar los segmentos declarados en la ruta
			const routeSegments = route.split('/').filter((segment) => segment.length > 0);

			const values = pathName.split('/').filter((segment) => segment.length > 0);
			const urls = values.map((_, index) => '/' + values.slice(0, index + 1).join('/'));

			// Siempre incluir el segmento de inicio como primer breadcrumb
			const finalSegments: Segment[] = [
				{
					segment: this.homeEndpoint,
					value: '/',
					url: '/'
				}
			];

			let valueIndex = 0; // Índice independiente para values y urls

			routeSegments.forEach((segment) => {
				// Omitir segmentos agrupados (p. ej. (app))
				if (this.isGroupedRoute(segment)) return;

				finalSegments.push({
					segment,
					value: values[valueIndex],
					url: urls[valueIndex]
				});
				valueIndex++;
			});

			return finalSegments;
		}
		private getHomeEndpoint(homeEndpoint: string): string {
			let finalHomeEndpoint: string = homeEndpoint;
			if (homeEndpoint.startsWith('/') && homeEndpoint.length > 1) {
				finalHomeEndpoint = homeEndpoint.replace(/^\//, '');
			}
			if (homeEndpoint.endsWith('/') && homeEndpoint.length > 1) {
				finalHomeEndpoint = homeEndpoint.replace(/\/$/, '');
			}

			if (homeEndpoint === '/') {
				finalHomeEndpoint = 'home';
			}
			return finalHomeEndpoint;
		}

		private isDynamicSegment(segment: string): boolean {
			return segment.startsWith('[') && segment.endsWith(']');
		}

		private isGroupedRoute(segment: string): boolean {
			return segment.startsWith('(') && segment.endsWith(')');
		}

		private getHomeSegmentGroupedRoute(): string {
			return `(${this.homeEndpoint})`;
		}

		private assignBreadcrumbTitles(staticRouteDictionary: Dictionary): Dictionary {
			const segments = this.getRouteSegments(page.route.id || '', page.url.pathname);
			const dictionary: Dictionary = {
				[this.homeEndpoint]: 'Inicio'
			};
			const isNewSegment = (segment: string) =>
				!(segment in dictionary) && segment !== this.homeEndpoint;

			segments.forEach(({ segment }) => {
				if (!isNewSegment(segment)) {
					return;
				}
				if (this.isDynamicSegment(segment)) {
					const dynamicSegment = segment.slice(1, -1);
					const dynamicEntry = this.#dynamicSegmentsDictionary.find(
						(entry) => entry.slug === dynamicSegment
					);
					if (dynamicEntry) {
						dictionary[segment] = dynamicEntry.name;
						return;
					} else {
						dictionary[segment] = dynamicSegment;
						return;
					}
				}
				if (segment in staticRouteDictionary) {
					dictionary[segment] = staticRouteDictionary[segment];
					return;
				}
				dictionary[segment] = segment;
			});
			return dictionary;
		}

		getTitle(endpoint: string): string {
			return this.dictionary[endpoint];
		}

		private formatEndpoint(endpoint: string): string {
			return endpoint
				.split('-')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');
		}

		get dictionary(): Dictionary {
			return this.#dictionary;
		}

		get segments(): Segment[] {
			return this.#segments;
		}

		get dynamicSegmentsDictionary() {
			return this.#dynamicSegmentsDictionary;
		}
	}

	let breadcrumbTitleDictionary: DynamicBreadcrumbTitleDictionary | undefined = $state();

	onMount(() => {
		if (!breadcrumbTitleDictionary) {
			breadcrumbTitleDictionary = new DynamicBreadcrumbTitleDictionary();
		}
	});

	const ITEMS_TO_DISPLAY = 4;

	let open = $state(false);

	const isDesktop = new MediaQuery('(min-width: 768px)');
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		{#if breadcrumbTitleDictionary !== undefined}
			{#if breadcrumbTitleDictionary.segments.length <= ITEMS_TO_DISPLAY}
				{#each breadcrumbTitleDictionary.segments as { segment, url }, index}
					<Breadcrumb.Item
						aria-current={index === breadcrumbTitleDictionary.segments.length - 1
							? 'page'
							: undefined}
					>
						{#if index < breadcrumbTitleDictionary.segments.length - 1}
							<Breadcrumb.Link href={url}>
								{breadcrumbTitleDictionary.getTitle(segment)}
							</Breadcrumb.Link>
						{:else}
							<Breadcrumb.Page>{breadcrumbTitleDictionary.getTitle(segment)}</Breadcrumb.Page>
						{/if}
					</Breadcrumb.Item>
					{#if index < breadcrumbTitleDictionary.segments.length - 1}
						<Breadcrumb.Separator></Breadcrumb.Separator>
					{/if}
				{/each}
			{:else}
				<Breadcrumb.Item>
					<Breadcrumb.Link href={breadcrumbTitleDictionary.segments[0].url}>
						{breadcrumbTitleDictionary.getTitle(breadcrumbTitleDictionary.segments[0].segment)}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator></Breadcrumb.Separator>
				<Breadcrumb.Item>
					{#if isDesktop.current}
						<DropdownMenu.Root bind:open>
							<DropdownMenu.Trigger class="flex items-center gap-1" aria-label="Toggle menu">
								<Breadcrumb.Ellipsis class="size-4" />
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="start">
								{#each breadcrumbTitleDictionary.segments.slice(1, -2) as item, i (i)}
									<DropdownMenu.Item>
										<a href={item.url ? item.url : '#'}>
											{breadcrumbTitleDictionary.getTitle(item.segment)}
										</a>
									</DropdownMenu.Item>
								{/each}
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					{:else}
						<Drawer.Root bind:open>
							<Drawer.Trigger aria-label="Toggle Menu">
								<Breadcrumb.Ellipsis class="size-4" />
							</Drawer.Trigger>
							<Drawer.Content>
								<Drawer.Header class="text-left">
									<Drawer.Title>Navegar a</Drawer.Title>
									<Drawer.Description>Seleccione una página para navegar.</Drawer.Description>
								</Drawer.Header>
								<div class="grid gap-1 px-4">
									{#each breadcrumbTitleDictionary.segments.slice(1, -2) as item, i (i)}
										<a href={item.url ? item.url : '#'} class="py-1 text-sm">
											{breadcrumbTitleDictionary.getTitle(item.segment)}
										</a>
									{/each}
								</div>
								<Drawer.Footer class="pt-4">
									<Drawer.Close class={buttonVariants({ variant: 'outline' })}>Cerrar</Drawer.Close>
								</Drawer.Footer>
							</Drawer.Content>
						</Drawer.Root>
					{/if}
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				{#each breadcrumbTitleDictionary.segments.slice(breadcrumbTitleDictionary.segments.length - (ITEMS_TO_DISPLAY - 2)) as { segment, url }, index}
					<Breadcrumb.Item aria-current={index === ITEMS_TO_DISPLAY - 3 ? 'page' : undefined}>
						{#if index < ITEMS_TO_DISPLAY - 3}
							<Breadcrumb.Link href={url}>
								{breadcrumbTitleDictionary.getTitle(segment)}
							</Breadcrumb.Link>
						{:else}
							<Breadcrumb.Page>{breadcrumbTitleDictionary.getTitle(segment)}</Breadcrumb.Page>
						{/if}
					</Breadcrumb.Item>
					{#if index < ITEMS_TO_DISPLAY - 3}
						<Breadcrumb.Separator></Breadcrumb.Separator>
					{/if}
				{/each}
			{/if}
		{/if}
	</Breadcrumb.List>
</Breadcrumb.Root>
