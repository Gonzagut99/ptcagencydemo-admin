import type { IconProps } from '@lucide/svelte';
import type { Component } from 'svelte';

interface BaseNavItem {
	title: string;
	badge?: string;
	icon?: Component<IconProps>;
	// Propiedades para control de acceso
	permission?: string; // Formato: "resource:action" ej: "users:read"
	roles?: string[]; // Lista de roles que pueden ver este elemento
	url?: string;
}

type NavLink = BaseNavItem & {
	items?: never;
};

type NavCollapsible = BaseNavItem & {
	items: BaseNavItem[];
};

type NavigationItem = NavLink | NavCollapsible;

interface NavigationGroup {
	title: string;
	items: NavigationItem[];
}

interface SidebarConfig {
	navGroups: NavigationGroup[];
}

export type { SidebarConfig, NavigationGroup, NavigationItem, NavCollapsible };
