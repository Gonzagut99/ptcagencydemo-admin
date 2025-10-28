<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import * as CardContent from '$lib/components/ui/card';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	// Mock users for testing
	const mockUsers = [
		{
			id: 1,
			email: 'admin@ptc.com',
			password: 'admin123',
			userName: 'Admin User',
			role: 'SUPERADMIN'
		},
		{
			id: 2,
			email: 'ventas@ptc.com',
			password: 'ventas123',
			userName: 'Vendedor',
			role: 'SALES'
		},
		{
			id: 3,
			email: 'counter@ptc.com',
			password: 'counter123',
			userName: 'Counter',
			role: 'COUNTER'
		}
	];

	async function handleLogin() {
		error = '';
		loading = true;

		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Find mock user
		const user = mockUsers.find((u) => u.email === email && u.password === password);

		if (user) {
			// Generate mock token
			const mockToken = `mock_token_${user.id}_${Date.now()}`;

			// Login with auth store
			authStore.login(
				{
					id: user.id,
					userName: user.userName,
					email: user.email
				},
				mockToken
			);

			// Redirect to dashboard
			goto('/');
		} else {
			error = 'Credenciales inválidas';
		}

		loading = false;
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		handleLogin();
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
	<Card class="w-full max-w-md">
		<CardContent.CardHeader>
			<CardContent.CardTitle class="text-center text-2xl font-bold"
				>PTC Admin Panel</CardContent.CardTitle
			>
			<CardContent.CardDescription class="text-center"
				>Ingresa tus credenciales para acceder</CardContent.CardDescription
			>
		</CardContent.CardHeader>
		<CardContent.CardContent>
			<form onsubmit={handleSubmit} class="space-y-4">
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="usuario@ptc.com"
						bind:value={email}
						required
						disabled={loading}
					/>
				</div>

				<div class="space-y-2">
					<Label for="password">Contraseña</Label>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						bind:value={password}
						required
						disabled={loading}
					/>
				</div>

				{#if error}
					<div class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
						{error}
					</div>
				{/if}

				<Button type="submit" class="w-full" disabled={loading}>
					{loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
				</Button>
			</form>

			<div class="mt-6 space-y-2 rounded-md bg-muted p-4 text-sm">
				<p class="font-semibold">Usuarios de prueba:</p>
				<ul class="space-y-1 text-muted-foreground">
					<li>• admin@ptc.com / admin123 (Super Admin)</li>
					<li>• ventas@ptc.com / ventas123 (Ventas)</li>
					<li>• counter@ptc.com / counter123 (Counter)</li>
				</ul>
			</div>
		</CardContent.CardContent>
	</Card>
</div>
