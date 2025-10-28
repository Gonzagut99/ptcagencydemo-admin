import { StatusLabels, PaymentMethodLabels } from './constants';
import type {
	LiquidationStatusType,
	PaymentStatusType,
	ServiceStatusType,
	IncidencyStatusType,
	PaymentValidationStatusType
} from './constants';

/**
 * Badge variant type matching shadcn-svelte badge variants
 */
export type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'destructive';

/**
 * Get badge variant for liquidation status
 */
export function getLiquidationStatusVariant(status: LiquidationStatusType): BadgeVariant {
	switch (status) {
		case 'IN_QUOTE':
			return 'secondary';
		case 'PENDING':
			return 'warning';
		case 'ON_COURSE':
			return 'default';
		case 'COMPLETED':
			return 'success';
		default:
			return 'default';
	}
}

/**
 * Get badge variant for payment status
 */
export function getPaymentStatusVariant(status: PaymentStatusType): BadgeVariant {
	switch (status) {
		case 'PENDING':
			return 'destructive';
		case 'ON_COURSE':
			return 'warning';
		case 'COMPLETED':
			return 'success';
		default:
			return 'default';
	}
}

/**
 * Get badge variant for service status
 */
export function getServiceStatusVariant(status: ServiceStatusType): BadgeVariant {
	switch (status) {
		case 'PENDING':
			return 'warning';
		case 'COMPLETED':
			return 'success';
		case 'CANCELED':
			return 'destructive';
		default:
			return 'default';
	}
}

/**
 * Get badge variant for incidency status
 */
export function getIncidencyStatusVariant(status: IncidencyStatusType): BadgeVariant {
	switch (status) {
		case 'PENDING':
			return 'warning';
		case 'APPROVED':
			return 'success';
		case 'REJECTED':
			return 'destructive';
		default:
			return 'default';
	}
}

/**
 * Get badge variant for payment validation status
 */
export function getPaymentValidationStatusVariant(
	status: PaymentValidationStatusType
): BadgeVariant {
	switch (status) {
		case 'PENDING':
			return 'warning';
		case 'VALID':
			return 'success';
		case 'INVALID':
			return 'destructive';
		default:
			return 'default';
	}
}

/**
 * Get label for liquidation status
 */
export function getLiquidationStatusLabel(status: LiquidationStatusType): string {
	return StatusLabels[status] || status;
}

/**
 * Get label for payment status
 */
export function getPaymentStatusLabel(status: PaymentStatusType): string {
	return StatusLabels[status] || status;
}

/**
 * Get label for service status
 */
export function getServiceStatusLabel(status: ServiceStatusType): string {
	return StatusLabels[status] || status;
}

/**
 * Get label for incidency status
 */
export function getIncidencyStatusLabel(status: IncidencyStatusType): string {
	return StatusLabels[status] || status;
}

/**
 * Get label for payment validation status
 */
export function getPaymentValidationStatusLabel(status: PaymentValidationStatusType): string {
	return StatusLabels[status] || status;
}

/**
 * Get label for payment method
 */
export function getPaymentMethodLabel(method: keyof typeof PaymentMethodLabels): string {
	return PaymentMethodLabels[method] || method;
}

/**
 * Generic function to get status variant and label
 */
export function getStatusBadgeProps(
	status: string,
	type: 'liquidation' | 'payment' | 'service' | 'incidency' | 'validation'
): { variant: BadgeVariant; label: string } {
	switch (type) {
		case 'liquidation':
			return {
				variant: getLiquidationStatusVariant(status as LiquidationStatusType),
				label: getLiquidationStatusLabel(status as LiquidationStatusType)
			};
		case 'payment':
			return {
				variant: getPaymentStatusVariant(status as PaymentStatusType),
				label: getPaymentStatusLabel(status as PaymentStatusType)
			};
		case 'service':
			return {
				variant: getServiceStatusVariant(status as ServiceStatusType),
				label: getServiceStatusLabel(status as ServiceStatusType)
			};
		case 'incidency':
			return {
				variant: getIncidencyStatusVariant(status as IncidencyStatusType),
				label: getIncidencyStatusLabel(status as IncidencyStatusType)
			};
		case 'validation':
			return {
				variant: getPaymentValidationStatusVariant(status as PaymentValidationStatusType),
				label: getPaymentValidationStatusLabel(status as PaymentValidationStatusType)
			};
		default:
			return {
				variant: 'default',
				label: status
			};
	}
}
