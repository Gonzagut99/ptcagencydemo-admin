# Requirements Document

## Introduction

Este documento define los requisitos para un panel de administración completo para la gestión de liquidaciones de paquetes turísticos. El sistema permitirá a los usuarios del staff gestionar clientes, crear y administrar liquidaciones con múltiples servicios (tours, hoteles, vuelos, servicios adicionales), procesar pagos, manejar incidencias y recibir notificaciones en tiempo real. El panel incluirá autenticación, navegación mediante sidebar colapsable y breadcrumbs, y consumirá una API REST existente.

## Glossary

- **Admin Panel**: Sistema de interfaz web para la gestión administrativa de liquidaciones turísticas
- **Liquidación**: Documento financiero que agrupa todos los servicios y pagos de un paquete turístico
- **Staff**: Personal de la agencia con diferentes roles (SALES, COUNTER, ACCOUNTING, OPERATIONS, SUPERADMIN, SUPPORT)
- **Cliente**: Persona que contrata servicios turísticos
- **Servicio**: Componente de un paquete turístico (tour, hotel, vuelo, adicional)
- **Incidencia**: Evento o problema que afecta una liquidación y puede tener un costo asociado
- **SSE**: Server-Sent Events, tecnología para notificaciones en tiempo real
- **Breadcrumb**: Componente de navegación que muestra la ruta actual del usuario
- **Sidebar**: Panel lateral de navegación que puede colapsarse horizontalmente

## Requirements

### Requirement 1: Autenticación y Gestión de Sesión

**User Story:** Como usuario del staff, quiero iniciar sesión con mis credenciales para acceder al panel de administración de forma segura.

#### Acceptance Criteria

1. WHEN el usuario ingresa credenciales válidas en el formulario de login, THE Admin Panel SHALL autenticar al usuario y redirigirlo al dashboard principal
2. WHEN el usuario ingresa credenciales inválidas, THE Admin Panel SHALL mostrar un mensaje de error específico sin revelar información sensible
3. WHEN el usuario no está autenticado e intenta acceder a una ruta protegida, THE Admin Panel SHALL redirigirlo a la página de login
4. WHEN el usuario cierra sesión, THE Admin Panel SHALL limpiar los datos de sesión y redirigirlo al login
5. WHILE el usuario tiene una sesión activa, THE Admin Panel SHALL mantener el estado de autenticación durante la navegación

### Requirement 2: Navegación y Layout Principal

**User Story:** Como usuario del staff, quiero navegar fácilmente por las diferentes secciones del sistema usando un sidebar colapsable y breadcrumbs para mantener contexto de mi ubicación.

#### Acceptance Criteria

1. THE Admin Panel SHALL mostrar un sidebar con enlaces a todas las secciones principales (Dashboard, Liquidaciones, Clientes, Staff, Notificaciones)
2. WHEN el usuario hace clic en el botón de colapsar, THE Admin Panel SHALL ocultar el sidebar horizontalmente manteniendo solo los iconos visibles
3. WHEN el usuario navega a una nueva sección, THE Admin Panel SHALL actualizar los breadcrumbs mostrando la ruta completa desde el inicio
4. WHEN el usuario hace clic en un elemento del breadcrumb, THE Admin Panel SHALL navegar a esa sección específica
5. WHILE el sidebar está colapsado, THE Admin Panel SHALL mostrar tooltips al hacer hover sobre los iconos

### Requirement 3: Dashboard y Visualización de Métricas

**User Story:** Como usuario del staff, quiero ver un dashboard con métricas clave y resúmenes para tener una visión general del estado del negocio.

#### Acceptance Criteria

1. THE Admin Panel SHALL mostrar tarjetas con métricas principales (liquidaciones activas, pagos pendientes, ingresos del mes, clientes activos)
2. THE Admin Panel SHALL mostrar una lista de liquidaciones recientes con su estado y monto
3. THE Admin Panel SHALL mostrar liquidaciones próximas a vencer en los próximos 7 días
4. WHEN el usuario hace clic en una liquidación del dashboard, THE Admin Panel SHALL navegar al detalle de esa liquidación
5. THE Admin Panel SHALL actualizar las métricas cada vez que se carga el dashboard

### Requirement 4: Gestión de Clientes

**User Story:** Como usuario del staff, quiero crear, visualizar y buscar clientes para mantener una base de datos actualizada de mis contactos.

#### Acceptance Criteria

1. THE Admin Panel SHALL mostrar una tabla paginada de clientes con búsqueda y filtros
2. WHEN el usuario hace clic en "Nuevo Cliente", THE Admin Panel SHALL mostrar un formulario modal con todos los campos requeridos (nombre, apellido, email, teléfono, fecha de nacimiento, tipo de documento, número de documento, dirección, nacionalidad)
3. WHEN el usuario envía el formulario de cliente con datos válidos, THE Admin Panel SHALL crear el cliente mediante la API y actualizar la lista
4. WHEN el usuario hace clic en un cliente de la tabla, THE Admin Panel SHALL mostrar el detalle del cliente con sus liquidaciones asociadas
5. THE Admin Panel SHALL validar el formato de email, fecha de nacimiento y número de documento antes de enviar

