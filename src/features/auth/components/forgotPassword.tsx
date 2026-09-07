import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Link, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Screen from '@/shared/components/screen';
import TextInput from '@/shared/components/ui/textInput';
import { ThemeMode } from '@/shared/context/themeContext';
import { useTheme } from '@/shared/hooks/useTheme';
import { useTranslation } from '@/shared/hooks/useTranslation';

export function ForgotPasswordComponent() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(theme);

  const router = useRouter();

  const onSearch = () => {
    router.push('/verify-reset-code');
  };

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
          <TextInput
            label={t.email}
            placeholder={t.enterEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />

          <Pressable style={styles.button} onPress={onSearch}>
            <Text style={styles.buttonText}>{t.sendCode}</Text>
          </Pressable>
        </View>

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
