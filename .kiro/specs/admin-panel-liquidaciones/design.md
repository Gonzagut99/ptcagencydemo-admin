# Design Document

## Overview

El Admin Panel de Liquidaciones será una aplicación SvelteKit con Svelte 5 que consume una API REST existente. Utilizará shadcn-svelte para componentes UI, TanStack Query para gestión de estado del servidor, y openapi-fetch para cliente API type-safe. La arquitectura seguirá el patrón de SvelteKit con rutas basadas en archivos, componentes reutilizables y stores para estado global.

### Tecnologías Principales

- **SvelteKit 2**: Framework full-stack con SSR y routing
- **Svelte 5**: Runes para reactividad ($state, $derived, $effect)
- **TypeScript**: Type safety completo
- **TailwindCSS 4**: Styling con @tailwindcss/vite
- **shadcn-svelte**: Componentes UI accesibles (incluye DataTable con TanStack Table)
- **@ieedan/shadcn-svelte-extras**: Componentes adicionales (sidebar, breadcrumbs)
- **TanStack Query**: Cache y sincronización de datos del servidor
- **TanStack Table**: Tablas potentes con sorting, filtering, pagination
- **openapi-fetch**: Cliente HTTP type-safe desde OpenAPI spec
- **Lucide Svelte**: Iconos

## Architecture

### Estructura de Directorios

```
src/
├── lib/
│   ├── api/
│   │   ├── api.ts                    # OpenAPI types generados
│   │   ├── client.ts                 # Cliente openapi-fetch configurado
│   │   └── queries/                  # TanStack Query hooks
│   │       ├── auth.ts
│   │       ├── liquidations.ts
│   │       ├── customers.ts
│   │       ├── staff.ts
│   │       └── notifications.ts
│   ├── components/
│   │   ├── ui/                       # shadcn-svelte components (incluye data-table)
│   │   ├── layout/
│   │   │   ├── AppSidebar.svelte
│   │   │   ├── AppBreadcrumbs.svelte
│   │   │   ├── AppHeader.svelte
│   │   │   └── NotificationPanel.svelte
│   │   ├── data-tables/              # TanStack Table configurations
│   │   │   ├── liquidations/
│   │   │   │   ├── columns.ts        # Column definitions
│   │   │   │   ├── actions.svelte    # Row actions
│   │   │   │   └── filters.svelte    # Custom filters
│   │   │   ├── customers/
│   │   │   │   ├── columns.ts
│   │   │   │   └── actions.svelte
│   │   │   ├── staff/
│   │   │   │   ├── columns.ts
│   │   │   │   └── actions.svelte
│   │   │   └── notifications/
│   │   │       ├── columns.ts
│   │   │       └── actions.svelte
│   │   ├── liquidations/
│   │   │   ├── LiquidationCard.svelte
│   │   │   ├── LiquidationDetail.svelte
│   │   │   ├── ServiceSection.svelte
│   │   │   ├── PaymentSection.svelte
│   │   │   └── IncidencySection.svelte
│   │   ├── customers/
│   │   │   ├── CustomerForm.svelte
│   │   │   └── CustomerDetail.svelte
│   │   ├── staff/
│   │   │   └── StaffForm.svelte
│   │   └── forms/
│   │       ├── TourServiceForm.svelte
│   │       ├── HotelServiceForm.svelte
│   │       ├── FlightServiceForm.svelte
│   │       └── AdditionalServiceForm.svelte
│   ├── stores/
│   │   ├── auth.svelte.ts            # Auth state con runes
│   │   ├── sidebar.svelte.ts         # Sidebar collapse state
│   │   └── notifications.svelte.ts   # SSE notifications state
│   ├── utils/
│   │   ├── formatters.ts             # Date, currency formatters
│   │   ├── validators.ts             # Form validation
│   │   └── constants.ts              # Enums, constants
│   └── types/
│       └── index.ts                  # Custom types
├── routes/
│   ├── (auth)/
│   │   └── login/
│   │       └── +page.svelte
│   ├── (app)/
│   │   ├── +layout.svelte            # Main app layout con sidebar
│   │   ├── +layout.ts                # Auth guard
│   │   ├── dashboard/
│   │   │   └── +page.svelte
│   │   ├── liquidaciones/
│   │   │   ├── +page.svelte          # Lista
│   │   │   ├── nueva/
│   │   │   │   └── +page.svelte
│   │   │   └── [id]/
│   │   │       └── +page.svelte      # Detalle
│   │   ├── clientes/
│   │   │   ├── +page.svelte
│   │   │   └── [id]/
│   │   │       └── +page.svelte
│   │   ├── staff/
│   │   │   └── +page.svelte
│   │   └── notificaciones/
│   │       └── +page.svelte
│   └── +layout.svelte                # Root layout
└── app.css                           # Global styles
```

