import { useState } from 'react';
import { signInWithGoogleApi } from '../api/auth.api';
import { signinWithGoogleService } from '../services/googleService';
import { useAuthStore } from '../store';

export function useSigninWithGoogle() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = useAuthStore((state) => state.login);

  const signinWithGoogle = async () => {
    try {
      setIsLoading(true);
      const idToken = await signinWithGoogleService();
      const result = await signInWithGoogleApi(idToken);

      login(result);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Failed to sign in with google';
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    signinWithGoogle,
    error,
  };
}
