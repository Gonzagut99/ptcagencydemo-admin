import { superValidate } from 'sveltekit-superforms';
import { zod, zod4 } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { customerSchema } from './schema';

export const load: PageServerLoad = async () => {

	return {
		// @ts-expect-error - sveltekit-superforms type compatibility issue
		form: await superValidate(zod4(customerSchema))
	};
};

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		// @ts-expect-error - sveltekit-superforms type compatibility issue
		const form = await superValidate(request, zod(customerSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const response = await fetch('http://localhost:8090/ptc/api/clientes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form.data)
			});

			if (!response.ok) {
				const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
				return fail(response.status, {
					form,
					error: error.message || 'Error al crear el cliente'
				});
			}

			// Redirigir a la lista de clientes después de crear exitosamente
			throw redirect(303, '/clientes');
		} catch (error) {
			if (error instanceof Response) throw error; // Re-throw redirect

			console.error('Error creating customer:', error);
			return fail(500, {
				form,
				error: 'Error al conectar con el servidor'
			});
		}
	}
};
