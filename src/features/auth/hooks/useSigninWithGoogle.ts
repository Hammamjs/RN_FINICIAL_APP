import { useAsync } from '../../../shared/hooks/useAsync';
import { signInWithGoogleApi } from '../api/auth.api';
import { signinWithGoogleService } from '../services/googleService';
import { useAuthStore } from '../store';

export function useSigninWithGoogle() {
  const login = useAuthStore((state) => state.login);

  return useAsync({
    asyncFunction: async () => {
      const idToken = await signinWithGoogleService();
      const result = await signInWithGoogleApi(idToken);

      login(result);
    },
  });
}
