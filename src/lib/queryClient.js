import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // 5 minutes — data fresh
      gcTime: 10 * 60 * 1000,          // 10 minutes — keep in cache
      retry: (failureCount, error) => {
        // Retry on 429 (rate limit) up to 3 times
        if (error?.status === 429) return failureCount < 3;
        // Don't retry on 404
        if (error?.status === 404) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});
