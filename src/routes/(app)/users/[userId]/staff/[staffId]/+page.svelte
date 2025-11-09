<script>
	import { page } from '$app/state';
</script>

<div class="flex flex-col font-bold">
	<span>{'Url: '}{page.url}</span>
	<span>{'Param User Id: '}{page.params.userId}</span>
	<span
		>{'Param Staff Id: '}{page.params.staffId === undefined
			? 'No definido'
			: page.params.staffId}</span
	>
</div>
