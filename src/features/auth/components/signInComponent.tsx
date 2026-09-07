import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Link, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Screen from '@/shared/components/screen';
import PasswordInput from '@/shared/components/ui/passwordInput';
import Input from '@/shared/components/ui/textInput';
import { ThemeMode } from '@/shared/context/themeContext';
import { useTheme } from '@/shared/hooks/useTheme';
// validation
import { CustomMessage } from '@/shared/components/customMessage';
import { Spinner } from '@/shared/components/spinner';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useSignIn } from '../hooks/useSignIn';
import { useSigninWithGoogle } from '../hooks/useSigninWithGoogle';
import {
  DEFAULT_SIGNIN_VALUES,
  SignInValidation,
  TSignInValidation,
} from '../schema/signIn.validation';

export function SignInComponent() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const router = useRouter();

  const { t, language } = useTranslation();

  const { signin, error, isLoading } = useSignIn();

  const form = useForm<TSignInValidation>({
    resolver: zodResolver(SignInValidation),
    mode: 'onSubmit',
    defaultValues: DEFAULT_SIGNIN_VALUES,
  });

  const handleSignIn = form.handleSubmit(async (data) => {
    try {
      await signin(data);
      router.replace('/dashboard');
    } catch (e) {
      console.error(e);
    }
  });

  const {
    error: googleSigninError,
    isLoading: isGoogleSigning,
    signinWithGoogle,
  } = useSigninWithGoogle();

  const handleGoogleAuth = async (): Promise<void> => {
    await signinWithGoogle();
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.welcome}</Text>

          <Text style={styles.subtitle}>{t.signIn}</Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Input
                label={t.email}
                placeholder={t.email}
                keyboardType="email-address"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                autoCapitalize="none"
                error={fieldState.error?.message}
                style={styles.input}
              />
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <PasswordInput
                placeholder={t.password}
                style={styles.input}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                label={t.password}
              />
            )}
          />

          <Link
            href="/forgot-password"
            style={[
              styles.forgotPassword,
              language == 'ar' && { alignSelf: 'flex-start' },
            ]}
          >
            {t.forgotPassword}
          </Link>

          <Pressable
            style={styles.signInButton}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            <Text style={styles.signInText}>
              {isLoading ? <Spinner /> : 'Sign In'}
            </Text>
          </Pressable>

          {error && <CustomMessage message={error} type="error" />}

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>{t.or}</Text>
            <View style={styles.divider} />
          </View>

          <Pressable style={styles.googleButton} onPress={handleGoogleAuth}>
            <Ionicons
              name="logo-google"
              size={22}
              color={theme.PrimaryActionText}
            />

            <Text style={styles.googleText}>{t.signInWithGoogle}</Text>
          </Pressable>
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>{t.hasAccount}</Text>

          <Link href="/sign-up" style={styles.signupLink}>
            {t.signUp}
          </Link>
        </View>
      </View>
    </Screen>
  );
}

function createStyles(theme: ThemeMode) {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },

    header: {
      width: '100%',
      maxWidth: 360,
      marginBottom: 35,
    },

    title: {
      color: theme.textPrimary,
      fontSize: 30,
      fontFamily: 'interMedium',
      marginBottom: 8,
    },

    subtitle: {
      color: theme.textPrimary,
      fontSize: 15,
      lineHeight: 22,
    },

    form: {
      width: '100%',
      maxWidth: 360,
    },

    input: {
      width: '100%',
      marginBottom: 18,
      color: theme.textPrimary,
    },

    forgotPassword: {
      alignSelf: 'flex-end',
      color: theme.textPrimary,
      fontSize: 14,
      marginTop: -5,
      marginBottom: 24,
      textDecorationLine: 'underline',
    },

    signInButton: {
      height: 54,
      borderRadius: 8,
      backgroundColor: theme.primaryAction,
      color: theme.PrimaryActionText,
      justifyContent: 'center',
      alignItems: 'center',
    },

    signInText: {
      color: theme.background,
      fontSize: 16,
      fontFamily: 'interMedium',
    },

    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 28,
      gap: 12,
    },

    divider: {
      flex: 1,
      height: 1,
      backgroundColor: theme.cardBorder,
    },

    orText: {
      color: theme.textSecondary,
      fontSize: 12,
      fontFamily: 'interMedium',
    },

    googleButton: {
      height: 54,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      backgroundColor: theme.primaryAction,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },

    googleText: {
      color: theme.PrimaryActionText,
      fontSize: 15,
      fontFamily: 'interMedium',
    },

    signupContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 35,
      gap: 5,
    },

    signupText: {
      color: theme.textSecondary,
      fontSize: 14,
    },

    signupLink: {
      color: theme.textPrimary,
      fontSize: 14,
      fontFamily: 'interMedium',
    },
  });
}
