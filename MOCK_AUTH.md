# Autenticación Mockeada

Este proyecto utiliza autenticación mockeada temporalmente mientras se desarrolla el backend.

## Usuarios de Prueba

Puedes usar cualquiera de estos usuarios para iniciar sesión:

### Super Admin
- **Email:** admin@ptc.com
- **Contraseña:** admin123
- **Rol:** SUPERADMIN

### Vendedor
- **Email:** ventas@ptc.com
- **Contraseña:** ventas123
- **Rol:** SALES

### Counter
- **Email:** counter@ptc.com
- **Contraseña:** counter123
- **Rol:** COUNTER

## Cómo Funciona

1. El login está implementado en `src/routes/login/+page.svelte`
2. Los usuarios mockeados están definidos directamente en el componente
3. Al iniciar sesión, se genera un token mock y se almacena en localStorage
4. El `authStore` maneja el estado de autenticación
5. El layout principal (`src/routes/+layout.svelte`) protege las rutas y redirige al login si no hay autenticación

## Integración con Backend Real

Cuando el backend esté listo:

1. Reemplaza la lógica de login en `src/routes/login/+page.svelte`
2. Usa el `apiClient` de `src/lib/api/client.ts` para hacer la petición real
3. El interceptor de `apiClient` ya está configurado para inyectar el token en las peticiones
4. El manejo de 401 ya está implementado para cerrar sesión automáticamente

### Ejemplo de integración futura:

```typescript
// En lugar de mockUsers, harás algo como:
const { data, error } = await apiClient.POST('/auth/login', {
  body: {
    email,
    password
  }
});

if (data) {
  authStore.login(data.user, data.token);
  goto('/');
}
```

## Persistencia

- El token y los datos del usuario se almacenan en localStorage
- Al recargar la página, el `authStore` se inicializa automáticamente
- El logout limpia localStorage y redirige al login
