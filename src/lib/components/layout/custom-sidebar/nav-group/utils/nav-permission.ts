import type { NavigationItem } from "../../sidebar-types";


export const hasNavPermission = (
    item: NavigationItem,
    hasPermission: (resource: string, action: string) => boolean,
    hasRole: (role: string) => boolean,
): boolean => {
    // Si el item no tiene restricciones, mostrar siempre
    if (!item.permission && !item.roles) {
        return true;
    }

    // Verificar roles si están definidos
    if (item.roles && item.roles.length > 0) {
        const hasRequiredRole = item.roles.some((role: string) => hasRole(role));
        if (!hasRequiredRole) {
            return false;
        }
    }

    // Verificar permisos si están definidos
    if (item.permission) {
        const [resource, action] = item.permission.split(':');
        if (!hasPermission(resource, action)) {
            return false;
        }
    }

    return true;
};