import { tokenStorage } from '@/shared/lib/secureTokenStorage';
import { create } from 'zustand';
import { refreshTokenApi } from '../services/refreshToken';
import { User } from '../types/auth.types';

export type TAuthState = {
  user: User;
  accessToken: string;
} | null;

export type InitState = {
  auth: TAuthState;
  isHydrated: boolean;
  login: (data: TAuthState & { refreshToken: string }) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  setAccessToken: (accessToken: string) => void;
};

export const useAuthStore = create<InitState>((set, get) => ({
  auth: null,
  isHydrated: false,
  login: async ({ refreshToken, ...data }) => {
    await tokenStorage.setRefreshToken(refreshToken);
    set({ auth: data });
  },
  logout: async () => {
    set({ auth: null });
    await tokenStorage.removeRefreshToken();
  },

  hydrate: async () => {
    const refreshToken = await tokenStorage.getRefreshToken();

    if (!refreshToken) {
      set({ isHydrated: true });
      return;
    }

    try {
      const { refreshToken: token, ...data } =
        await refreshTokenApi(refreshToken);
      await tokenStorage.setRefreshToken(token);
      set({ auth: data });
    } catch (e) {
      console.error(e);
      await tokenStorage.removeRefreshToken();
      set({ auth: null });
    } finally {
      set({ isHydrated: true });
    }
  },

  setAccessToken: (accessToken) => {
    const current = get().auth;

    if (!current) return;
    set({ auth: { ...current, accessToken } });
  },
}));
