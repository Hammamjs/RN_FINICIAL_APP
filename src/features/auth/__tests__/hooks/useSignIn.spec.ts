import { act, renderHook } from '@testing-library/react-native';
import { signInApi } from '../../api/auth.api';
import { useSignIn } from '../../hooks/useSignIn';
import { useAuthStore } from '../../store';
import { AuthResponse, Role } from '../../types';

jest.mock('../../api/auth.api');

jest.mock('../../store/authStore');

let mockSignInApi = signInApi as jest.MockedFunction<typeof signInApi>;
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

describe('mock useSignIn', () => {
  let mockLoginStore = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuthStore.mockImplementation((selector) =>
      selector({ login: mockLoginStore } as never),
    );
  });

  // test valid input
  it('should sign in successfully with valid credentials', async () => {
    mockSignInApi.mockResolvedValue(mockAuthResponse);

    const { result } = await renderHook(() => useSignIn());

    await act(
      async () =>
        await result.current.execute({
          email: 'test@t.com',
          password: 'pass-123',
        }),
    );

    expect(result.current.error).toBe(null);
    expect(result.current.isLoading).toBe(false);
  });

  // test authstore behavior when signin succeeds
  it('should authStore trigger when signin succeeds', async () => {
    mockSignInApi.mockResolvedValue(mockAuthResponse);

    const { result } = await renderHook(() => useSignIn());

    await act(
      async () =>
        await result.current.execute({ password: 'pass', email: 'test@t.com' }),
    );

    expect(mockLoginStore).toHaveBeenCalled();
    expect(mockLoginStore).toHaveBeenCalledWith(mockAuthResponse);
  });
  // test authstore behavior when signin fails
  it('should not trigger authStore when signin fails', async () => {
    mockSignInApi.mockRejectedValue(new Error('Failed to sign in'));

    const { result } = await renderHook(() => useSignIn());

    await act(
      async () =>
        await result.current.execute({
          email: 'test@t.com',
          password: 'pass1234',
        }),
    );

    expect(mockLoginStore).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Failed to sign in');
  });

  // test isLoading when the request triggered
  it('should set isLoading to true while request is pending', async () => {
    let resolveSignin: (value: AuthResponse) => void;

    mockSignInApi.mockReturnValue(
      new Promise((resolve) => (resolveSignin = resolve)),
    );

    const { result } = await renderHook(() => useSignIn());

    let signInPromise: Promise<void>;

    await act(async () => {
      signInPromise = result.current.execute({
        password: 'pass-123',
        email: 'test@t.com',
      });
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveSignin(mockAuthResponse);
      await signInPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
