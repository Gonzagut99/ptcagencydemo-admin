<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Badge } from '$lib/components/ui/badge';
	import { Bell, User, LogOut } from '@lucide/svelte';

	interface Props {
		breadcrumbs?: Snippet;
	}

	let { breadcrumbs }: Props = $props();

	// Mock unread notifications count - will be replaced with real data
	let unreadCount = $state(3);

	// Mock user data for MVP
	const mockUser = {
		userName: 'Usuario Demo',
		email: 'demo@ptc.com'
	};

	function handleLogout() {
		// Logout disabled for MVP
		console.log('Logout clicked');
	}
</script>

<header class="flex h-16 items-center justify-between border-b bg-background px-6">
	<div class="flex items-center gap-4">
		{@render breadcrumbs?.()}
	</div>

	<div class="flex items-center gap-2">
		<!-- Notifications -->
		<Button variant="ghost" size="icon" class="relative">
			<Bell class="h-5 w-5" />
			{#if unreadCount > 0}
				<Badge
					variant="destructive"
					class="absolute -top-1 -right-1 h-5 min-w-5 rounded-full px-1 text-xs"
				>
					{unreadCount}
				</Badge>
			{/if}
		</Button>

		<!-- User Menu -->
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button variant="ghost" class="gap-2">
					<User class="h-5 w-5" />
					<span class="hidden md:inline">{mockUser.userName}</span>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="w-56">
				<DropdownMenu.Label>
					<div class="flex flex-col space-y-1">
						<p class="text-sm font-medium">{mockUser.userName}</p>
						<p class="text-xs text-muted-foreground">{mockUser.email}</p>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={handleLogout} class="cursor-pointer text-destructive">
					<LogOut class="mr-2 h-4 w-4" />
					<span>Cerrar Sesión (Deshabilitado)</span>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</header>
