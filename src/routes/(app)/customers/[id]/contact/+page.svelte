<script>
    import { page } from '$app/state';
</script>
<div class="font-bold flex flex-col">
    <span>{'Url: '}{page.url}</span>
    <span>{'Param Id: '}{page.params.id}</span>
    <span>{'Param Contact Id: '}{page.params.contactId === undefined ? 'No definido' : page.params.contactId}</span>
</div>