import { TranslationKey } from '@/shared/context';

export function translation(t: TranslationKey) {
  return {
    newPasswordDigit: t.newPasswordDigit,
    confirmPasswordRequired: t.confirmPasswordRequired,
    newPasswordLowercase: t.newPasswordLowercase,
    newPasswordMin: t.newPasswordMin,
    newPasswordSpecial: t.newPasswordSpecial,
    newPasswordUppercase: t.newPasswordUppercase,
    passwordMustMatched: t.passwordsMustMatched,
    requiredEmail: t.forgotPasswordDesc,
  };
}
