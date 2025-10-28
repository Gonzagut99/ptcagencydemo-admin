<script lang="ts">

	import Card from '$lib/components/ui/card/card.svelte';
	import * as CardContent from '$lib/components/ui/card';
	import { FileText, Users, UserCog, Bell } from '@lucide/svelte';

	const stats = [
		{
			title: 'Liquidaciones',
			value: '24',
			description: 'Activas este mes',
			icon: FileText,
			href: '/liquidaciones'
		},
		{
			title: 'Clientes',
			value: '156',
			description: 'Clientes registrados',
			icon: Users,
			href: '/clientes'
		},
		{
			title: 'Personal',
			value: '12',
			description: 'Miembros del equipo',
			icon: UserCog,
			href: '/personal'
		},
		{
			title: 'Notificaciones',
			value: '3',
			description: 'Sin leer',
			icon: Bell,
			href: '/notificaciones'
		}
	];
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-3xl font-bold">Bienvenido al Panel de Administración</h1>
		<p class="mt-2 text-muted-foreground">Aquí está un resumen de tu panel de administración</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each stats as stat}
			<a href={stat.href} class="block transition-transform hover:scale-105">
				<Card>
					<CardContent.CardHeader class="flex flex-row items-center justify-between pb-2">
						<CardContent.CardTitle class="text-sm font-medium">
							{stat.title}
						</CardContent.CardTitle>
						<svelte:component this={stat.icon} class="h-4 w-4 text-muted-foreground" />
					</CardContent.CardHeader>
					<CardContent.CardContent>
						<div class="text-2xl font-bold">{stat.value}</div>
						<p class="mt-1 text-xs text-muted-foreground">
							{stat.description}
						</p>
					</CardContent.CardContent>
				</Card>
			</a>
		{/each}
	</div>

	<!-- Welcome Card -->
	<Card>
		<CardContent.CardHeader>
			<CardContent.CardTitle>Panel de Administración PTC</CardContent.CardTitle>
			<CardContent.CardDescription>
				Sistema de gestión de liquidaciones y servicios turísticos
			</CardContent.CardDescription>
		</CardContent.CardHeader>
		<CardContent.CardContent>
			<div class="space-y-4">
				<div>
					<h3 class="mb-2 font-semibold">Acceso Rápido</h3>
					<ul class="space-y-2 text-sm">
						<li>• Gestiona liquidaciones de clientes</li>
						<li>• Administra información de clientes</li>
						<li>• Supervisa el personal y sus roles</li>
						<li>• Recibe notificaciones en tiempo real</li>
					</ul>
				</div>
				<div class="rounded-md bg-muted p-4 text-sm">
					<p class="mb-1 font-semibold">Estado del Sistema</p>
					<p class="text-muted-foreground">✅ Modo MVP - Autenticación deshabilitada</p>
					<p class="text-muted-foreground">✅ Sistema listo para pruebas</p>
				</div>
			</div>
		</CardContent.CardContent>
	</Card>
</div>
