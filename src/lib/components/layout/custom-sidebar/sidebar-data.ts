
import { ClipboardClock, HardHat, User } from '@lucide/svelte';
import type { NavigationItem, SidebarConfig } from './sidebar-types';

type StaticRoute = `/${string}`;
const modulePaths = {
    customers: '/customers',
    users: '/users',
    staff: '/staff',
    liquidations: '/liquidations',
    payments: '/liquidations/payments',
} satisfies Record<string, StaticRoute>;

export const additionalGenericStaticRoutes = {
    create: '/create',
    contact: '/contact'
} satisfies Record<string, StaticRoute>

export const staticModuleRoutesDictionary: Record<keyof typeof modulePaths, string> = {
    customers: 'Clientes',
    users: 'Usuarios',
    staff: 'Personal',
    liquidations: 'Liquidaciones',
    payments: 'Pagos'
};

export const additionalGenericStaticRoutesDictionary: Record<keyof typeof additionalGenericStaticRoutes, string> = {
    create: 'Crear',
    contact: 'Contacto'
};

export const sidebarStaticRoutesDictionary: Record<string, string> = {
    ...staticModuleRoutesDictionary,
    ...additionalGenericStaticRoutesDictionary
}

export const sidebarData: SidebarConfig = {
	navGroups: [
        {
            title: 'Gestión de personal',
            items: [
                {
                    title: staticModuleRoutesDictionary.staff,
                    icon: HardHat,
                    url: modulePaths.staff,
                },
                {
                    title: staticModuleRoutesDictionary.users,
                    icon: User,
                    url: modulePaths.users,
                }
            ]
        },
        {
            title: 'Gestión de liquidaciones',
            items: [
                {
                    title: staticModuleRoutesDictionary.liquidations,
                    icon: ClipboardClock,
                    url: modulePaths.liquidations
                },
                {
                    title: staticModuleRoutesDictionary.payments,
                    icon: HardHat,
                    url: modulePaths.payments
                }
            ]
        },
        {
            title: 'Gestión de clientes',
            items: [
                {
                    title: staticModuleRoutesDictionary.customers,
                    icon: User,
                    url: modulePaths.customers
                }
            ]
        }
    ]
};

export const extractAllSidebarNavigationItems = (config: SidebarConfig) => {
    const items: NavigationItem[] = [];
    for (const group of config.navGroups) {
        for (const item of group.items) {
            items.push(item);
            if ('items' in item && item.items) {
                items.push(...item.items);
            }
        }
    }
    return items;
}

export const allSidebarNavigationItems = extractAllSidebarNavigationItems(sidebarData);