### Requirement 5: Gestión de Staff

**User Story:** Como usuario con rol SUPERADMIN, quiero gestionar el personal de la agencia para controlar accesos y asignaciones.

#### Acceptance Criteria

1. WHERE el usuario tiene rol SUPERADMIN, THE Admin Panel SHALL mostrar la sección de gestión de staff
2. THE Admin Panel SHALL mostrar una tabla paginada de staff con información de usuario, rol, salario y fecha de contratación
3. WHEN el usuario hace clic en "Nuevo Staff", THE Admin Panel SHALL mostrar un formulario para crear usuario y staff simultáneamente
4. THE Admin Panel SHALL permitir filtrar staff por rol (SALES, COUNTER, ACCOUNTING, OPERATIONS, SUPERADMIN, SUPPORT)
5. WHEN el usuario crea un nuevo staff, THE Admin Panel SHALL validar que el email sea único y el salario sea mayor a cero

### Requirement 6: Creación de Liquidaciones

**User Story:** Como usuario del staff con rol SALES u OPERATIONS, quiero crear nuevas liquidaciones para iniciar el proceso de cotización de paquetes turísticos.

#### Acceptance Criteria

1. WHEN el usuario hace clic en "Nueva Liquidación", THE Admin Panel SHALL mostrar un formulario con campos para cliente, staff asignado, tasa de cambio, fecha límite de pago y número de acompañantes
2. THE Admin Panel SHALL permitir seleccionar un cliente existente mediante un selector con búsqueda
3. THE Admin Panel SHALL permitir seleccionar el staff asignado de una lista filtrada por roles apropiados
4. WHEN el usuario envía el formulario con datos válidos, THE Admin Panel SHALL crear la liquidación con estado IN_QUOTE
5. WHEN la liquidación se crea exitosamente, THE Admin Panel SHALL redirigir al detalle de la liquidación para agregar servicios

### Requirement 7: Gestión de Servicios en Liquidaciones

**User Story:** Como usuario del staff, quiero agregar diferentes tipos de servicios (tours, hoteles, vuelos, adicionales) a una liquidación para construir el paquete turístico completo.

#### Acceptance Criteria

1. WHEN el usuario está en el detalle de una liquidación, THE Admin Panel SHALL mostrar secciones para cada tipo de servicio con botones para agregar
2. WHEN el usuario agrega un servicio de tour, THE Admin Panel SHALL solicitar tarifa, impuestos, moneda y lista de tours con fechas, título, precio y lugar
3. WHEN el usuario agrega un servicio de hotel, THE Admin Panel SHALL solicitar tarifa, impuestos, moneda y lista de reservas con check-in, check-out, hotel, habitación y precio por noche
4. WHEN el usuario agrega un servicio de vuelo, THE Admin Panel SHALL solicitar tarifa, impuestos, moneda y lista de reservas con origen, destino, fechas, aerolínea, códigos de reserva y precio total
5. WHEN el usuario agrega un servicio adicional, THE Admin Panel SHALL solicitar tarifa, impuestos, moneda, precio y estado
6. THE Admin Panel SHALL calcular automáticamente el monto total de la liquidación sumando todos los servicios
7. THE Admin Panel SHALL permitir editar el estado de cada servicio individual (PENDING, COMPLETED, CANCELED)

### Requirement 8: Gestión de Pagos

**User Story:** Como usuario del staff con rol COUNTER o ACCOUNTING, quiero registrar pagos en las liquidaciones para llevar control del estado financiero.

#### Acceptance Criteria

1. WHEN el usuario está en el detalle de una liquidación, THE Admin Panel SHALL mostrar una sección de pagos con el total pagado y monto restante
2. WHEN el usuario hace clic en "Agregar Pago", THE Admin Panel SHALL mostrar un formulario con método de pago (DEBIT, CREDIT, YAPE, OTHER) y monto
3. WHEN el usuario registra un pago, THE Admin Panel SHALL actualizar el monto total pagado y el monto restante
4. THE Admin Panel SHALL mostrar el estado de validación de cada pago (PENDING, VALID, INVALID)
5. THE Admin Panel SHALL actualizar automáticamente el payment_status de la liquidación (PENDING, ON_COURSE, COMPLETED) según los pagos registrados

### Requirement 9: Gestión de Incidencias

**User Story:** Como usuario del staff, quiero registrar incidencias en las liquidaciones para documentar problemas y costos adicionales.

#### Acceptance Criteria

1. WHEN el usuario está en el detalle de una liquidación, THE Admin Panel SHALL mostrar una sección de incidencias
2. WHEN el usuario hace clic en "Agregar Incidencia", THE Admin Panel SHALL mostrar un formulario con razón, monto opcional y fecha de incidencia
3. THE Admin Panel SHALL mostrar el estado de cada incidencia (PENDING, APPROVED, REJECTED)
4. WHEN una incidencia es aprobada con monto, THE Admin Panel SHALL reflejar el costo adicional en el total de la liquidación
5. THE Admin Panel SHALL permitir filtrar incidencias por estado

