<script lang="ts">
	import { z, type Infer } from 'zod';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { useCreateCustomer } from '$lib/api/queries/customers';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';

	let { onSuccess } = $props<{
		onSuccess?: () => void;
	}>();

	const createCustomerMutation = useCreateCustomer();

	// Validation schema
	const customerSchema = z.object({
		firstName: z.string().min(1, 'El nombre es requerido'),
		lastName: z.string().min(1, 'El apellido es requerido'),
		email: z.string().min(1, 'El email es requerido').email('El email no es válido'),
		phoneNumber: z.string().optional(),
		birthDate: z
			.string()
			.min(1, 'La fecha de nacimiento es requerida')
			.refine((date) => {
				const d = new Date(date);
				return d < new Date();
			}, 'La fecha debe ser en el pasado'),
		idDocumentType: z.enum(['DNI', 'PASSPORT', 'DRIVER_LICENSE', 'RUC', 'CE']),
		idDocumentNumber: z.string().min(1, 'El número de documento es requerido'),
		address: z.string().optional(),
		nationality: z.string().min(1, 'La nacionalidad es requerida')
	});

	type CustomerSchema = Infer<typeof customerSchema>;

	const form = superForm<CustomerSchema>(
		{
			firstName: '',
			lastName: '',
			email: '',
			phoneNumber: '',
			birthDate: '',
			idDocumentType: 'DNI',
			idDocumentNumber: '',
			address: '',
			nationality: ''
		} as any,
		{
			validators: zodClient(customerSchema),
			SPA: true,
			dataType: 'json',
			onUpdate: async ({ form: formResult }: { form: any }) => {
				if (formResult.valid) {
					try {
						await createCustomerMutation.mutateAsync(formResult.data);
						toast.success('Cliente creado exitosamente');
						onSuccess?.();
					} catch (error) {
						console.error('Error creating customer:', error);
						toast.error('Error al crear el cliente');
					}
				}
			}
		}
	);

	const { form: formData, enhance } = form;

	const isSubmitting = $derived(createCustomerMutation.isPending);
</script>

<form method="POST" use:enhance class="space-y-4">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<!-- First Name -->
		<Form.Field {form} name="firstName">
			{#snippet children()}
				<Form.Label>Nombre *</Form.Label>
				<Form.Control let:attrs>
					<Input {...attrs} type="text" placeholder="Juan" bind:value={$formData.firstName} />
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<!-- Last Name -->
		<Form.Field {form} name="lastName">
			{#snippet children()}
				<Form.Label>Apellido *</Form.Label>
				<Form.Control let:attrs>
					<Input {...attrs} type="text" placeholder="Pérez" bind:value={$formData.lastName} />
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<!-- Email -->
		<Form.Field {form} name="email">
			{#snippet children()}
				<Form.Label>Email *</Form.Label>
				<Form.Control let:attrs>
					<Input
						{...attrs}
						type="email"
						placeholder="juan.perez@example.com"
						bind:value={$formData.email}
					/>
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<!-- Phone Number -->
		<Form.Field {form} name="phoneNumber">
			{#snippet children()}
				<Form.Label>Teléfono</Form.Label>
				<Form.Control let:attrs>
					<Input {...attrs} type="tel" placeholder="987654321" bind:value={$formData.phoneNumber} />
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<!-- Birth Date -->
		<Form.Field {form} name="birthDate">
			{#snippet children()}
				<Form.Label>Fecha de Nacimiento *</Form.Label>
				<Form.Control let:attrs>
					<Input {...attrs} type="date" bind:value={$formData.birthDate} />
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<!-- Nationality -->
		<Form.Field {form} name="nationality">
			{#snippet children()}
				<Form.Label>Nacionalidad *</Form.Label>
				<Form.Control let:attrs>
					<Input {...attrs} type="text" placeholder="Peruana" bind:value={$formData.nationality} />
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<!-- Document Type -->
		<Form.Field {form} name="idDocumentType">
			{#snippet children()}
				<Form.Label>Tipo de Documento *</Form.Label>
				<Form.Control let:attrs>
					<select {...attrs} bind:value={$formData.idDocumentType} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
						<option value="DNI">DNI</option>
						<option value="PASSPORT">Pasaporte</option>
						<option value="DRIVER_LICENSE">Licencia de Conducir</option>
						<option value="RUC">RUC</option>
						<option value="CE">CE</option>
					</select>
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<!-- Document Number -->
		<Form.Field {form} name="idDocumentNumber">
			{#snippet children()}
				<Form.Label>Número de Documento *</Form.Label>
				<Form.Control let:attrs>
					<Input
						{...attrs}
						type="text"
						placeholder="12345678"
						bind:value={$formData.idDocumentNumber}
					/>
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>
	</div>

	<!-- Address -->
	<Form.Field {form} name="address">
		{#snippet children()}
			<Form.Label>Dirección</Form.Label>
			<Form.Control let:attrs>
				<Textarea
					{...attrs}
					placeholder="Av. Principal 123, Lima"
					rows={3}
					bind:value={$formData.address}
				/>
			</Form.Control>
			<Form.FieldErrors />
		{/snippet}
	</Form.Field>

	<!-- Submit Button -->
	<div class="flex justify-end gap-2">
		<Button type="submit" disabled={isSubmitting}>
			{isSubmitting ? 'Creando...' : 'Crear Cliente'}
		</Button>
	</div>
</form>
