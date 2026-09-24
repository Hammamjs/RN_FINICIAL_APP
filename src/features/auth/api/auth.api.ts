import { TUpdatePasswordSchema } from '@/features/users/schema/updatePassword.validation';
import { fetcher } from '@/shared/api';
import { TSignInValidation } from '../schema/signIn.validation';
import { TSignUpValidation } from '../schema/signUp.validation';
import { authenticatedFetcher } from '../services/authenticatedFetcher';
import { AuthResponse } from '../types/auth.types';

const BASE_ENDPOINT = '/api/auth';

export async function signInApi(
  signInDto: TSignInValidation,
): Promise<AuthResponse> {
  return fetcher<AuthResponse>(BASE_ENDPOINT + '/sign-in', {
    method: 'POST',
    body: JSON.stringify(signInDto),
  });
}

export async function signupApi(data: TSignUpValidation) {
  return fetcher<AuthResponse>(BASE_ENDPOINT + '/sign-up', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePasswordApi(data: TUpdatePasswordSchema) {
  return authenticatedFetcher<{ message: string }>(
    BASE_ENDPOINT + '/update-password',
    {
      body: JSON.stringify(data),
      method: 'PATCH',
    },
  );
}

export async function logoutApi() {
  return authenticatedFetcher<void>(BASE_ENDPOINT + '/log-out', {
    method: 'POST',
  });
}

export async function signInWithGoogleApi(idToken: string) {
  return fetcher<AuthResponse>(BASE_ENDPOINT + '/google/mobile', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });
}

// TODO: test those functions
export async function forgotPasswordApi(email: string) {
  return fetcher<void>(BASE_ENDPOINT + '/forgot-password', {
    body: JSON.stringify({ email }),
    method: 'POST',
  });
}

export async function verifyRestCodeApi(data: {
  email: string;
  resetCode: string;
}) {
  return fetcher<void>(BASE_ENDPOINT + '/verify-code', {
    body: JSON.stringify(data),
    method: 'POST',
  });
}

export async function resetPasswordApi(data: {
  confirmPassword: string;
  newPassword: string;
  email: string;
}) {
  return fetcher<{ message: string }>(BASE_ENDPOINT + '/reset-password', {
    body: JSON.stringify(data),
    method: 'PATCH',
  });
}
