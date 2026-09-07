import { catchError } from '@/shared/lib/catchError';
import { useAuthStore } from '../store';
import { refreshAccessToken } from './authSession';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) throw new Error('API url not loaded');

export async function authenticatedFetcher<T>(
  endpoint: string,
  options: RequestInit = {},
) {
  const request = (accessToken?: string): Promise<Response> =>
    fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'Application/json',
        ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
      },
    });

  const accessToken = useAuthStore.getState().auth?.accessToken;

  let response = await request(accessToken);

  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) throw new Error('Session expired');

    response = await request(newAccessToken);
  }

  if (!response.ok) {
    await catchError(response);
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
