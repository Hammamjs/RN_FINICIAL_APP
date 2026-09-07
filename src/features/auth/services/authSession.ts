import { tokenStorage } from '@/shared/lib/secureTokenStorage';
import { useAuthStore } from '../store';
import { refreshTokenApi } from './refreshToken';

let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = performPrefetch().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function performPrefetch(): Promise<string | null> {
  const refreshToken = await tokenStorage.getRefreshToken();

  if (!refreshToken) return null;

  try {
    const {
      refreshToken: newRefreshToken,
      accessToken,
      ...data
    } = await refreshTokenApi(refreshToken);

    console.log('Token refreshed');

    await tokenStorage.setRefreshToken(newRefreshToken);
    useAuthStore.setState({ auth: { ...data, accessToken } });
    return accessToken;
  } catch (e) {
    await tokenStorage.removeRefreshToken();
    useAuthStore.setState({ auth: null });
    return null;
  }
}
