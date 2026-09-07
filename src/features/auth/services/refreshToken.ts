import { fetcher } from '@/shared/api';
import { AuthResponse } from '../types';

export async function refreshTokenApi(refreshToken: string) {
  return fetcher<AuthResponse>('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}
