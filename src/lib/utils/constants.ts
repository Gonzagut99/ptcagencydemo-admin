import type { components } from '$lib/api/api';

/**
 * Extract types from API schema
 */
export type LiquidationStatusType = NonNullable<components['schemas']['DLiquidation']['status']>;
export type PaymentStatusType = NonNullable<components['schemas']['DLiquidation']['paymentStatus']>;
export type ServiceStatusType = NonNullable<components['schemas']['DTour']['status']>;
export type IncidencyStatusType = NonNullable<components['schemas']['DIncidency']['incidencyStatus']>;
export type CurrencyType = NonNullable<components['schemas']['DLiquidation']['currencyRate']> extends number ? NonNullable<components['schemas']['DStaff']['currency']> : never;
export type StaffRoleType = NonNullable<components['schemas']['DStaff']['role']>;
export type PaymentMethodType = NonNullable<components['schemas']['DPayment']['method']>;
export type PaymentValidationStatusType = NonNullable<components['schemas']['DPayment']['validationStatus']>;
export type IdDocumentTypeType = NonNullable<components['schemas']['DCustomer']['idDocumentType']>;

/**
 * Liquidation status enum
 */
export const LiquidationStatus = {
	IN_QUOTE: 'IN_QUOTE',
	PENDING: 'PENDING',
	ON_COURSE: 'ON_COURSE',
	COMPLETED: 'COMPLETED'
} as const satisfies Record<string, LiquidationStatusType>;

/**
 * Payment status enum
 */
export const PaymentStatus = {
	PENDING: 'PENDING',
	ON_COURSE: 'ON_COURSE',
	COMPLETED: 'COMPLETED'
} as const satisfies Record<string, PaymentStatusType>;

/**
 * Service status enum
 */
export const ServiceStatus = {
	PENDING: 'PENDING',
	COMPLETED: 'COMPLETED',
	CANCELED: 'CANCELED'
} as const satisfies Record<string, ServiceStatusType>;

/**
 * Incidency status enum
 */
export const IncidencyStatus = {
	PENDING: 'PENDING',
	APPROVED: 'APPROVED',
	REJECTED: 'REJECTED'
} as const satisfies Record<string, IncidencyStatusType>;

/**
 * Currency enum
 */
export const Currency = {
	PEN: 'PEN',
	USD: 'USD'
} as const satisfies Record<string, CurrencyType>;

/**
 * Staff role enum
 */
export const StaffRole = {
	SALES: 'SALES',
	COUNTER: 'COUNTER',
	ACCOUNTING: 'ACCOUNTING',
	OPERATIONS: 'OPERATIONS',
	SUPERADMIN: 'SUPERADMIN',
	SUPPORT: 'SUPPORT'
} as const satisfies Record<string, StaffRoleType>;

/**
 * Payment method enum
 */
export const PaymentMethod = {
	DEBIT: 'DEBIT',
	CREDIT: 'CREDIT',
	YAPE: 'YAPE',
	OTHER: 'OTHER'
} as const satisfies Record<string, PaymentMethodType>;

/**
 * Payment validation status enum
 */
export const PaymentValidationStatus = {
	PENDING: 'PENDING',
	VALID: 'VALID',
	INVALID: 'INVALID'
} as const satisfies Record<string, PaymentValidationStatusType>;

/**
 * ID Document type enum
 */
export const IdDocumentType = {
	PASSPORT: 'PASSPORT',
	DNI: 'DNI',
	DRIVER_LICENSE: 'DRIVER_LICENSE',
	RUC: 'RUC',
	CE: 'CE'
} as const satisfies Record<string, IdDocumentTypeType>;

/**
 * Nationality options (common ones for Peru)
 */
export const Nationalities = [
	'Peruana',
	'Argentina',
	'Boliviana',
	'Brasileña',
	'Chilena',
	'Colombiana',
	'Ecuatoriana',
	'Estadounidense',
	'Mexicana',
	'Venezolana',
	'Otra'
] as const;

/**
 * Status labels in Spanish
 */
export const StatusLabels = {
	// Liquidation Status
	IN_QUOTE: 'En Cotización',
	PENDING: 'Pendiente',
	ON_COURSE: 'En Curso',
	COMPLETED: 'Completado',
	// Service Status
	CANCELED: 'Cancelado',
	// Incidency Status
	APPROVED: 'Aprobado',
	REJECTED: 'Rechazado',
	// Payment Validation Status
	VALID: 'Válido',
	INVALID: 'Inválido'
} as const;

/**
 * Payment method labels in Spanish
 */
export const PaymentMethodLabels = {
	DEBIT: 'Débito',
	CREDIT: 'Crédito',
	YAPE: 'Yape',
	OTHER: 'Otro'
} as const;

/**
 * Staff role labels in Spanish
 */
export const StaffRoleLabels = {
	SALES: 'Ventas',
	COUNTER: 'Counter',
	ACCOUNTING: 'Contabilidad',
	OPERATIONS: 'Operaciones',
	SUPERADMIN: 'Super Admin',
	SUPPORT: 'Soporte'
} as const;

/**
 * Document type labels in Spanish
 */
export const DocumentTypeLabels = {
	PASSPORT: 'Pasaporte',
	DNI: 'DNI',
	DRIVER_LICENSE: 'Licencia de Conducir',
	RUC: 'RUC',
	CE: 'Carnet de Extranjería'
} as const;
