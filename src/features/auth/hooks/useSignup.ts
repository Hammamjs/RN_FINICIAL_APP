import { useAsync } from '../../../shared/hooks/useAsync';
import { signupApi } from '../api/auth.api';
import { TSignUpValidation } from '../schema/signUp.validation';
import { useAuthStore } from '../store';

export function useSignup() {
  const login = useAuthStore((state) => state.login);

  return useAsync({
    asyncFunction: async (data: TSignUpValidation) => {
      const result = await signupApi(data);
      await login(result);
    },
  });
}
