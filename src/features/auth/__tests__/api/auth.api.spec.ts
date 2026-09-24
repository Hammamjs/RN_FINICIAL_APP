import { fetcher } from '@/shared/api';
import {
 logoutApi,
 signInApi,
 signInWithGoogleApi,
 signupApi,
 updatePasswordApi,
} from '../../api/auth.api';
import { authenticatedFetcher } from '../../services';

jest.mock('@/shared/api');
jest.mock('../../services/authenticatedFetcher');

const mockFetcher = fetcher as jest.MockedFunction<typeof fetcher>;
const mockAuthenticatedFetcher = authenticatedFetcher as jest.MockedFunction<
  typeof authenticatedFetcher
>;

describe('auth apis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login api', () => {
    it('should login if valid data provided', async () => {
      mockFetcher.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: 'user-id',
          email: 'test@t.com',
        },
      });

      const result = await signInApi({
        email: 'test@t.com',
        password: 'pass12345',
      });

      expect(mockFetcher).toHaveBeenCalledWith(
        '/api/auth/sign-in',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'test@t.com',
            password: 'pass12345',
          }),
        }),
      );

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: 'user-id',
          email: 'test@t.com',
        },
      });
    });

    it('should throw error if login fails', async () => {
      const error = new Error('Incorrect email or password');

      mockFetcher.mockRejectedValue(error);

      await expect(
        signInApi({ email: 'test@t.com', password: 'pass1234' }),
      ).rejects.toThrow(error.message);
    });
  });

  describe('logout api', () => {
    it('should log user out', async () => {
      mockAuthenticatedFetcher.mockResolvedValue(undefined);

      await logoutApi();

      expect(mockAuthenticatedFetcher).toHaveBeenCalledWith(
        '/api/auth/log-out',
        expect.objectContaining({
          method: 'POST',
        }),
      );
    });
  });

  describe('update user password api', () => {
    it('should update user password', async () => {
      mockAuthenticatedFetcher.mockResolvedValue({
        message: 'Your password has been updated',
      });

      const data = {
        confirmPassword: 'test-1234',
        newPassword: 'test-1234',
        currentPassword: 'current-password',
      };

      const result = await updatePasswordApi(data);

      expect(mockAuthenticatedFetcher).toHaveBeenCalledWith(
        '/api/auth/update-password',
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        },
      );

      expect(result).toEqual({ message: 'Your password has been updated' });
    });

    it('should throw error when update password fail', async () => {
      const error = new Error('Current password is incorrect');
      mockAuthenticatedFetcher.mockRejectedValue(error);

      await expect(
        updatePasswordApi({
          newPassword: 'test-1234',
          confirmPassword: 'test-1234',
          currentPassword: 'current-pass',
        }),
      ).rejects.toThrow(error);
    });
  });

  describe('sign up api', () => {
    it('should create new user', async () => {
      const mockedData = {
        refreshToken: 'refresh-toke',
        accessToken: 'access-token',
        user: {
          id: 'user-id',
          email: 'test@t.com',
        },
      };

      mockFetcher.mockResolvedValue(mockedData);

      const data = {
        confirmPassword: 'pass',
        email: 'test@t.com',
        password: 'pass',
        username: 'test',
      };

      const result = await signupApi(data);

      expect(fetcher).toHaveBeenCalledWith(
        '/api/auth/sign-up',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(data),
        }),
      );

      expect(result).toEqual(mockedData);
    });

    it('should throw error when creating account failed', async () => {
      const error = new Error('Failed to create new user');

      mockFetcher.mockRejectedValue(error);

      await expect(
        signupApi({
          confirmPassword: 'pass',
          email: 'test@t.com',
          password: 'pass',
          username: 'test',
        }),
      ).rejects.toThrow(error);
    });
  });

  describe('sign-in/up with google api', () => {
    it('should create user or sign in when idToken is valid', async () => {
      mockFetcher.mockResolvedValue({
        refreshToken: 'refresh',
        accessToken: 'access',
        user: {
          id: 'user',
          email: 'test@t.com',
        },
      });

      const result = await signInWithGoogleApi('idToken');

      expect(mockFetcher).toHaveBeenCalledWith(
        '/api/auth/google/mobile',
        expect.objectContaining({
          method: 'POST',
        }),
      );

      expect(result).toEqual({
        refreshToken: 'refresh',
        accessToken: 'access',
        user: {
          id: 'user',
          email: 'test@t.com',
        },
      });
    });

    it('should throw error when user account does not created', async () => {
      const error = new Error('Failed to create user');
      mockFetcher.mockRejectedValue(error);

      await expect(signInWithGoogleApi('idToken')).rejects.toThrow(error);
    });
  });
});
