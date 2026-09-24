import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Link, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CustomMessage } from '@/shared/components/customMessage';
import Screen from '@/shared/components/screen';
import { Spinner } from '@/shared/components/spinner';
import Input from '@/shared/components/ui/textInput';
import { ThemeMode } from '@/shared/context/themeContext';
import { useAsync } from '@/shared/hooks';
import { useTheme } from '@/shared/hooks/useTheme';
import { useTranslation } from '@/shared/hooks/useTranslation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { forgotPasswordApi } from '../api/auth.api';
import { validateEmail } from '../utils/validateEmail';

export function ForgotPasswordComponent() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(theme);
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<null | string>(null);
  const router = useRouter();

  const handleEmailChange = (value: string) => {
    const error = validateEmail(value);

    if (error) {
      setEmailError(error);
      return;
    }

    setEmail(value);
    setEmailError(null);
  };

  const onSuccess = async () => {
    try {
      await AsyncStorage.setItem('email', email);
      router.push('/verify-reset-code');
    } catch (e) {
      console.log('Failed to attempt this action');
    }
  };

  const { execute, isLoading, error } = useAsync({
    asyncFunction: forgotPasswordApi,
    onSuccess: async () => await onSuccess(),
  });

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={32}
            color={theme.textPrimary}
          />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>{t.forgotPasswordTitle}</Text>
          <Text style={styles.subtitle}>{t.forgotPasswordDesc}</Text>
        </View>

        <View style={styles.form}>
          <Input
            label={t.email}
            placeholder={t.enterEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(e) => handleEmailChange(e)}
            value={email}
            style={styles.input}
            error={emailError ?? undefined}
          />

          <Pressable
            style={[styles.button]}
            onPress={async () => {
              if (emailError) return;
              await execute(email);
            }}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? <Spinner /> : t.sendCode}
            </Text>
          </Pressable>
        </View>

        {error && (
          <CustomMessage
            type="error"
            message={error ?? 'Something went wrong'}
          />
        )}

        <Link href="/sign-in" style={styles.backLink}>
          <Ionicons name="arrow-back" size={16} color={theme.textPrimary} />
          <Text style={styles.backText}>{t.backToSignIn}</Text>
        </Link>
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

    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },

    header: {
      width: '100%',
      maxWidth: 380,
      alignItems: 'center',
      marginBottom: 32,
    },

    title: {
      color: theme.textPrimary,
      fontSize: 28,
      fontFamily: 'interMedium',
      marginBottom: 10,
      textAlign: 'center',
    },

    subtitle: {
      color: theme.textSecondary,
      fontSize: 15,
      lineHeight: 22,
      textAlign: 'center',
      maxWidth: 340,
    },

    form: {
      width: '100%',
      maxWidth: 380,
    },

    input: {
      width: '100%',
      marginBottom: 18,
    },

    button: {
      height: 54,
      borderRadius: 10,
      backgroundColor: theme.textPrimary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    invalidEmail: {
      opacity: 0.8,
    },

    buttonText: {
      color: theme.background,
      fontSize: 16,
      fontFamily: 'interMedium',
    },

    backLink: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 30,
    },

    backText: {
      color: theme.textPrimary,
      fontSize: 14,
      fontFamily: 'interMedium',
    },
  });
}
