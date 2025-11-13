<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AvatarUserDropdown from './layout/avatar-user-dropdown/avatar-user-dropdown.svelte';
	import AutomaticBreadcrumb from './layout/custom-breadcrumb/automatic-breadcrumb.svelte';
	let user = {
		name: 'John Doe',
		email: 'john.doe@example.com',
		avatar: 'https://via.placeholder.com/150'
	}
</script>

<header
	class="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
>
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />
		<AutomaticBreadcrumb />
		<div class="ml-auto flex items-center gap-2">
			<AvatarUserDropdown {user} />
		</div>
	</div>
</header>
