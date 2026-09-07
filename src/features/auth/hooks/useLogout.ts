import { logoutApi } from '@/features/auth/api';
import { useAuthStore } from '@/features/auth/store';
import { useState } from 'react';

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logoutStore = useAuthStore((state) => state.logout);
  const accessToken = useAuthStore((state) => state.auth?.accessToken);

  const logout = async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (accessToken) await logoutApi(accessToken);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to logout';
      setError(message);
      console.log(e);
    } finally {
      await logoutStore();
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    logout,
  };
}
