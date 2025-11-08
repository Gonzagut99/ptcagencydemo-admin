import { QueryClient } from '@tanstack/svelte-query';
import { browser } from '$app/environment';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			enabled: browser,
			staleTime: 1000 * 60 * 5, // 5 minutes
			retry: 1,
			refetchOnWindowFocus: false
		}
	}
});
