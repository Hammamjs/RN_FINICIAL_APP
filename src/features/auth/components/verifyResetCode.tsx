import { Link, router } from 'expo-router';
import {
 KeyboardAvoidingView,
 Platform,
 Pressable,
 TextInput as RNTextInput,
 ScrollView,
 StyleSheet,
 Text,
 View,
} from 'react-native';

import Screen from '@/shared/components/screen';
import { Spinner } from '@/shared/components/spinner';
import { ThemeMode } from '@/shared/context/themeContext';
import { useAsync } from '@/shared/hooks';
import { useTheme } from '@/shared/hooks/useTheme';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { forgotPasswordApi, verifyRestCodeApi } from '../api/auth.api';
import { useLoadStoredEmail } from '../hooks/useLoadStoredEmail';
import { useVerifyResetCodeActions } from '../hooks/useVerifyResetCodeAction';
import { useVerifyResetCodeCounter } from '../hooks/useVerifyResetCodeCounter';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

export function VerifyResetPassword() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(theme);

  const { canResend, secondsLeft, resetCounter } =
    useVerifyResetCodeCounter(RESEND_SECONDS);

  const email = useLoadStoredEmail();

  const onSuccess = () => {
    resetCounter();
    router.replace('/reset-password');
  };

  const {
    execute: handleVerify,
    isLoading: isVerifying,
    error: resendError,
  } = useAsync({
    asyncFunction: verifyRestCodeApi,
    onSuccess,
  });

  const {
    execute: executeResend,
    isLoading: isResending,
    error: verifyError,
  } = useAsync({
    asyncFunction: forgotPasswordApi,
  });

  const { code, handleChange, handleKeyPress, registerInput } =
    useVerifyResetCodeActions({
      isDisabled: !email?.trim(),
      length: CODE_LENGTH,
      onComplete: async (resetCode) => {
        if (!email?.trim()) return;
        await handleVerify({ resetCode, email });
      },
    });

  const handleResend = async () => {
    if (!canResend || isResending) return;
    if (!email?.trim()) return;

    await executeResend(email);
  };

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
            <Text style={styles.title}>{t.verifyCodeTitle}</Text>
            <Text style={styles.subtitle}>{t.verifyCodeDesc}</Text>
          </View>

          <View style={styles.codeRow}>
            {code.map((digit, index) => (
              <RNTextInput
                key={index}
                ref={registerInput(index)}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={CODE_LENGTH}
                textContentType="oneTimeCode"
                style={[
                  styles.codeBox,
                  digit ? styles.codeBoxFilled : null,
                  resendError ? styles.codeBoxError : null,
                ]}
              />
            ))}
          </View>

          {resendError || verifyError ? (
            <Text style={styles.errorText}>{resendError ?? verifyError}</Text>
          ) : null}

          <Pressable
            style={[styles.primaryButton, isVerifying && styles.buttonDisabled]}
            onPress={() => {
              if (!email?.trim()) return;
              handleVerify({ resetCode: code.join(''), email });
            }}
            disabled={isVerifying || code.some((d) => d === '')}
          >
            <Text style={styles.primaryButtonText}>
              {isVerifying ? <Spinner /> : t.verifyCode}
            </Text>
          </Pressable>

          <View style={styles.resendRow}>
            {secondsLeft > 0 ? (
              <Text style={styles.resendText}>
                {t.resendIn.replace('{s}', String(secondsLeft))}
              </Text>
            ) : (
              <Pressable onPress={handleResend} disabled={isResending}>
                <Text style={styles.resendLink}>
                  {isResending ? t.sending : t.resendCode}
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t.wrongEmail}</Text>
          <Link href="/forgot-password" style={styles.footerLink}>
            {t.goBack}
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
    codeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      maxWidth: 380,
      marginBottom: 12,
    },
    codeBox: {
      width: 48,
      height: 56,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      backgroundColor: theme.inputBg,
      color: theme.textPrimary,
      fontSize: 22,
      fontFamily: 'interMedium',
      textAlign: 'center',
    },
    codeBoxFilled: {
      borderColor: theme.primaryAction,
    },
    codeBoxError: {
      borderColor: '#E5484D',
    },
    errorText: {
      color: '#E5484D',
      fontSize: 12,
      alignSelf: 'flex-start',
      width: '100%',
      maxWidth: 380,
      marginBottom: 16,
    },
    primaryButton: {
      height: 54,
      borderRadius: 10,
      backgroundColor: theme.primaryAction,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: 380,
      marginTop: 8,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    primaryButtonText: {
      color: theme.PrimaryActionText,
      fontSize: 16,
      fontFamily: 'interMedium',
    },
    resendRow: {
      marginTop: 20,
      alignItems: 'center',
    },
    resendText: {
      color: theme.textSecondary,
      fontSize: 14,
    },
    resendLink: {
      color: theme.primaryAction,
      fontSize: 14,
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
