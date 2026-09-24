import { useEffect, useState } from 'react';

export function useVerifyResetCodeCounter(initialSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const resetCounter = () => setSecondsLeft(initialSeconds);

  return {
    secondsLeft,
    canResend: secondsLeft === 0,
    resetCounter,
  };
}
