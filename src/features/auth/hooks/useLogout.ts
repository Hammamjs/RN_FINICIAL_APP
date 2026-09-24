import { logoutApi } from '@/features/auth/api';
import { useAuthStore } from '@/features/auth/store';
import { useAsync } from '../../../shared/hooks/useAsync';

export function useLogout() {
  const logoutStore = useAuthStore((state) => state.logout);

  return useAsync({
    asyncFunction: async () => {
      try {
        await logoutApi();
      } finally {
        await logoutStore();
      }
    },
  });
}
