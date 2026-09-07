import { updatePasswordApi } from '@/features/auth/api';
import { useState } from 'react';
import { TUpdatePasswordSchema } from '../../users/schema/updatePassword.validation';
import { useAuthStore } from '../store';

export function useUpdatePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const accessToken = useAuthStore((state) => state.auth?.accessToken);

  const updatePassword = async (data: TUpdatePasswordSchema) => {
    if (!accessToken) {
      const error = new Error('Token not provided');
      setError(error.message);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const message = await updatePasswordApi(data, accessToken);
      setSuccessMsg(message.message);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Failed to update password';

      setError(message);
      console.log(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, updatePassword, successMsg };
}