### Routing Strategy

- **Grupos de rutas**: `(auth)` para login, `(app)` para rutas protegidas
- **Layout anidados**: Layout principal en `(app)/+layout.svelte` con sidebar y header
- **Guards**: `+layout.ts` en `(app)` verifica autenticación
- **Parámetros dinámicos**: `[id]` para detalles de entidades

## Components and Interfaces

### 0. DataTable Architecture (TanStack Table)

Todos los listados usarán el componente DataTable de shadcn-svelte que integra TanStack Table. La arquitectura será:

#### Column Definitions Pattern

Cada entidad tendrá su archivo de columnas que define:
- Columnas visibles y su formato
- Sorting y filtering por columna
- Acciones por fila (ver, editar, eliminar)

```typescript
// lib/components/data-tables/liquidations/columns.ts
import type { ColumnDef } from '@tanstack/table-core';
import type { components } from '$lib/api/api';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import LiquidationActions from './actions.svelte';
import { Badge } from '$lib/components/ui/badge';

type Liquidation = components['schemas']['LiquidationWithDetailsDto'];

export const columns: ColumnDef<Liquidation>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'customer',
    header: 'Cliente',
    cell: ({ row }) => {
      const customer = row.original.customer;
      return `${customer?.firstName} ${customer?.lastName}`;
    }
  },
  {
    accessorKey: 'staff_on_charge',
    header: 'Staff',
    cell: ({ row }) => {
      const staff = row.original.staff_on_charge;
      return staff?.user?.userName || '-';
    }
  },
  {
    accessorKey: 'total_amount',
    header: 'Monto Total',
    cell: ({ row }) => {
      const amount = row.getValue('total_amount') as number;
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
      }).format(amount);
    }
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return renderComponent(Badge, { 
        variant: getStatusVariant(status),
        children: getStatusLabel(status)
      });
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'payment_status',
    header: 'Estado Pago',
    cell: ({ row }) => {
      const status = row.getValue('payment_status') as string;
      return renderComponent(Badge, {
        variant: getPaymentStatusVariant(status),
        children: getPaymentStatusLabel(status)
      });
    }
  },
  {
    accessorKey: 'payment_deadline',
    header: 'Fecha Límite',
    cell: ({ row }) => {
      const deadline = row.getValue('payment_deadline') as string;
      const isOverdue = new Date(deadline) < new Date();
      return renderComponent('div', {
        class: isOverdue ? 'text-red-600 font-semibold' : '',
        children: new Date(deadline).toLocaleDateString('es-PE')
      });
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => renderComponent(LiquidationActions, { liquidation: row.original })
  }
];
```

#### Server-Side Pagination Pattern

```typescript
// lib/api/queries/liquidations.ts
export function useLiquidations(options: {
  page: number;
  size: number;
  status?: string;
  paymentStatus?: string;
  search?: string;
}) {
  return createQuery({
    queryKey: liquidationsKeys.list(options),
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/liquidations/paginated', {
        params: {
          query: { 
            requestDto: { 
              page: options.page, 
              size: options.size 
            }
          }
        }
      });
      if (error) throw error;
      return data;
    },
    placeholderData: (prev) => prev // Keep previous data while loading
  });
}
```

#### Row Actions Pattern

