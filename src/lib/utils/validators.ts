/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Validate date format and ensure it's a valid date
 */
export function isValidDate(dateString: string): boolean {
	const date = new Date(dateString);
	return !isNaN(date.getTime());
}

/**
 * Validate that a date is in the future
 */
export function isFutureDate(dateString: string): boolean {
	const date = new Date(dateString);
	const now = new Date();
	return date > now;
}

/**
 * Validate that a date is in the past
 */
export function isPastDate(dateString: string): boolean {
	const date = new Date(dateString);
	const now = new Date();
	return date < now;
}

/**
 * Validate DNI (Peruvian National ID) - 8 digits
 */
export function isValidDNI(dni: string): boolean {
	const dniRegex = /^\d{8}$/;
	return dniRegex.test(dni);
}

/**
 * Validate Passport - alphanumeric, 6-9 characters
 */
export function isValidPassport(passport: string): boolean {
	const passportRegex = /^[A-Z0-9]{6,9}$/i;
	return passportRegex.test(passport);
}

/**
 * Validate RUC (Peruvian Tax ID) - 11 digits
 */
export function isValidRUC(ruc: string): boolean {
	const rucRegex = /^\d{11}$/;
	return rucRegex.test(ruc);
}

/**
 * Validate CE (Carnet de Extranjería) - 9 digits
 */
export function isValidCE(ce: string): boolean {
	const ceRegex = /^\d{9}$/;
	return ceRegex.test(ce);
}

/**
 * Validate document number based on document type
 */
export function isValidDocumentNumber(
	documentNumber: string,
	documentType: 'DNI' | 'PASSPORT' | 'RUC' | 'CE' | 'DRIVER_LICENSE'
): boolean {
	switch (documentType) {
		case 'DNI':
			return isValidDNI(documentNumber);
		case 'PASSPORT':
			return isValidPassport(documentNumber);
		case 'RUC':
			return isValidRUC(documentNumber);
		case 'CE':
			return isValidCE(documentNumber);
		case 'DRIVER_LICENSE':
			// Driver's license can vary, so we'll accept alphanumeric 8-12 characters
			return /^[A-Z0-9]{8,12}$/i.test(documentNumber);
		default:
			return false;
	}
}

/**
 * Validate that a number is positive
 */
export function isPositiveNumber(value: number): boolean {
	return value > 0;
}

/**
 * Validate that a string is not empty
 */
export function isNotEmpty(value: string): boolean {
	return value.trim().length > 0;
}

/**
 * Validate phone number (Peruvian format) - 9 digits starting with 9
 */
export function isValidPhone(phone: string): boolean {
	const phoneRegex = /^9\d{8}$/;
	return phoneRegex.test(phone);
}
