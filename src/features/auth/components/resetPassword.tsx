import { Link, router } from 'expo-router';
import { useEffect } from 'react';
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
import { ThemeMode } from '@/shared/context/themeContext';
import { useAsync } from '@/shared/hooks';
import { useTheme } from '@/shared/hooks/useTheme';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { resetPasswordApi } from '../api/auth.api';
import { useLoadStoredEmail } from '../hooks/useLoadStoredEmail';
import {
 RESET_PASSWORD_DEFAULT_VALUES,
 ResetPasswordValidation,
 TResetPasswordValidation,
} from '../schema/resetPassword.validation';
import { translation } from '../utils/translationResetPassword';

export function ResetPasswordComponent() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(theme);

  const email = useLoadStoredEmail();

  const translatedResetPasswordValidation = ResetPasswordValidation(
    translation(t),
  );

  const form = useForm<TResetPasswordValidation>({
    resolver: zodResolver(translatedResetPasswordValidation),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!email) return;
    form.reset({
      ...RESET_PASSWORD_DEFAULT_VALUES,
      email,
    });
  }, [email, form]);

  const onSuccess = () => {
    router.replace('/sign-in');
  };

  const { execute, error, isLoading } = useAsync({
    asyncFunction: resetPasswordApi,
    onSuccess,
  });

  const handleReset = form.handleSubmit(async (data) => {
    await execute(data);
  });

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
            <Text style={styles.title}>{t.resetPasswordTitle}</Text>
            <Text style={styles.subtitle}>{t.resetPasswordDesc}</Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={form.control}
              name="newPassword"
              render={({ field, fieldState }) => (
                <PasswordInput
                  label={t.newPassword}
                  placeholder={t.newPassword}
                  value={field.value}
                  onChangeText={field.onChange}
                  style={styles.input}
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
                  value={field.value}
                  onChangeText={field.onChange}
                  style={styles.input}
                  error={fieldState.error?.message}
                />
              )}
            />

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <Text style={styles.passwordHint}>
                {t.passReq.requirements.minLength}
              </Text>
            )}

            <Pressable style={styles.primaryButton} onPress={handleReset}>
              <Text style={styles.primaryButtonText}>
                {isLoading ? <Spinner /> : t.resetPassword}
              </Text>
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
    errorText: {
      color: '#E5484D',
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
