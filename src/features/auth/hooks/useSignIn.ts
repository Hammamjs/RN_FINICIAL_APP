import { useState } from 'react';
import { signInApi } from '../api/auth.api';
import { TSignInValidation } from '../schema/signIn.validation';
import { useAuthStore } from '../store/authStore';

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useAuthStore((state) => state.login);

  const signin = async (data: TSignInValidation) => {
    try {
      setIsLoading(true);
      const result = await signInApi(data);
      await login(result);
    } catch (e) {
      console.error(e);
      const message = e instanceof Error ? e.message : 'Failed to sign in';
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signin,
    isLoading,
    error,
  };
}
