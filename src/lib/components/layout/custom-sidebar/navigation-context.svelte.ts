import { Context } from 'runed';
import { page } from '$app/state';
import type { NavigationItem } from './sidebar-types';
import { allSidebarNavigationItems } from './sidebar-data';

export class NavigationState {
	private currentUrl: string = $derived(page.url.pathname); // svelte doesnt consider url query params for pathname
	private allNavItems: NavigationItem[] = allSidebarNavigationItems;
	#activeNavItem: NavigationItem | undefined = $derived.by(() => {
		return this.allNavItems.find((item) => this.checkNavItemIsActive(item.url ?? '', item));
	});

	private checkNavItemIsActive(href: string, navItem: NavigationItem): boolean {
		const firstLayerValidation = this.currentUrl === href;
		const recursivedValidation = navItem.items
			? navItem.items.some((item) => this.checkNavItemIsActive(item.url ?? '', item))
			: false;
		return firstLayerValidation || recursivedValidation;
	}

	public isNavItemActive(navItem: NavigationItem): boolean {
		return (this.activeNavItem?.url ?? '') === (navItem?.url ?? '');
	}

	public isAnySubItemActive(navItem: NavigationItem): boolean {
		if (!navItem.items) return false;
		return navItem.items.some((item) => this.#activeNavItem?.url === item.url || this.isAnySubItemActive(item));
	}

	get activeNavItem() {
		return this.#activeNavItem;
	}

	// set activeNavItem(navItem: NavigationItem | undefined) {
	// 	this.#activeNavItem = navItem;
	// }
}

const NAV_CONTEXT_KEY = 'scn-custom-sidebar-navigation-context';
export const navigationContext = new Context<NavigationState>(NAV_CONTEXT_KEY);

export const setSidebarNavigationContext = () => {
	return navigationContext.set(new NavigationState());
};

export const useSidebarNavigation = () => {
	return navigationContext.get();
};
