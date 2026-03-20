// Admin Users Hook - Simple and Clean

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/admin/api';
import type { PaginationParams } from '@/lib/admin/types';

export function useUsers(params?: PaginationParams) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const result = await adminApi.getUsers(params);
      return result.data || { users: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    },
    staleTime: 30000,
    retry: 1,
  });
}
