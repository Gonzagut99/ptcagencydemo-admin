<script lang="ts">
	import {
		Collapsible,
		CollapsibleContent,
		CollapsibleTrigger
	} from '$lib/components/ui/collapsible';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import { ChevronRightIcon } from '@lucide/svelte';
	import { useSidebarNavigation } from '../navigation-context.svelte';
	import type { NavCollapsible, NavigationGroup, NavigationItem } from '../sidebar-types';
	import NavBadge from './nav-badge.svelte';
	import {
		DropdownMenu,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuLabel,
		DropdownMenuSeparator
	} from '$lib/components/ui/dropdown-menu';
	import DropdownMenuItem from '$lib/components/ui/dropdown-menu/dropdown-menu-item.svelte';
	const { setOpenMobile, state } = useSidebar();
	// const { hasPermission, hasRole, isAuthenticated } = useAuth();
	const { items, title }: NavigationGroup = $props();

	const sidebarNavigation = useSidebarNavigation();

	

	//auth logic
	// const filteredItems = items.filter((item) => {
	//     if (!isAuthenticated) {
	//         return false;
	//     }

	//     return hasNavPermission(item, hasPermission, hasRole);
	// });
</script>

<!-- {#snippet NavBadge({ children }: { children?: Snippet })}
	<Badge class="rounded-full px-1 py-0 text-xs">
		{#if children}
			{@render children()}
		{/if}
	</Badge>
{/snippet} -->

{#snippet SideBarMenuLink({ item }: { item: NavigationItem })}
	<Sidebar.MenuItem>
		<Sidebar.MenuButton tooltipContent={item.title} isActive={sidebarNavigation.isNavItemActive(item)}>
			{#snippet child({ props })}
				<a class="flex items-center gap-2" href={item.url} {...props} onclick={() => setOpenMobile(false)}>
					{#if item.icon}
						{@const IconComponent = item.icon}
						<!-- {@const iconProps = item.icon.arguments} -->
						<IconComponent class="h-4 w-4" />
					{/if}
					<span>{item.title}</span>
					{#if item.badge}
						<NavBadge>{item.badge}</NavBadge>
					{/if}
				</a>
			{/snippet}
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
{/snippet}

{#snippet SidebarMenuCollapsible({ item }: { item: NavCollapsible })}
	<Collapsible open={sidebarNavigation.isAnySubItemActive(item)} class="group/collapsible">
		{#snippet child({ props })}
			<Sidebar.MenuItem {...props}>
				<CollapsibleTrigger>
					{#snippet child({ props })}
						<Sidebar.MenuButton {...props} tooltipContent={item.title}>
							{#if item.icon}
								<item.icon />
							{/if}
							<span>{item.title}</span>
							{#if item.badge}
								<NavBadge>{item.badge}</NavBadge>
							{/if}
							<ChevronRightIcon
								class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
							/>
						</Sidebar.MenuButton>
					{/snippet}
				</CollapsibleTrigger>
				<CollapsibleContent>
					<Sidebar.MenuSub>
						{#each item.items as subItem (subItem.title)}
							{#snippet SideBarMenuLink()}
								<Sidebar.MenuSubItem>
									<Sidebar.MenuSubButton isActive={sidebarNavigation.isNavItemActive(subItem)}>
										{#snippet child({ props })}
											<a href={subItem.url} {...props} onclick={() => setOpenMobile(false)}>
												{#if subItem.icon}
													<subItem.icon />
												{/if}
												<span>{subItem.title}</span>
												{#if subItem.badge}
													<NavBadge>{subItem.badge}</NavBadge>
												{/if}
											</a>
										{/snippet}
									</Sidebar.MenuSubButton>
								</Sidebar.MenuSubItem>
							{/snippet}
							{@render SideBarMenuLink()}
						{/each}
					</Sidebar.MenuSub>
				</CollapsibleContent>
			</Sidebar.MenuItem>
		{/snippet}
	</Collapsible>
{/snippet}

{#snippet SidebarMenuCollapsedDropdown({ item }: { item: NavCollapsible })}
	<Sidebar.MenuItem>
		<DropdownMenu>
			<DropdownMenuTrigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton {...props} tooltipContent={item.title}>
						{#if item.icon}
							<item.icon />
						{/if}
						<span>{item.title}</span>
						{#if item.badge}
							<NavBadge>{item.badge}</NavBadge>
						{/if}
						<ChevronRightIcon
							class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
						/>
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenuTrigger>
			<DropdownMenuContent side="right" align="start" sideOffset={4}>
				<DropdownMenuLabel>
					{item.title}
					{#if item.badge}({item.badge}){/if}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{#each item.items as subItem (subItem.title)}
					<DropdownMenuItem>
						{#snippet child({ props })}
							<a href={subItem.url} {...props} onclick={() => setOpenMobile(false)}>
								{#if subItem.icon}
									<subItem.icon />
								{/if}
								<span>{subItem.title}</span>
								{#if subItem.badge}
									<span class="ml-auto text-xs">{subItem.badge}</span>
								{/if}
							</a>
						{/snippet}
					</DropdownMenuItem>
				{/each}
			</DropdownMenuContent>
		</DropdownMenu>
	</Sidebar.MenuItem>
{/snippet}

<Sidebar.Group>
	<Sidebar.GroupLabel>{title}</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each items as item (`${item.title}-${item.url}`)}
			{#if !item.items}
				{@render SideBarMenuLink({ item })}

				<!-- {@const filteredSubItems = item.items?.filter((subItem) =>
                        hasNavPermission(subItem, hasPermission, hasRole),
                    )} -->

				<!-- // Si no hay sub-items visibles, no mostrar el item padre
                    if (!filteredSubItems || filteredSubItems.length === 0) {
                        return null;
                    }

                    // Crear item con sub-items filtrados
                    const filteredItem = { ...item, items: filteredSubItems }; -->
			{:else if state === 'collapsed'}
				{@render SidebarMenuCollapsedDropdown({ item })}
			{:else if item.items}
				{@render SidebarMenuCollapsible({ item })}
			{/if}
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
