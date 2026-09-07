import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Link } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Screen from '@/shared/components/screen';
import { Spinner } from '@/shared/components/spinner';
import PasswordInput from '@/shared/components/ui/passwordInput';
import Input from '@/shared/components/ui/textInput';
import { ThemeMode } from '@/shared/context/themeContext';
import { useTheme } from '@/shared/hooks/useTheme';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useSigninWithGoogle } from '../hooks/useSigninWithGoogle';
import { useSignup } from '../hooks/useSignup';
import {
  DEFAULT_SIGNUP_VALUES,
  SignUpValidation,
  TSignUpValidation,
} from '../schema/signUp.validation';

export function SignUpComponent() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const form = useForm<TSignUpValidation>({
    resolver: zodResolver(SignUpValidation),
    mode: 'onBlur',
    defaultValues: DEFAULT_SIGNUP_VALUES,
  });

  const { t } = useTranslation();

  const { signup, isLoading: isSigningUp, error: signupError } = useSignup();

  const handleSignup = form.handleSubmit(async (data) => {
    await signup(data);
  });

  const { signinWithGoogle } = useSigninWithGoogle();

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t.signUp}</Text>
            <Text style={styles.subtitle}>{t.joinUs}</Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <Input
                  label={t.username}
                  placeholder={t.enterUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Input
                  label={t.email}
                  placeholder={t.enterEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  style={styles.input}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <PasswordInput
                  label={t.password}
                  placeholder={t.enterPassword}
                  style={styles.input}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <PasswordInput
                  label={t.confirmPassword}
                  placeholder={t.enterConfirmPass}
                  style={styles.input}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Pressable style={styles.primaryButton} onPress={handleSignup}>
              <Text style={styles.primaryButtonText}>
                {isSigningUp ? <Spinner /> : t.createAccount}
              </Text>
            </Pressable>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.orText}>{t.or}</Text>
              <View style={styles.divider} />
            </View>

            <Pressable style={styles.googleButton} onPress={signinWithGoogle}>
              <Ionicons
                name="logo-google"
                size={20}
                color={theme.textPrimary}
              />
              <Text style={styles.googleText}>{t.signInWithGoogle}</Text>
            </Pressable>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t.hasAccount}</Text>
          <Link href="/sign-in" style={styles.footerLink}>
            {t.signIn}
          </Link>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function createStyles(theme: ThemeMode) {
  return StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 40,
      paddingBottom: 20,
    },

    header: {
      width: '100%',
      maxWidth: 380,
      marginBottom: 32,
    },

    title: {
      color: theme.textPrimary,
      fontSize: 30,
      fontFamily: 'interMedium',
      marginBottom: 8,
    },

    subtitle: {
      color: theme.textSecondary,
      fontSize: 15,
      lineHeight: 22,
    },

    form: {
      width: '100%',
      maxWidth: 380,
    },

    input: {
      width: '100%',
      marginBottom: 16,
    },

    passwordHint: {
      color: theme.textSecondary,
      fontSize: 12,
      marginTop: -8,
      marginBottom: 20,
    },

    primaryButton: {
      height: 54,
      borderRadius: 10,
      backgroundColor: theme.textPrimary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },

    primaryButtonText: {
      color: theme.background,
      fontSize: 16,
      fontFamily: 'interMedium',
    },

    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 24,
      gap: 12,
    },

    divider: {
      flex: 1,
      height: 1,
      backgroundColor: theme.cardBorder,
    },

    orText: {
      color: theme.textSecondary,
      fontSize: 11,
      fontFamily: 'interMedium',
    },

    googleButton: {
      height: 54,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },

    googleText: {
      color: theme.textPrimary,
      fontSize: 15,
      fontFamily: 'interMedium',
    },

    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 16,
      paddingBottom: 24,
      gap: 5,
    },

    footerText: {
      color: theme.textSecondary,
      fontSize: 14,
    },

    footerLink: {
      color: theme.textPrimary,
      fontSize: 14,
      fontFamily: 'interMedium',
    },
  });
}
