import { z } from 'zod';

export const customerSchema = z.object({
	firstName: z.string().min(1, 'El nombre es requerido'),
	lastName: z.string().min(1, 'El apellido es requerido'),
	email: z.string().min(1, 'El email es requerido').email('El email no es válido'),
	phoneNumber: z.string().optional(),
	birthDate: z.string().min(1, 'La fecha de nacimiento es requerida'),
	idDocumentType: z.enum(['DNI', 'PASSPORT', 'DRIVER_LICENSE', 'RUC', 'CE']),
	idDocumentNumber: z.string().min(1, 'El número de documento es requerido'),
	address: z.string().optional(),
	nationality: z.string().min(1, 'La nacionalidad es requerida')
});

export type CustomerSchema = typeof customerSchema;
