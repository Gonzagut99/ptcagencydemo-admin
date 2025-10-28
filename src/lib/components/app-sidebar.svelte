<script lang="ts">

	import NavDocuments from "./nav-documents.svelte";
	import NavMain from "./nav-main.svelte";
	import NavSecondary from "./nav-secondary.svelte";
	import NavUser from "./nav-user.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { ComponentProps } from "svelte";
	import { CameraIcon, ChartBarIcon, DatabaseIcon, Factory, FolderIcon, HelpCircleIcon, LayoutDashboardIcon, SearchIcon, SettingsIcon, UsersIcon } from "@lucide/svelte";

	const data = {
		user: {
			name: "shadcn",
			email: "m@example.com",
			avatar: "/avatars/shadcn.jpg",
		},
		navMain: [
			{
				title: "Dashboard",
				url: "#",
				icon: LayoutDashboardIcon,
			},
			// {
			// 	title: "Lifecycle",
			// 	url: "#",
			// 	icon: ListDetailsIcon,
			// },
			{
				title: "Analytics",
				url: "#",
				icon: ChartBarIcon,
			},
			{
				title: "Projects",
				url: "#",
				icon: FolderIcon,
			},
			{
				title: "Team",
				url: "#",
				icon: UsersIcon,
			},
		],
		navClouds: [
			{
				title: "Capture",
				icon: CameraIcon,
				isActive: true,
				url: "#",
				items: [
					{
						title: "Active Proposals",
						url: "#",
					},
					{
						title: "Archived",
						url: "#",
					},
				],
			},
			// {
			// 	title: "Proposal",
			// 	icon: FileDescriptionIcon,
			// 	url: "#",
			// 	items: [
			// 		{
			// 			title: "Active Proposals",
			// 			url: "#",
			// 		},
			// 		{
			// 			title: "Archived",
			// 			url: "#",
			// 		},
			// 	],
			// },
			// {
			// 	title: "Prompts",
			// 	icon: FileAiIcon,
			// 	url: "#",
			// 	items: [
			// 		{
			// 			title: "Active Proposals",
			// 			url: "#",
			// 		},
			// 		{
			// 			title: "Archived",
			// 			url: "#",
			// 		},
			// 	],
			// },
		],
		navSecondary: [
			{
				title: "Settings",
				url: "#",
				icon: SettingsIcon,
			},
			{
				title: "Get Help",
				url: "#",
				icon: HelpCircleIcon,
			},
			{
				title: "Search",
				url: "#",
				icon: SearchIcon,
			},
		],
		documents: [
			{
				name: "Data Library",
				url: "#",
				icon: DatabaseIcon,
			},
			// {
			// 	name: "Reports",
			// 	url: "#",
			// 	icon: ReportIcon,
			// },
		],
	};

	let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:!p-1.5">
					{#snippet child({ props })}
						<a href="##" {...props}>
							<Factory class="!size-5" />
							<span class="text-base font-semibold">Acme Inc.</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
		<NavDocuments items={data.documents} />
		<NavSecondary items={data.navSecondary} class="mt-auto" />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
</Sidebar.Root>
