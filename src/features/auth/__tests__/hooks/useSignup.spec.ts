import { act, renderHook } from '@testing-library/react-native';
import { signupApi } from '../../api/auth.api';
import { useSignup } from '../../hooks/useSignup';
import { useAuthStore } from '../../store';
import { AuthResponse, Role } from '../../types';

jest.mock('../../api/auth.api');
jest.mock('../../store/authStore');

const mockSignupApi = signupApi as jest.MockedFunction<typeof signupApi>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

const mockedInput = {
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

const mockedUserInput = {
  confirmPassword: 'newPass',
  email: 'test@t.com',
  password: 'newPass',
  username: 'test',
};

describe('sign up test cases', () => {
  let mockLoginStore = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockImplementation((selector) =>
      selector({ login: mockLoginStore } as never),
    );
  });

  it('should return credentials when valid data provided', async () => {
    mockSignupApi.mockResolvedValue(mockedInput);

    const { result } = await renderHook(() => useSignup());

    await act(async () => await result.current.execute(mockedUserInput));

    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);

    expect(mockLoginStore).toHaveBeenCalledWith(mockedInput);
    expect(mockSignupApi).toHaveBeenCalledTimes(1);
  });

  it('should throw error when request fails', async () => {
    const error = new Error('Failed to sign up');

    mockSignupApi.mockRejectedValue(error);

    const { result } = await renderHook(() => useSignup());

    await act(
      async () =>
        await result.current.execute({
          confirmPassword: 'pass1234',
          password: 'pass1234',
          email: 'test@t.com',
          username: 'test',
        }),
    );

    expect(result.current.error).toBe(error.message);
    expect(result.current.isLoading).toBe(false);

    expect(mockSignupApi).toHaveBeenCalledTimes(1);
    expect(mockLoginStore).not.toHaveBeenCalled();
  });

  it('should set isLoading as true when request pending', async () => {
    let resolveSignup: (value: AuthResponse) => void;

    mockSignupApi.mockReturnValue(
      new Promise((resolve) => (resolveSignup = resolve)),
    );

    const { result } = await renderHook(() => useSignup());

    let signupPromise: Promise<void>;

    await act(async () => {
      signupPromise = result.current.execute(mockedUserInput);

      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();

    await act(async () => {
      resolveSignup(mockedInput);
      await signupPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    expect(mockSignupApi).toHaveBeenCalledTimes(1);

    expect(mockLoginStore).toHaveBeenCalledWith(mockedInput);
  });
});
