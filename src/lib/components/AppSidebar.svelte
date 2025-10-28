<script lang="ts">
	import { page } from '$app/state';
	import { sidebarStore } from '$lib/stores/sidebar.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { House, FileText, Users, UserCog, Bell, ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	interface NavItem {
		title: string;
		href: string;
		icon: any;
	}

	const navItems: NavItem[] = [
		{ title: 'Inicio', href: '/', icon: House },
		{ title: 'Liquidaciones', href: '/liquidaciones', icon: FileText },
		{ title: 'Clientes', href: '/clientes', icon: Users },
		{ title: 'Personal', href: '/personal', icon: UserCog },
		{ title: 'Notificaciones', href: '/notificaciones', icon: Bell }
	];

	function isActive(href: string): boolean {
		if (href === '/') {
			return page.url.pathname === '/';
		}
		return page.url.pathname.startsWith(href);
	}
</script>

<Tooltip.Provider>
	<aside
		class={cn(
			'fixed top-0 left-0 z-40 h-screen border-r bg-background transition-all duration-300',
			sidebarStore.isCollapsed ? 'w-16' : 'w-64'
		)}
	>
		<div class="flex h-full flex-col">
			<!-- Header -->
			<div class="flex h-16 items-center justify-between border-b px-4">
				{#if !sidebarStore.isCollapsed}
					<h2 class="text-lg font-semibold">PTC Admin</h2>
				{/if}
				<Button
					variant="ghost"
					size="icon"
					onclick={() => sidebarStore.toggle()}
					class={cn(sidebarStore.isCollapsed && 'mx-auto')}
				>
					{#if sidebarStore.isCollapsed}
						<ChevronRight class="h-4 w-4" />
					{:else}
						<ChevronLeft class="h-4 w-4" />
					{/if}
				</Button>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 space-y-1 p-2">
				{#each navItems as item}
					{#if sidebarStore.isCollapsed}
						<Tooltip.Root>
							<Tooltip.Trigger>
								<a
									href={item.href}
									class={cn(
										'flex h-10 w-10 items-center justify-center rounded-md transition-colors',
										isActive(item.href)
											? 'bg-primary text-primary-foreground'
											: 'hover:bg-accent hover:text-accent-foreground'
									)}
								>
									<svelte:component this={item.icon} class="h-5 w-5" />
								</a>
							</Tooltip.Trigger>
							<Tooltip.Content side="right">
								<p>{item.title}</p>
							</Tooltip.Content>
						</Tooltip.Root>
					{:else}
						<a
							href={item.href}
							class={cn(
								'flex items-center gap-3 rounded-md px-3 py-2 transition-colors',
								isActive(item.href)
									? 'bg-primary text-primary-foreground'
									: 'hover:bg-accent hover:text-accent-foreground'
							)}
						>
							<svelte:component this={item.icon} class="h-5 w-5" />
							<span>{item.title}</span>
						</a>
					{/if}
				{/each}
			</nav>
		</div>
	</aside>
</Tooltip.Provider>
