import { z } from 'zod';

export const SignUpValidation = z
  .object({
    username: z.string().min(3, 'Characters must be at least 3 characters'),
    email: z.email().min(1, 'Email is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain capital character')
      .regex(/[a-z]/, 'Password must contain small character')
      .regex(/[0-9]/, 'Password must contain digit')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain special character'),

    confirmPassword: z.string().min(1, 'Confirm password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    error: 'Passwords must match',
  });

export type TSignUpValidation = z.infer<typeof SignUpValidation>;

export const DEFAULT_SIGNUP_VALUES: TSignUpValidation = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};