```svelte
<!-- lib/components/data-tables/liquidations/actions.svelte -->
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { DropdownMenu } from '$lib/components/ui/dropdown-menu';
  import { MoreHorizontal, Eye, Edit, Trash } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import type { components } from '$lib/api/api';

  type Liquidation = components['schemas']['LiquidationWithDetailsDto'];

  let { liquidation } = $props<{ liquidation: Liquidation }>();

  function handleView() {
    goto(`/liquidaciones/${liquidation.id}`);
  }

  function handleEdit() {
    // Open edit modal or navigate to edit page
  }

  function handleDelete() {
    // Show confirmation dialog
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} variant="ghost" size="icon">
      <MoreHorizontal class="h-4 w-4" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item onclick={handleView}>
      <Eye class="mr-2 h-4 w-4" />
      Ver Detalle
    </DropdownMenu.Item>
    <DropdownMenu.Item onclick={handleEdit}>
      <Edit class="mr-2 h-4 w-4" />
      Editar
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item onclick={handleDelete} class="text-red-600">
      <Trash class="mr-2 h-4 w-4" />
      Eliminar
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

#### Filters Pattern

```svelte
<!-- lib/components/data-tables/liquidations/filters.svelte -->
<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import { Select } from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';
  import { X } from 'lucide-svelte';

  let { 
    statusFilter = $bindable([]),
    paymentStatusFilter = $bindable([]),
    searchQuery = $bindable('')
  } = $props<{
    statusFilter: string[];
    paymentStatusFilter: string[];
    searchQuery: string;
  }>();

  const statusOptions = [
    { value: 'IN_QUOTE', label: 'En Cotización' },
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'ON_COURSE', label: 'En Curso' },
    { value: 'COMPLETED', label: 'Completado' }
  ];

  const paymentStatusOptions = [
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'ON_COURSE', label: 'En Curso' },
    { value: 'COMPLETED', label: 'Completado' }
  ];

  function clearFilters() {
    statusFilter = [];
    paymentStatusFilter = [];
    searchQuery = '';
  }

  const hasActiveFilters = $derived(
    statusFilter.length > 0 || 
    paymentStatusFilter.length > 0 || 
    searchQuery.length > 0
  );
</script>

