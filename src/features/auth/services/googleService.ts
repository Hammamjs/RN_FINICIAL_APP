import { GoogleSignin } from '@react-native-google-signin/google-signin';
import '../config/google';

export async function signinWithGoogleService() {
  await GoogleSignin.hasPlayServices();

  const response = await GoogleSignin.signIn();

  if (!response?.data?.idToken) {
    throw new Error('Google signin failed');
  }

  return response.data.idToken;
}
