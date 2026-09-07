import { useState } from 'react';
import { signupApi } from '../api/auth.api';
import { TSignUpValidation } from '../schema/signUp.validation';
import { useAuthStore } from '../store';

export function useSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);

  const signup = async (data: TSignUpValidation) => {
    try {
      setIsLoading(true);
      const result = await signupApi(data);
      await login(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to sign up';
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    signup,
  };
}
