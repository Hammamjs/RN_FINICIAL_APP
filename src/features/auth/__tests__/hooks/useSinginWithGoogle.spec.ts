import { act, renderHook } from '@testing-library/react-native';
import { signInWithGoogleApi } from '../../api/auth.api';
import { useSigninWithGoogle } from '../../hooks/useSigninWithGoogle';
import { signinWithGoogleService } from '../../services/googleService';
import { useAuthStore } from '../../store';
import { AuthResponse, Role } from '../../types';

jest.mock('../../api/auth.api');
jest.mock('../../services/googleService');
jest.mock('../../store/authStore');

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayService: jest.fn(),
    signIn: jest.fn(),
  },
}));

let mockSignInWithGoogleApi = signInWithGoogleApi as jest.MockedFunction<
  typeof signInWithGoogleApi
>;
let mockSignInWithGoogleService =
  signinWithGoogleService as jest.MockedFunction<
    typeof signinWithGoogleService
  >;
let mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

const mockAuthResponse = {
  refreshToken: 'refresh',
  accessToken: 'access',
  user: {
    id: 'id',
    email: 'test@t.com',
    username: 'test',
    role: 'user' as Role,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

describe('test signin with google useCases', () => {
  let mockLoginStore = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuthStore.mockImplementation((selector) =>
      selector({ login: mockLoginStore } as never),
    );
  });

  it('should sign up/in with valid credentials', async () => {
    mockSignInWithGoogleApi.mockResolvedValue(mockAuthResponse);
    mockSignInWithGoogleService.mockResolvedValue('valid-token');

    const { result } = await renderHook(() => useSigninWithGoogle());

    await act(() => result.current.execute({}));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    expect(mockLoginStore).toHaveBeenCalled();
    expect(mockSignInWithGoogleService).toHaveBeenCalled();

    expect(mockSignInWithGoogleApi).toHaveBeenCalledWith('valid-token');
  });

  it('should throw error with invalid credentials', async () => {
    const error = new Error('Process failed');
    mockSignInWithGoogleApi.mockRejectedValue(error);

    const { result } = await renderHook(() => useSigninWithGoogle());

    await act(async () => result.current.execute({}));

    expect(result.current.error).toBe(error.message);
    expect(result.current.isLoading).toBe(false);
    expect(mockLoginStore).not.toHaveBeenCalled();
  });

  it('should set isLoading to true while request is pending', async () => {
    let resolveSignin: (auth: AuthResponse) => void;

    mockSignInWithGoogleService.mockResolvedValue('valid-token');

    mockSignInWithGoogleApi.mockReturnValue(
      new Promise((resolve) => (resolveSignin = resolve)),
    );

    const { result } = await renderHook(() => useSigninWithGoogle());

    let signinPromise: Promise<void>;

    await act(async () => {
      signinPromise = result.current.execute({});
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();

    await act(async () => {
      resolveSignin({
        accessToken: 'access',
        refreshToken: 'refresh',
        user: {
          createdAt: new Date(),
          updatedAt: new Date(),
          email: 'test@t.com',
          id: 'user-id',
          role: 'user' as Role,
          username: 'test',
        },
      });
      await signinPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(mockSignInWithGoogleApi).toHaveBeenCalled();
  });

  it('should handle error when sign-in service fail', async () => {
    const error = new Error('Google sign-in failed');
    mockSignInWithGoogleService.mockRejectedValue(error);

    const { result } = await renderHook(() => useSigninWithGoogle());

    await act(async () => {
      await result.current.execute({});
    });

    expect(result.current.error).toBe(error.message);
    expect(result.current.isLoading).toBe(false);

    expect(mockSignInWithGoogleApi).not.toHaveBeenCalled();
    expect(mockLoginStore).not.toHaveBeenCalled();
  });
});
