import {
 act,
 cleanup,
 fireEvent,
 render,
 screen,
 waitFor,
} from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { ForgotPasswordComponent } from '../../components/forgotPassword';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Link: ({ children, href, ...props }: any) => {
    const { Text } = require('react-native');
    return (
      <Text {...props} testID={`link-${href}`}>
        {children}
      </Text>
    );
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn(),
}));

jest.mock('@/shared/hooks/useTheme', () => ({
  useTheme: () => ({
    theme: {
      textPrimary: '#000',
      textSecondary: '#666',
      background: '#fff',
      cardBorder: '#ddd',
    },
    colorScheme: 'light',
  }),
}));

jest.mock('@/shared/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: new Proxy({}, { get: (_target, prop) => prop }),
  }),
}));

jest.mock('@react-native-vector-icons/ionicons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('@/shared/components/screen', () => {
  const { View } = require('react-native');
  return (props: any) => <View {...props} />;
});

jest.mock('@/shared/components/ui/textInput', () => {
  const { TextInput: RNTextInput } = require('react-native');

  return (props: any) => <RNTextInput {...props} />;
});

jest.mock('@/shared/hooks/useAsync', () => ({
  useAsync: ({ onSuccess }: any) => ({
    error: null,
    isLoading: false,
    execute: jest.fn(async (_email: string) => {
      await onSuccess();
    }),
  }),
}));

describe('ForgotPasswordComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    cleanup();
  });

  test('render correctly', async () => {
    await render(<ForgotPasswordComponent />);
    expect(screen.getByText('forgotPasswordTitle')).toBeTruthy();
  });

  test('navigates to verify-reset-code on button press', async () => {
    await render(<ForgotPasswordComponent />);
    // const user = userEvent.setup();
    await fireEvent.press(screen.getByText('sendCode'));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
    expect(mockPush).toHaveBeenCalledWith('/verify-reset-code');
  });

  test('renders forgot password form', async () => {
    await render(<ForgotPasswordComponent />);

    expect(screen.getByText('forgotPasswordTitle')).toBeTruthy();
    expect(screen.getByText('forgotPasswordDesc')).toBeTruthy();
    expect(screen.getByText('sendCode')).toBeTruthy();
    expect(screen.getByPlaceholderText('enterEmail')).toBeTruthy();
    expect(screen.getByText('backToSignIn')).toBeTruthy();
  });

  test('allowing entering email', async () => {
    await render(<ForgotPasswordComponent />);

    const input = screen.getByPlaceholderText('enterEmail');

    await act(() => fireEvent.changeText(input, 'test@t.com'));

    const updatedInput = screen.getByPlaceholderText('enterEmail');

    expect(updatedInput).toHaveProp('value', 'test@t.com');
  });

  test('navigates to sign in on button press', async () => {
    await render(<ForgotPasswordComponent />);

    fireEvent.press(screen.getByText('backToSignIn'));

    expect(screen.getByTestId('link-/sign-in')).toBeTruthy();
  });
});
