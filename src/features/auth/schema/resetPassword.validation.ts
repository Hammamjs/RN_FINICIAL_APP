import { z } from 'zod';

type ResetPasswordSchemaTranslation = {
  newPasswordMin: string;
  newPasswordUppercase: string;
  newPasswordLowercase: string;
  newPasswordDigit: string;
  newPasswordSpecial: string;
  confirmPasswordRequired: string;
  passwordMustMatched: string;
  requiredEmail: string;
};

export const ResetPasswordValidation = (t: ResetPasswordSchemaTranslation) =>
  z
    .object({
      newPassword: z
        .string()
        .min(8, t.newPasswordMin)
        .regex(/[A-Z]/, t.newPasswordUppercase)
        .regex(/[a-z]/, t.newPasswordLowercase)
        .regex(/[\d]/, t.newPasswordDigit)
        .regex(/[^0-9A-Za-z\s]/, t.newPasswordSpecial),
      email: z.email().min(1, t.requiredEmail),
      confirmPassword: z.string().min(8, t.confirmPasswordRequired),
    })
    .refine(
      ({ confirmPassword, newPassword }) => confirmPassword === newPassword,
      {
        path: ['confirmPassword'],
        error: t.passwordMustMatched,
      },
    );

export type TResetPasswordValidation = z.infer<
  ReturnType<typeof ResetPasswordValidation>
>;

export const RESET_PASSWORD_DEFAULT_VALUES: TResetPasswordValidation = {
  confirmPassword: '',
  email: '',
  newPassword: '',
};
