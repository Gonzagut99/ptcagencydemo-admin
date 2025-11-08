<script lang="ts">
	import { page } from '$app/state';
	import { useCustomer } from '$lib/api/queries/customers';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { formatDate } from '$lib/utils/formatters';
	import { ArrowLeft, Mail, Phone, MapPin, Calendar, FileText, User } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';

	const customerId = $derived(parseInt(page.params.id || '0'));
	const customerQuery = $derived(useCustomer(customerId));

	const customer = $derived(customerQuery.data);
	const isLoading = $derived(customerQuery.isLoading);
	const isError = $derived(customerQuery.isError);

	const documentTypeLabels: Record<string, string> = {
		PASSPORT: 'Pasaporte',
		DNI: 'DNI',
		DRIVER_LICENSE: 'Licencia de Conducir',
		RUC: 'RUC',
		CE: 'CE'
	};

	function handleBack() {
		goto('/clientes');
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<Button variant="ghost" size="icon" onclick={handleBack}>
				<ArrowLeft class="h-5 w-5" />
			</Button>
			<div>
				<h1 class="text-3xl font-bold">Detalle del Cliente</h1>
				<p class="text-sm text-muted-foreground">Información completa del cliente</p>
			</div>
		</div>
	</div>

	{#if isLoading}
		<div class="flex items-center justify-center py-12">
			<div class="text-center">
				<div class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
				<p class="text-muted-foreground">Cargando información del cliente...</p>
			</div>
		</div>
	{:else if isError}
		<Card.Root>
			<Card.Content class="py-12 text-center">
				<p class="text-red-500">Error al cargar la información del cliente</p>
			</Card.Content>
		</Card.Root>
	{:else if customer}
		<!-- Customer Information Card -->
		<Card.Root>
			<Card.Header>
				<div class="flex items-center justify-between">
					<div>
						<Card.Title class="text-2xl">
							{customer.firstName}
							{customer.lastName}
						</Card.Title>
						<Card.Description>ID: #{customer.id}</Card.Description>
					</div>
				</div>
			</Card.Header>
			<Card.Content class="space-y-6">
				<!-- Contact Information -->
				<div>
					<h3 class="mb-3 text-lg font-semibold">Información de Contacto</h3>
					<div class="grid gap-4 md:grid-cols-2">
						<div class="flex items-center gap-3">
							<Mail class="h-5 w-5 text-muted-foreground" />
							<div>
								<p class="text-sm text-muted-foreground">Email</p>
								<p class="font-medium">{customer.email}</p>
							</div>
						</div>
						{#if customer.phoneNumber}
							<div class="flex items-center gap-3">
								<Phone class="h-5 w-5 text-muted-foreground" />
								<div>
									<p class="text-sm text-muted-foreground">Teléfono</p>
									<p class="font-medium">{customer.phoneNumber}</p>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<Separator />

				<!-- Personal Information -->
				<div>
					<h3 class="mb-3 text-lg font-semibold">Información Personal</h3>
					<div class="grid gap-4 md:grid-cols-2">
						{#if customer.birthDate}
							<div class="flex items-center gap-3">
								<Calendar class="h-5 w-5 text-muted-foreground" />
								<div>
									<p class="text-sm text-muted-foreground">Fecha de Nacimiento</p>
									<p class="font-medium">{formatDate(customer.birthDate)}</p>
								</div>
							</div>
						{/if}
						{#if customer.nationality}
							<div class="flex items-center gap-3">
								<User class="h-5 w-5 text-muted-foreground" />
								<div>
									<p class="text-sm text-muted-foreground">Nacionalidad</p>
									<p class="font-medium">{customer.nationality}</p>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<Separator />

				<!-- Document Information -->
				<div>
					<h3 class="mb-3 text-lg font-semibold">Documentos de Identidad</h3>
					<div class="grid gap-4 md:grid-cols-2">
						<div class="flex items-center gap-3">
							<FileText class="h-5 w-5 text-muted-foreground" />
							<div>
								<p class="text-sm text-muted-foreground">Tipo de Documento</p>
								<!-- <Badge variant="secondary">
									{documentTypeLabels[customer.idDocumentType] || customer.idDocumentType}
								</Badge> -->
							</div>
						</div>
						<div class="flex items-center gap-3">
							<FileText class="h-5 w-5 text-muted-foreground" />
							<div>
								<p class="text-sm text-muted-foreground">Número de Documento</p>
								<p class="font-medium">{customer.idDocumentNumber}</p>
							</div>
						</div>
					</div>
				</div>

				{#if customer.address}
					<Separator />

					<!-- Address -->
					<div>
						<h3 class="mb-3 text-lg font-semibold">Dirección</h3>
						<div class="flex items-start gap-3">
							<MapPin class="h-5 w-5 text-muted-foreground" />
							<p class="font-medium">{customer.address}</p>
						</div>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>

		<!-- Associated Liquidations Section -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Liquidaciones Asociadas</Card.Title>
				<Card.Description>Historial de liquidaciones del cliente</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="text-center py-8 text-muted-foreground">
					<p>Las liquidaciones asociadas se mostrarán aquí</p>
					<p class="text-sm mt-2">Esta funcionalidad se implementará en una tarea posterior</p>
				</div>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