### Requirement 10: Listado y Filtrado de Liquidaciones

**User Story:** Como usuario del staff, quiero ver y filtrar todas las liquidaciones para encontrar rápidamente la información que necesito.

#### Acceptance Criteria

1. THE Admin Panel SHALL mostrar una tabla paginada de liquidaciones con columnas para ID, cliente, staff asignado, monto total, estado, estado de pago y fecha límite
2. THE Admin Panel SHALL permitir filtrar liquidaciones por estado (IN_QUOTE, PENDING, ON_COURSE, COMPLETED)
3. THE Admin Panel SHALL permitir filtrar liquidaciones por estado de pago (PENDING, ON_COURSE, COMPLETED)
4. THE Admin Panel SHALL permitir buscar liquidaciones por nombre de cliente
5. THE Admin Panel SHALL resaltar liquidaciones vencidas con un indicador visual
6. WHEN el usuario hace clic en una liquidación, THE Admin Panel SHALL navegar al detalle completo

### Requirement 11: Detalle de Liquidación

**User Story:** Como usuario del staff, quiero ver todos los detalles de una liquidación en una sola vista para tener información completa del paquete turístico.

#### Acceptance Criteria

1. THE Admin Panel SHALL mostrar información del cliente y staff asignado en la cabecera
2. THE Admin Panel SHALL mostrar todos los servicios agrupados por tipo (tours, hoteles, vuelos, adicionales)
3. THE Admin Panel SHALL mostrar todos los pagos registrados con su método y estado de validación
4. THE Admin Panel SHALL mostrar todas las incidencias con su estado de aprobación
5. THE Admin Panel SHALL mostrar un resumen financiero con monto total, total pagado, monto restante y estado de pago
6. THE Admin Panel SHALL permitir cambiar el estado de la liquidación (IN_QUOTE, PENDING, ON_COURSE, COMPLETED)
7. THE Admin Panel SHALL mostrar la tasa de cambio utilizada y el número de acompañantes

### Requirement 12: Sistema de Notificaciones

**User Story:** Como usuario del staff, quiero recibir notificaciones en tiempo real sobre eventos importantes para mantenerme informado.

#### Acceptance Criteria

1. THE Admin Panel SHALL establecer una conexión SSE al iniciar sesión para recibir notificaciones en tiempo real
2. WHEN llega una nueva notificación, THE Admin Panel SHALL mostrar un indicador visual en el icono de notificaciones
3. WHEN el usuario hace clic en el icono de notificaciones, THE Admin Panel SHALL mostrar un panel con las notificaciones recientes
4. THE Admin Panel SHALL mostrar notificaciones no leídas con un estilo visual diferenciado
5. WHEN el usuario hace clic en una notificación, THE Admin Panel SHALL marcarla como leída mediante la API
6. THE Admin Panel SHALL mostrar un contador de notificaciones no leídas en el icono
7. THE Admin Panel SHALL permitir ver el historial completo de notificaciones en una página dedicada

### Requirement 13: Diseño Responsivo y Accesibilidad

**User Story:** Como usuario del staff, quiero usar el sistema desde diferentes dispositivos y que sea accesible para todos.

#### Acceptance Criteria

1. THE Admin Panel SHALL adaptar el layout para pantallas móviles, tablets y desktop
2. WHEN el usuario accede desde móvil, THE Admin Panel SHALL mostrar el sidebar como menú hamburguesa
3. THE Admin Panel SHALL cumplir con estándares WCAG 2.1 nivel AA de accesibilidad
4. THE Admin Panel SHALL permitir navegación completa mediante teclado
5. THE Admin Panel SHALL usar etiquetas ARIA apropiadas en todos los componentes interactivos

### Requirement 14: Manejo de Errores y Estados de Carga

**User Story:** Como usuario del staff, quiero recibir retroalimentación clara sobre el estado de las operaciones para entender qué está sucediendo.

#### Acceptance Criteria

1. WHEN una operación está en progreso, THE Admin Panel SHALL mostrar un indicador de carga apropiado
2. WHEN una operación falla, THE Admin Panel SHALL mostrar un mensaje de error descriptivo sin información técnica sensible
3. WHEN una operación es exitosa, THE Admin Panel SHALL mostrar un mensaje de confirmación breve
4. THE Admin Panel SHALL manejar errores de red mostrando un mensaje de conexión perdida
5. WHEN la API retorna un error 401, THE Admin Panel SHALL cerrar la sesión y redirigir al login

### Requirement 15: Validación de Formularios

**User Story:** Como usuario del staff, quiero que los formularios validen mis datos antes de enviarlos para evitar errores.

#### Acceptance Criteria

1. THE Admin Panel SHALL validar campos requeridos antes de permitir el envío de formularios
2. THE Admin Panel SHALL validar formatos de email, fechas y números según el tipo de campo
3. WHEN un campo tiene un error de validación, THE Admin Panel SHALL mostrar el mensaje de error debajo del campo
4. THE Admin Panel SHALL deshabilitar el botón de envío mientras haya errores de validación
5. THE Admin Panel SHALL validar rangos numéricos (montos positivos, fechas futuras donde aplique)
