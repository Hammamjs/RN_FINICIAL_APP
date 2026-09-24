import {
 fireEvent,
 render,
 screen,
 userEvent,
} from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { SignInComponent } from '../../components';

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Link: ({ href, ...props }: any) => {
    const { Text } = require('react-native');

    return <Text testID={`link-${href}`} {...props} />;
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
  },
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
    language: 'en',
  }),
}));

jest.mock('@/shared/components/ui/textInput', () => {
  const { TextInput: RNTextInput, Text, View } = require('react-native');

  return ({ error, ...props }: any) => (
    <View>
      <RNTextInput {...props} />
      {error ? <Text>{error}</Text> : null}
    </View>
  );
});

jest.mock('@/shared/components/screen', () => {
  const { View } = require('react-native');

  return (props: any) => <View {...props} />;
});

jest.mock('@react-native-vector-icons/ionicons', () => ({
  Ionicons: 'Ionicons',
}));

describe('test signIn component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
  });

  test('render correctly', async () => {
    await render(<SignInComponent />);
    expect(screen.getByText('welcome')).toBeTruthy();
  });

  /**
   * Uses userEvent instead of fireEvent because userEvent awaits
   * React's state updates and async consequences, while fireEvent
   * returns immediately and lets RHF's handleSubmit leak into
   * subsequent tests via an open act() scope.
   */
  test('return error message when invalid email provided', async () => {
    await render(<SignInComponent />);

    const user = userEvent.setup();

    user.type(screen.getByPlaceholderText('email'), 'not-an-email');
    user.type(screen.getByPlaceholderText('password'), 'pass12234');

    user.press(screen.getByText('Sign In'));

    expect(await screen.findByText(/invalid email/i)).toBeTruthy();
  });

  test('render testing in form', async () => {
    await render(<SignInComponent />);

    expect(screen.getByPlaceholderText('email')).toBeTruthy();
    expect(screen.getByPlaceholderText('password')).toBeTruthy();
    expect(screen.getByText('signInWithGoogle')).toBeTruthy();
    expect(screen.getByText('Sign In')).toBeTruthy();
  });

  test('Navigates to sign up screen', async () => {
    await render(<SignInComponent />);

    fireEvent.press(screen.getByText('signUp'));

    expect(screen.getByTestId('link-/sign-up'));
  });
});
