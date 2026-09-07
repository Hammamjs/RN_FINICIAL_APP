import { z } from 'zod';

export const SignInValidation = z.object({
  email: z.email({ error: 'Invalid email format' }).min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export type TSignInValidation = z.infer<typeof SignInValidation>;

export const DEFAULT_SIGNIN_VALUES: TSignInValidation = {
  email: '',
  password: '',
};
