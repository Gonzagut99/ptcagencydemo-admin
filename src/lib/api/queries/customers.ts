import { createQuery, createMutation } from '@tanstack/svelte-query';
import { apiClient } from '../client';
import { queryClient } from '../queryClient';
import type { components } from '../api';

export const customersKeys = {
	all: ['customers'] as const,
	lists: () => [...customersKeys.all, 'list'] as const,
	list: (filters: Record<string, unknown>) => [...customersKeys.lists(), filters] as const,
	details: () => [...customersKeys.all, 'detail'] as const,
	detail: (id: number) => [...customersKeys.details(), id] as const
};

export function useCustomers(page: number = 0, size: number = 10) {
	return createQuery(() => ({
		queryKey: customersKeys.list({ page, size }),
		queryFn: async () => {
			const { data, error } = await apiClient.GET('/clientes/paginados', {
				params: {
					query: { requestDto: { page, size } }
				}
			});
			if (error) throw error;
			return data;
		}
	}));
}

export function useCustomer(id: number) {
	return createQuery(() => ({
		queryKey: customersKeys.detail(id),
		queryFn: async () => {
			// Note: There's no endpoint for getting a single customer by ID
			// We'll need to fetch from the paginated list or add the endpoint to the backend
			const { data, error } = await apiClient.GET('/clientes/paginados', {
				params: {
					query: { requestDto: { page: 0, size: 100 } }
				}
			});
			if (error) throw error;
			
			// Find the customer in the list
			const customer = data?.content?.find((c) => c.id === id);
			if (!customer) throw new Error('Customer not found');
			
			return customer;
		},
		enabled: id > 0
	}));
}

export function useCreateCustomer() {
	return createMutation(() => ({
		mutationFn: async (dto: components['schemas']['CreateCustomerDto']) => {
			const { data, error } = await apiClient.POST('/clientes', {
				body: dto
			});
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: customersKeys.lists() });
		}
	}));
}
