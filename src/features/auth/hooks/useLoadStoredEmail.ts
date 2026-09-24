import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function useLoadStoredEmail() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('email').then(setEmail);
  }, []);

  return email;
}
