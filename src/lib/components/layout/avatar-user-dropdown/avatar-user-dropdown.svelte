<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { SidebarState } from '$lib/components/ui/sidebar/context.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import {
		BadgeCheckIcon,
		BellIcon,
		ChevronsUpDownIcon,
		CreditCardIcon,
		LogOutIcon,
		SparklesIcon
	} from '@lucide/svelte';
	type AvatarUserDropdownProps = {
		user: {
			name: string;
			email: string;
			avatar: string;
		};
		sidebar?: SidebarState;
	};
	let { user, sidebar }: AvatarUserDropdownProps = $props();
</script>

<DropdownMenu.Root>
	{#if !!sidebar}
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Sidebar.MenuButton
					size="lg"
					class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					{...props}
				>
					<Avatar.Root class="size-8 rounded-lg">
						<Avatar.Image src={user.avatar} alt={user.name} />
						<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
					</Avatar.Root>
					<div class="grid flex-1 text-left text-sm leading-tight">
						<span class="truncate font-medium">{user.name}</span>
						<span class="truncate text-xs">{user.email}</span>
					</div>
					<ChevronsUpDownIcon class="ml-auto size-4" />
				</Sidebar.MenuButton>
			{/snippet}
		</DropdownMenu.Trigger>
	{:else}
		<DropdownMenu.Trigger
		>
			{#snippet child({ props })}
				<button {...props} class="inline-flex items-center rounded-md p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50">
					<Avatar.Root class="size-8 rounded-lg">
						<Avatar.Image src={user.avatar} alt={user.name} />
						<Avatar.Fallback class="rounded-lg">
							{user.name
								.split(' ')
								.map((n) => n[0])
								.join('')
								.slice(0, 2)}</Avatar.Fallback
						>
					</Avatar.Root>
				</button>
			{/snippet}
		</DropdownMenu.Trigger>
	{/if}
	<DropdownMenu.Content
		class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
		side={sidebar?.isMobile ? 'bottom' : 'right'}
		align="end"
		sideOffset={4}
	>
		<DropdownMenu.Label class="p-0 font-normal">
			<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
				<Avatar.Root class="size-8 rounded-lg">
					<Avatar.Image src={user.avatar} alt={user.name} />
					<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
				</Avatar.Root>
				<div class="grid flex-1 text-left text-sm leading-tight">
					<span class="truncate font-medium">{user.name}</span>
					<span class="truncate text-xs">{user.email}</span>
				</div>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item>
				<SparklesIcon />
				Upgrade to Pro
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item>
				<BadgeCheckIcon />
				Account
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<CreditCardIcon />
				Billing
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<BellIcon />
				Notifications
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			<LogOutIcon />
			Log out
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
