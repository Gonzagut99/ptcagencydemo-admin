<script lang="ts">
	import { page } from '$app/state';

	const segments = page.route.id?.split('/').filter((segment) => segment.length > 0) ?? [];
	const endpointSegments = segments.map((segment, index) => {
		return segments.slice(0, index + 1).join('/');
	});
</script>

<div class="flex flex-col font-bold">
	<span>{'Url: '}{page.url}</span>
	<span>{'Param Id: '}{page.params.id}</span>
	<span
		>{'Param Contact Id: '}{page.params.contactId === undefined
			? 'No definido'
			: page.params.contactId}</span
	>
	<span>{'Params: '}{JSON.stringify(page.params)}</span>
	<span>{'All parts: '}{JSON.stringify(page.route.id)}</span>
	<span>{'Endpoint segments: '}{JSON.stringify(segments)}</span>
	<span>{'url config: '}{JSON.stringify(page.url.pathname)}</span>
</div>
