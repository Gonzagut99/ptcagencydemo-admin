import createClient from 'openapi-fetch';
import type { paths } from './api';
import { authStore } from '$lib/stores/auth.svelte';

export const apiClient = createClient<paths>({
	baseUrl: 'http://localhost:8090/ptc/api',
	headers: {
		'Content-Type': 'application/json'
	}
});

// Request interceptor to inject auth token
apiClient.use({
	onRequest({ request }) {
		const token = authStore.token;
		if (token) {
			request.headers.set('Authorization', `Bearer ${token}`);
		}
		return request;
	},
	onResponse({ response }) {
		// Handle 401 errors by logging out
		if (response.status === 401) {
			authStore.logout();
		}
		return response;
	}
});
