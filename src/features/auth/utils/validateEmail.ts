export const validateEmail = (value: string) => {
  const email = value.trim();

  if (!email) {
    return 'Email is required';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(value)) {
    return 'Invalid email format';
  }

  return null;
};
