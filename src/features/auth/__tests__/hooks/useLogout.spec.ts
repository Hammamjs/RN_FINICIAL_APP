import { act, renderHook } from '@testing-library/react-native';
import { logoutApi } from '../../api';
import { useLogout } from '../../hooks/useLogout';
import { useAuthStore } from '../../store';

jest.mock('../../api/auth.api');
jest.mock('../../store/authStore');

const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;
const mockLogoutApi = logoutApi as jest.MockedFunction<typeof logoutApi>;

describe('test useLogout hook', () => {
  const mockLogoutStore = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuthStore.mockImplementation((selector) =>
      selector({ logout: mockLogoutStore } as never),
    );
  });

  it('should logout successfully', async () => {
    mockLogoutApi.mockResolvedValue(undefined);

    const { result } = await renderHook(() => useLogout());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    await act(async () => await result.current.execute({}));

    expect(mockLogoutApi).toHaveBeenCalledTimes(1);
    expect(mockLogoutStore).toHaveBeenCalledTimes(1);

    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should throw error when logoutApi fail', async () => {
    const error = new Error('Logout failed');

    mockLogoutApi.mockRejectedValue(error);

    const { result } = await renderHook(() => useLogout());

    await act(async () => await result.current.execute({}));

    expect(logoutApi).toHaveBeenCalledTimes(1);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(error.message);

    expect(mockUseAuthStore).toHaveBeenCalled();
  });

  it('should use default error message for non-Error exceptions', async () => {
    mockLogoutApi.mockRejectedValue('Operation failed');

    const { result } = await renderHook(() => useLogout());

    await act(async () => await result.current.execute({}));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Operation failed');

    expect(mockUseAuthStore).toHaveBeenCalled();
  });

  it('should always call logoutStore even when logoutApi failed', async () => {
    const error = new Error('API Error');
    mockLogoutApi.mockRejectedValue(error);

    const { result } = await renderHook(() => useLogout());

    await act(async () => await result.current.execute({}));

    expect(mockLogoutApi).toHaveBeenCalled();
    expect(mockLogoutStore).toHaveBeenCalled();
  });

  it('should set isLoading to true while logout in progress', async () => {
    let resolveLogout: () => void;

    mockLogoutApi.mockReturnValue(
      new Promise((resolve) => (resolveLogout = resolve)),
    );

    const { result } = await renderHook(() => useLogout());

    let logoutPromise: Promise<void>;

    await act(async () => {
      logoutPromise = result.current.execute({});

      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveLogout();
      await logoutPromise;
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should call logoutStore when API succeeds', async () => {
    mockLogoutApi.mockResolvedValue(undefined);

    const { result } = await renderHook(() => useLogout());

    await act(async () => result.current.execute({}));

    expect(mockLogoutApi).toHaveBeenCalledTimes(1);
    expect(mockLogoutStore).toHaveBeenCalledTimes(1);
  });
});
