/**
 * Format currency values for PEN (Peruvian Sol) or USD
 */
export function formatCurrency(amount: number, currency: 'PEN' | 'USD' = 'PEN'): string {
	return new Intl.NumberFormat('es-PE', {
		style: 'currency',
		currency: currency
	}).format(amount);
}

/**
 * Format date values using Peruvian locale (es-PE)
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
	const dateObj = typeof date === 'string' ? new Date(date) : date;

	const defaultOptions: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		...options
	};

	return new Intl.DateTimeFormat('es-PE', defaultOptions).format(dateObj);
}

/**
 * Format date to short format (DD/MM/YYYY)
 */
export function formatDateShort(date: string | Date): string {
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	return new Intl.DateTimeFormat('es-PE', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(dateObj);
}

/**
 * Format date and time
 */
export function formatDateTime(date: string | Date): string {
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	return new Intl.DateTimeFormat('es-PE', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}).format(dateObj);
}
