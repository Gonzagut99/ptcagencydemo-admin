<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { useSidebar } from "$lib/components/ui/sidebar/index.js";
	import AvatarUserDropdown from "./layout/avatar-user-dropdown/avatar-user-dropdown.svelte";


	let { user }: { user: { name: string; email: string; avatar: string } } = $props();
	const sidebar = useSidebar();
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<AvatarUserDropdown {user} sidebar={sidebar} />
	</Sidebar.MenuItem>
</Sidebar.Menu>
