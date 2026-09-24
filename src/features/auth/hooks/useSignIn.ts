import { useAsync } from '../../../shared/hooks/useAsync';
import { signInApi } from '../api/auth.api';
import { TSignInValidation } from '../schema/signIn.validation';
import { useAuthStore } from '../store/authStore';

export function useSignIn() {
  const login = useAuthStore((state) => state.login);

  return useAsync({
    asyncFunction: async (data: TSignInValidation) => {
      const result = await signInApi(data);
      await login(result);
    },
  });
}
