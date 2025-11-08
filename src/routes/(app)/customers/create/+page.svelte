<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import type { CustomerSchema } from './schema';

	let { data }: { data: SuperValidated<Infer<CustomerSchema>> } = $props();

	const form = superForm(data.form, {
		onUpdated: ({ form }) => {
			if (form.valid) {
				toast.success('Cliente creado exitosamente');
			}
		},
		onError: () => {
			toast.error('Error al crear el cliente');
		}
	});

	const { form: formData, enhance, delayed } = form;

	function handleBack() {
		goto('/clientes');
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<Button variant="ghost" size="icon" onclick={handleBack}>
			<ArrowLeft class="h-5 w-5" />
		</Button>
		<div>
			<h1 class="text-3xl font-bold">Crear Nuevo Cliente</h1>
			<p class="text-sm text-muted-foreground">
				Completa el formulario para registrar un nuevo cliente
			</p>
		</div>
	</div>

	<!-- Form Card -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Información del Cliente</Card.Title>
			<Card.Description>Todos los campos marcados con * son obligatorios</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="POST" use:enhance class="space-y-6">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<!-- First Name -->
					<Form.Field {form} name="firstName">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Nombre *</Form.Label>
								<Input {...props} type="text" placeholder="Juan" bind:value={$formData.firstName} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<!-- Last Name -->
					<Form.Field {form} name="lastName">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Apellido *</Form.Label>
								<Input {...props} type="text" placeholder="Pérez" bind:value={$formData.lastName} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<!-- Email -->
					<Form.Field {form} name="email">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Email *</Form.Label>
								<Input
									{...props}
									type="email"
									placeholder="juan.perez@example.com"
									bind:value={$formData.email}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<!-- Phone Number -->
					<Form.Field {form} name="phoneNumber">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Teléfono</Form.Label>
								<Input
									name={props.name}
									id={props.id}
									type="tel"
									placeholder="987654321"
									value={$formData.phoneNumber ?? ''}
									oninput={(e) => {
										const target = e.currentTarget as HTMLInputElement;
										$formData.phoneNumber = target.value || undefined;
									}}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<!-- Birth Date -->
					<Form.Field {form} name="birthDate">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Fecha de Nacimiento *</Form.Label>
								<Input {...props} type="date" bind:value={$formData.birthDate} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<!-- Nationality -->
					<Form.Field {form} name="nationality">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Nacionalidad *</Form.Label>
								<Input
									{...props}
									type="text"
									placeholder="Peruana"
									bind:value={$formData.nationality}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<!-- Document Type -->
					<Form.Field {form} name="idDocumentType">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Tipo de Documento *</Form.Label>
								<select
									{...props}
									bind:value={$formData.idDocumentType}
									class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
								>
									<option value="DNI">DNI</option>
									<option value="PASSPORT">Pasaporte</option>
									<option value="DRIVER_LICENSE">Licencia de Conducir</option>
									<option value="RUC">RUC</option>
									<option value="CE">CE</option>
								</select>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<!-- Document Number -->
					<Form.Field {form} name="idDocumentNumber">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Número de Documento *</Form.Label>
								<Input
									{...props}
									type="text"
									placeholder="12345678"
									bind:value={$formData.idDocumentNumber}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<!-- Address -->
				<Form.Field {form} name="address">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Dirección</Form.Label>
							<Textarea
								name={props.name as string}
								id={props.id as string}
								placeholder="Av. Principal 123, Lima"
								rows={3}
								value={($formData.address ?? '') as string}
								oninput={(e) => {
									const target = e.currentTarget as HTMLTextAreaElement;
									$formData.address = target.value || undefined;
								}}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<!-- Actions -->
				<div class="flex justify-end gap-2">
					<Button type="button" variant="outline" onclick={handleBack}>Cancelar</Button>
					<Button type="submit" disabled={$delayed}>
						{$delayed ? 'Creando...' : 'Crear Cliente'}
					</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
