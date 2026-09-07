import { Link, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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
import { ThemeMode } from '@/shared/context/themeContext';
import { useTheme } from '@/shared/hooks/useTheme';
import { useTranslation } from '@/shared/hooks/useTranslation';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

export function VerifyResetPassword() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(theme);

  const [code, setCode] = useState(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const inputs = useRef<Array<RNTextInput | null>>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      const digits = text.replace(/\D/g, '').slice(0, CODE_LENGTH).split('');
      const next = Array(CODE_LENGTH).fill('');
      digits.forEach((d, i) => (next[i] = d));
      setCode(next);
      const lastFilled = Math.min(digits.length, CODE_LENGTH) - 1;
      if (lastFilled >= 0) inputs.current[lastFilled]?.focus();
      if (digits.length === CODE_LENGTH) handleVerify(next.join(''));
      return;
    }

    if (!/^\d?$/.test(text)) return;

    const next = [...code];
    next[index] = text;
    setCode(next);
    if (error) setError('');

    if (text && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (text && index === CODE_LENGTH - 1 && next.every((d) => d !== '')) {
      handleVerify(next.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      const next = [...code];
      next[index - 1] = '';
      setCode(next);
    }
  };

  const handleVerify = async (fullCode: string) => {
    setIsVerifying(true);
    setError('');
    try {
      // TODO: call your API
      // await api.verifyResetCode({ code: fullCode });
      router.replace('/reset-password');
    } catch (err) {
      setError(t.codeInvalid);
      setCode(Array(CODE_LENGTH).fill(''));
      inputs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || isResending) return;
    setIsResending(true);
    try {
      // TODO: call your API
      // await api.requestResetOtp();
      setSecondsLeft(RESEND_SECONDS);
      setCode(Array(CODE_LENGTH).fill(''));
      setError('');
      inputs.current[0]?.focus();
    } catch {
      setError(t.codeSendError);
    } finally {
      setIsResending(false);
    }
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
                ref={(ref) => {
                  inputs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={CODE_LENGTH}
                textContentType="oneTimeCode"
                autoFocus={index === 0}
                style={[
                  styles.codeBox,
                  digit ? styles.codeBoxFilled : null,
                  error ? styles.codeBoxError : null,
                ]}
              />
            ))}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            style={[styles.primaryButton, isVerifying && styles.buttonDisabled]}
            onPress={() => handleVerify(code.join(''))}
            disabled={isVerifying || code.some((d) => d === '')}
          >
            <Text style={styles.primaryButtonText}>
              {isVerifying ? t.verifying : t.verifyCode}
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