<div class="flex flex-wrap gap-4">
  <Input
    type="search"
    placeholder="Buscar por cliente..."
    bind:value={searchQuery}
    class="max-w-sm"
  />

  <Select.Root multiple bind:value={statusFilter}>
    <Select.Trigger class="w-[200px]">
      <Select.Value placeholder="Estado" />
    </Select.Trigger>
    <Select.Content>
      {#each statusOptions as option}
        <Select.Item value={option.value}>{option.label}</Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>

  <Select.Root multiple bind:value={paymentStatusFilter}>
    <Select.Trigger class="w-[200px]">
      <Select.Value placeholder="Estado de Pago" />
    </Select.Trigger>
    <Select.Content>
      {#each paymentStatusOptions as option}
        <Select.Item value={option.value}>{option.label}</Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>

  {#if hasActiveFilters}
    <Button variant="ghost" onclick={clearFilters}>
      <X class="mr-2 h-4 w-4" />
      Limpiar Filtros
    </Button>
  {/if}
</div>
```

#### DataTable Usage Pattern

```svelte
<!-- routes/(app)/liquidaciones/+page.svelte -->
<script lang="ts">
  import { DataTable } from '$lib/components/ui/data-table';
  import { columns } from '$lib/components/data-tables/liquidations/columns';
  import { useLiquidations } from '$lib/api/queries/liquidations';
  import LiquidationFilters from '$lib/components/data-tables/liquidations/filters.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Plus } from 'lucide-svelte';

  let page = $state(0);
  let pageSize = $state(10);
  let statusFilter = $state<string[]>([]);
  let paymentStatusFilter = $state<string[]>([]);
  let searchQuery = $state('');

  const liquidationsQuery = $derived(useLiquidations({
    page,
    size: pageSize,
    status: statusFilter.join(','),
    paymentStatus: paymentStatusFilter.join(','),
    search: searchQuery
  }));

  const data = $derived(liquidationsQuery.data?.content || []);
  const pageCount = $derived(liquidationsQuery.data?.page?.totalPages || 0);
  const totalElements = $derived(liquidationsQuery.data?.page?.totalElements || 0);
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold">Liquidaciones</h1>
      <p class="text-sm text-muted-foreground">
        {totalElements} liquidaciones en total
      </p>
    </div>
    <Button href="/liquidaciones/nueva">
      <Plus class="mr-2 h-4 w-4" />
      Nueva Liquidación
    </Button>
  </div>

  <LiquidationFilters 
    bind:statusFilter 
    bind:paymentStatusFilter 
    bind:searchQuery
  />

  <DataTable 
    {columns}
    {data}
    {pageCount}
    bind:pageIndex={page}
    bind:pageSize
    loading={liquidationsQuery.isLoading}
  />
</div>
```

### 1. Authentication System

#### Auth Store (`lib/stores/auth.svelte.ts`)

```typescript
import { goto } from '$app/navigation';

interface User {
  id: number;
  userName: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

class AuthStore {
  private state = $state<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false
  });

  get user() {
    return this.state.user;
  }

  get token() {
    return this.state.token;
  }

  get isAuthenticated() {
    return this.state.isAuthenticated;
  }

  login(user: User, token: string) {
    this.state.user = user;
    this.state.token = token;
    this.state.isAuthenticated = true;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.state.user = null;
    this.state.token = null;
    this.state.isAuthenticated = false;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    goto('/login');
  }

  initialize() {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      this.state.token = token;
      this.state.user = JSON.parse(userStr);
      this.state.isAuthenticated = true;
    }
  }
}

export const authStore = new AuthStore();
```

#### API Client (`lib/api/client.ts`)

```typescript
import createClient from 'openapi-fetch';
import type { paths } from './api';
import { authStore } from '$lib/stores/auth.svelte';

export const apiClient = createClient<paths>({
  baseUrl: 'http://localhost:8090/ptc/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
apiClient.use({
  onRequest({ request }) {
    const token = authStore.token;
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },
  onResponse({ response }) {
    if (response.status === 401) {
      authStore.logout();
    }
    return response;
  }
});
```

### 2. Layout Components

#### App Layout (`routes/(app)/+layout.svelte`)

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import AppSidebar from '$lib/components/layout/AppSidebar.svelte';
  import AppHeader from '$lib/components/layout/AppHeader.svelte';
  import AppBreadcrumbs from '$lib/components/layout/AppBreadcrumbs.svelte';
  import { sidebarStore } from '$lib/stores/sidebar.svelte';
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { queryClient } from '$lib/api/queryClient';

  let { children } = $props();
</script>

<QueryClientProvider client={queryClient}>
  <div class="flex h-screen overflow-hidden">
    <AppSidebar collapsed={sidebarStore.collapsed} />
    
    <div class="flex flex-1 flex-col overflow-hidden">
      <AppHeader />
      
      <main class="flex-1 overflow-y-auto bg-gray-50 p-6">
        <AppBreadcrumbs />
        <div class="mx-auto max-w-7xl">
          {@render children()}
        </div>
      </main>
    </div>
  </div>
</QueryClientProvider>
```

#### Sidebar Component (`lib/components/layout/AppSidebar.svelte`)

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { 
    LayoutDashboard, 
    FileText, 
    Users, 
    UserCog, 
    Bell,
    ChevronLeft 
  } from 'lucide-svelte';
  import { sidebarStore } from '$lib/stores/sidebar.svelte';
  import { Button } from '$lib/components/ui/button';

  interface NavItem {
    label: string;
    href: string;
    icon: any;
  }

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Liquidaciones', href: '/liquidaciones', icon: FileText },
    { label: 'Clientes', href: '/clientes', icon: Users },
    { label: 'Staff', href: '/staff', icon: UserCog },
    { label: 'Notificaciones', href: '/notificaciones', icon: Bell }
  ];

  let { collapsed = $bindable(false) } = $props();
</script>

<aside 
  class="flex flex-col border-r bg-white transition-all duration-300"
  class:w-64={!collapsed}
  class:w-16={collapsed}
>
  <div class="flex h-16 items-center justify-between border-b px-4">
    {#if !collapsed}
      <span class="text-xl font-bold">PTC Admin</span>
    {/if}
    <Button 
      variant="ghost" 
      size="icon"
      onclick={() => sidebarStore.toggle()}
    >
      <ChevronLeft class="transition-transform" class:rotate-180={collapsed} />
    </Button>
  </div>

  <nav class="flex-1 space-y-1 p-2">
    {#each navItems as item}
      <a
        href={item.href}
        class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
        class:bg-primary={$page.url.pathname.startsWith(item.href)}
        class:text-primary-foreground={$page.url.pathname.startsWith(item.href)}
        class:hover:bg-gray-100={!$page.url.pathname.startsWith(item.href)}
      >
        <svelte:component this={item.icon} class="h-5 w-5" />
        {#if !collapsed}
          <span>{item.label}</span>
        {/if}
      </a>
    {/each}
  </nav>
</aside>
```

#### Breadcrumbs Component (`lib/components/layout/AppBreadcrumbs.svelte`)

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { ChevronRight } from 'lucide-svelte';

  interface Breadcrumb {
    label: string;
    href: string;
  }

  const breadcrumbs = $derived<Breadcrumb[]>(() => {
    const segments = $page.url.pathname.split('/').filter(Boolean);
    const crumbs: Breadcrumb[] = [{ label: 'Inicio', href: '/dashboard' }];
    
    let path = '';
    for (const segment of segments) {
      path += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      crumbs.push({ label, href: path });
    }
    
    return crumbs;
  });
</script>

<nav class="mb-4 flex items-center space-x-2 text-sm text-gray-600">
  {#each breadcrumbs as crumb, i}
    {#if i > 0}
      <ChevronRight class="h-4 w-4" />
    {/if}
    {#if i === breadcrumbs.length - 1}
      <span class="font-medium text-gray-900">{crumb.label}</span>
    {:else}
      <a href={crumb.href} class="hover:text-gray-900">{crumb.label}</a>
    {/if}
  {/each}
</nav>
```

### 3. TanStack Query Integration

#### Query Client Setup (`lib/api/queryClient.ts`)

```typescript
import { QueryClient } from '@tanstack/svelte-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});
```

#### Liquidations Queries (`lib/api/queries/liquidations.ts`)

```typescript
import { createQuery, createMutation } from '@tanstack/svelte-query';
import { apiClient } from '../client';
import { queryClient } from '../queryClient';
import type { components } from '../api';

export const liquidationsKeys = {
  all: ['liquidations'] as const,
  lists: () => [...liquidationsKeys.all, 'list'] as const,
  list: (filters: any) => [...liquidationsKeys.lists(), filters] as const,
  details: () => [...liquidationsKeys.all, 'detail'] as const,
  detail: (id: number) => [...liquidationsKeys.details(), id] as const
};

export function useLiquidations(page: number = 0, size: number = 10) {
  return createQuery({
    queryKey: liquidationsKeys.list({ page, size }),
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/liquidations/paginated', {
        params: {
          query: { requestDto: { page, size } }
        }
      });
      if (error) throw error;
      return data;
    }
  });
}

export function useLiquidation(id: number) {
  return createQuery({
    queryKey: liquidationsKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/liquidations/{liquidationId}', {
        params: { path: { liquidationId: id } }
      });
      if (error) throw error;
      return data;
    }
  });
}

export function useCreateLiquidation() {
  return createMutation({
    mutationFn: async (dto: components['schemas']['CreateLiquidationDto']) => {
      const { data, error } = await apiClient.POST('/liquidations', {
        body: dto
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: liquidationsKeys.lists() });
    }
  });
}

export function useAddTourService(liquidationId: number) {
  return createMutation({
    mutationFn: async (dto: components['schemas']['AddTourServiceDto']) => {
      const { data, error } = await apiClient.POST(
        '/liquidations/{liquidationId}/tour-services',
        {
          params: { path: { liquidationId } },
          body: dto
        }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: liquidationsKeys.detail(liquidationId) 
      });
    }
  });
}

// Similar mutations for hotel, flight, additional services, payments, incidencies
```

### 4. Notifications System

#### SSE Store (`lib/stores/notifications.svelte.ts`)

```typescript
import type { components } from '$lib/api/api';

type UserNotification = components['schemas']['DUserNotification'];

class NotificationsStore {
  private notifications = $state<UserNotification[]>([]);
  private eventSource: EventSource | null = null;
  
  get all() {
    return this.notifications;
  }
  
  get unreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  connect(userId: number) {
    if (this.eventSource) {
      this.eventSource.close();
    }

    this.eventSource = new EventSource(
      `http://localhost:8090/ptc/api/notifications/subscribe/${userId}`
    );

    this.eventSource.onmessage = (event) => {
      const notification: UserNotification = JSON.parse(event.data);
      this.notifications = [notification, ...this.notifications];
    };

    this.eventSource.onerror = () => {
      console.error('SSE connection error');
      this.eventSource?.close();
    };
  }

  disconnect() {
    this.eventSource?.close();
    this.eventSource = null;
  }

  addNotifications(newNotifications: UserNotification[]) {
    this.notifications = [...newNotifications, ...this.notifications];
  }

  markAsRead(notificationId: number) {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      this.notifications[index] = { ...this.notifications[index], read: true };
    }
  }
}

export const notificationsStore = new NotificationsStore();
```

## Data Models

### Key Interfaces (from OpenAPI)

Los tipos principales ya están generados en `api.ts`:

- `DUser`: Usuario del sistema
- `DStaff`: Personal con rol y relación 1:1 con User
- `DCustomer`: Cliente con información personal y documentos
- `DLiquidation`: Liquidación principal
- `LiquidationWithDetailsDto`: Liquidación con todos los detalles anidados
- `DTourService`, `DHotelService`, `DFlightService`, `DAdditionalServices`: Servicios
- `DPayment`: Pagos con método y validación
- `DIncidency`: Incidencias con aprobación
- `DUserNotification`: Notificaciones del usuario

### Custom Types (`lib/types/index.ts`)

```typescript
export type LiquidationStatus = 'IN_QUOTE' | 'PENDING' | 'ON_COURSE' | 'COMPLETED';
export type PaymentStatus = 'PENDING' | 'ON_COURSE' | 'COMPLETED';
export type ServiceStatus = 'PENDING' | 'COMPLETED' | 'CANCELED';
export type Currency = 'PEN' | 'USD';
export type StaffRole = 'SALES' | 'COUNTER' | 'ACCOUNTING' | 'OPERATIONS' | 'SUPERADMIN' | 'SUPPORT';
export type PaymentMethod = 'DEBIT' | 'CREDIT' | 'YAPE' | 'OTHER';
export type IdDocumentType = 'PASSPORT' | 'DNI' | 'DRIVER_LICENSE' | 'RUC' | 'CE';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface DashboardMetrics {
  activeLiquidations: number;
  pendingPayments: number;
  monthlyRevenue: number;
  activeCustomers: number;
}
```

## Error Handling

### Error Boundary Component (`lib/components/ErrorBoundary.svelte`)

```svelte
<script lang="ts">
  import { AlertCircle } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';

  let { error, reset } = $props<{ error: Error; reset: () => void }>();
</script>

<div class="flex min-h-[400px] flex-col items-center justify-center">
  <AlertCircle class="mb-4 h-12 w-12 text-red-500" />
  <h2 class="mb-2 text-xl font-semibold">Algo salió mal</h2>
  <p class="mb-4 text-gray-600">
    {error.message || 'Ha ocurrido un error inesperado'}
  </p>
  <Button onclick={reset}>Intentar nuevamente</Button>
</div>
```

### Toast Notifications

Usar shadcn-svelte Sonner para notificaciones:

```typescript
import { toast } from 'svelte-sonner';

// Success
toast.success('Liquidación creada exitosamente');

// Error
toast.error('Error al crear liquidación');

// Loading
const toastId = toast.loading('Creando liquidación...');
// Later
toast.success('Liquidación creada', { id: toastId });
```

## Testing Strategy

### Unit Tests

- **Stores**: Probar lógica de auth, sidebar, notifications
- **Utils**: Formatters, validators, helpers
- **Components**: Componentes puros sin dependencias externas

### Integration Tests

- **API Queries**: Mock de openapi-fetch para probar queries
- **Forms**: Validación y envío de formularios
- **Navigation**: Flujos de navegación entre páginas

### E2E Tests (Playwright)

- **Login Flow**: Login exitoso y fallido
- **Liquidation Creation**: Crear liquidación completa con servicios
- **Payment Registration**: Agregar pagos y verificar cálculos
- **Notifications**: Recibir y marcar notificaciones

### Test Files Structure

```
tests/
├── unit/
│   ├── stores/
│   │   ├── auth.test.ts
│   │   └── notifications.test.ts
│   └── utils/
│       ├── formatters.test.ts
│       └── validators.test.ts
├── integration/
│   ├── queries/
│   │   └── liquidations.test.ts
│   └── components/
│       └── LiquidationForm.test.ts
└── e2e/
    ├── auth.test.ts
    ├── liquidations.test.ts
    └── notifications.test.ts
```

## Performance Considerations

### Optimizations

1. **Code Splitting**: Lazy load rutas con dynamic imports
2. **Query Caching**: TanStack Query cache con staleTime apropiado
3. **Pagination**: Todas las listas con paginación server-side
4. **Debouncing**: Búsquedas con debounce de 300ms
5. **Virtual Scrolling**: Para listas muy largas (si es necesario)
6. **Image Optimization**: Usar `@sveltejs/enhanced-img` si hay imágenes

### Bundle Size

- Tree-shaking automático con Vite
- Componentes shadcn solo los necesarios
- Lucide icons con tree-shaking

## Security Considerations

### Authentication

- Token JWT en localStorage (considerar httpOnly cookies en producción)
- Refresh token strategy (si el backend lo soporta)
- Auto-logout en 401 responses

### Authorization

- Guards en `+layout.ts` para rutas protegidas
- Verificación de roles para acciones sensibles (ej: crear staff)
- Ocultar UI elements según permisos

### Data Validation

- Validación client-side con Zod o similar
- Sanitización de inputs
- CSRF protection (SvelteKit lo maneja)

### API Security

- HTTPS en producción
- CORS configurado correctamente
- Rate limiting (backend)

## Accessibility

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**: Todos los elementos interactivos accesibles por teclado
- **Screen Readers**: ARIA labels y roles apropiados
- **Color Contrast**: Mínimo 4.5:1 para texto normal
- **Focus Indicators**: Visible en todos los elementos interactivos
- **Form Labels**: Todos los inputs con labels asociados
- **Error Messages**: Anunciados a screen readers

### shadcn-svelte Benefits

Los componentes de shadcn-svelte ya incluyen:
- ARIA attributes
- Keyboard navigation
- Focus management
- Screen reader support

## Dependencies

### Required npm Packages

```json
{
  "dependencies": {
    "@tanstack/svelte-query": "^6.0.3",
    "@tanstack/svelte-query-devtools": "^6.0.0",
    "@tanstack/svelte-table": "^8.20.5",
    "openapi-fetch": "^0.15.0"
  },
  "devDependencies": {
    "@sveltejs/kit": "^2.43.2",
    "svelte": "^5.39.5",
    "tailwindcss": "^4.1.13",
    "@tailwindcss/vite": "^4.1.13",
    "typescript": "^5.9.2",
    "vite": "^7.1.7"
  }
}
```

### shadcn-svelte Components to Install

```bash
# Core components
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add separator
pnpm dlx shadcn@latest add label
pnpm dlx shadcn@latest add textarea
pnpm dlx shadcn@latest add checkbox
pnpm dlx shadcn@latest add radio-group
pnpm dlx shadcn@latest add switch
pnpm dlx shadcn@latest add tabs
pnpm dlx shadcn@latest add tooltip
pnpm dlx shadcn@latest add sonner

# DataTable (includes TanStack Table integration)
pnpm dlx shadcn@latest add data-table
```

### jsrepo Components to Install

```bash
# Sidebar and breadcrumbs from @ieedan/shadcn-svelte-extras
pnpm dlx jsrepo add sidebar
pnpm dlx jsrepo add breadcrumb
```

## Deployment

### Build Process

```bash
pnpm build
```

Genera:
- Static assets en `build/`
- SSR ready con adapter-auto

### Environment Variables

```env
PUBLIC_API_URL=https://api.example.com/ptc/api
PUBLIC_SSE_URL=https://api.example.com/ptc/api/notifications
```

### Hosting Options

- **Vercel**: Zero-config deployment
- **Netlify**: Con adapter-netlify
- **Node.js**: Con adapter-node
- **Static**: Con adapter-static (si no se usa SSR)

## Future Enhancements

1. **Offline Support**: Service Worker con cache strategies
2. **Real-time Collaboration**: WebSockets para edición simultánea
3. **Advanced Reporting**: Gráficos y exportación a PDF/Excel
4. **Mobile App**: Capacitor o Tauri wrapper
5. **Internationalization**: i18n para múltiples idiomas
6. **Dark Mode**: Theme switcher
7. **Advanced Search**: Full-text search con filtros complejos
8. **Audit Log**: Historial de cambios en liquidaciones
