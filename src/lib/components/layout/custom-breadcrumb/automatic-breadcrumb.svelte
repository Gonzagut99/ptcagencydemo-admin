<script lang="ts">
	import * as Breadcrumb from '../../ui/breadcrumb';
	import { PUBLIC_HOME_ENDPOINT } from '$env/static/public';
	import { page } from '$app/state';
	import { dynamicRouteDictionaryContext } from './route-breadcrumb-context';
	import { sidebarStaticRoutesDictionary } from '../custom-sidebar/sidebar-data';
	type Segment = { segment: string; value: string; url: string };
	type Dictionary = Record<string, string>;
	class DynamicBreadcrumbTitleDictionary {
		private homeEndpoint: string = this.getHomeEndpoint(PUBLIC_HOME_ENDPOINT || 'home');
		private staticRouteDictionary: Record<string, string> = sidebarStaticRoutesDictionary;
		private dynamicSegmentsDictionary = dynamicRouteDictionaryContext.get();
		#segments: Segment[] = $state([]);
		#dictionary: Dictionary = $derived.by(() =>
			this.assignBreadcrumbTitles(this.staticRouteDictionary)
		);

		constructor() {
		}

		private getRouteSegments(route: string, pathName: string): {
			segment:string;
			value:string;
			url:string;
		}[] {
			const segments = route.split('/').filter((segment) => (segment.length > 0 && !this.isGroupedRoute(segment)) || segment === this.getHomeSegmentGroupedRoute());
			const values = pathName.split('/').filter((segment) => segment.length > 0);
			const urls = values.map((_, index) => '/' + values.slice(0, index + 1).join('/'));
			let finalSegments: Segment[] = [];
			segments.forEach((segment, index) => {
				if (this.isGroupedRoute(segment)) {
					finalSegments.push({
						segment: this.homeEndpoint,
						value: '/',
						url: '/'
					});
				} else {
					finalSegments.push({
						segment,
						value: values[index-1],
						url: urls[index-1]
					});
				}
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
			const segments = this.getRouteSegments(page.route.id || '', page.url.pathname)
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
					const dynamicEntry = this.dynamicSegmentsDictionary.find(
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
			this.#segments = segments;
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
	}

	const breadcrumbTitleDictionary = new DynamicBreadcrumbTitleDictionary();
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item class="hidden md:block">
			<Breadcrumb.Link href="##">Building Your Application</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator class="hidden md:block" />
		<Breadcrumb.Item>
			<Breadcrumb.Page>Data Fetching</Breadcrumb.Page>
		</Breadcrumb.Item>
		{#each breadcrumbTitleDictionary.segments as { segment, url }, index }
			<Breadcrumb.Item aria-current={index === breadcrumbTitleDictionary.segments.length - 1 ? 'page' : undefined}>
				<Breadcrumb.Link href={url}>
					{breadcrumbTitleDictionary.getTitle(segment)}
				</Breadcrumb.Link>
			</Breadcrumb.Item>
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>
