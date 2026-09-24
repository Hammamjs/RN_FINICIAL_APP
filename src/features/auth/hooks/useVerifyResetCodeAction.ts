import { useRef, useState } from 'react';
import { TextInput as RNTextInput, TextInputKeyPressEvent } from 'react-native';

type useVerifyResetCodeProps = {
  length: number;
  onComplete: (fullCode: string) => void;
  isDisabled: boolean;
};

export function useVerifyResetCodeActions({
  isDisabled,
  length,
  onComplete,
}: useVerifyResetCodeProps) {
  const [code, setCode] = useState(Array(length).fill(''));
  const inputs = useRef<Array<RNTextInput | null>>([]);

  const registerInput = (index: number) => (ref: RNTextInput | null) => {
    inputs.current[index] = ref;
  };

  const resetInputs = () => {
    setCode(Array(length).fill(''));
    inputs.current[0]?.focus();
  };

  const handleChange = async (text: string, index: number) => {
    if (isDisabled) return;

    console.log(text);

    if (text.length > 1) {
      const next: string[] = Array(length).fill('');
      const digits = text.replace(/\D/g, '').slice(0, length).split('');
      digits.forEach((d, i) => (next[i] = d));

      setCode(next);

      if (digits.length === length) {
        const lastIndex = length - 1;
        inputs.current[lastIndex]?.focus();
        onComplete(next.join(''));
        return;
      }

      return;
    }

    if (!/^\d?$/.test(text)) return;

    const next = [...code];

    console.log('Reset code', next);

    next[index] = text;

    if (index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    setCode(next);
    if (index === length - 1 && text) {
      onComplete(next.join(''));
      return;
    }
  };

  const handleKeyPress = (e: TextInputKeyPressEvent, index: number) => {
    if (e.nativeEvent.key !== 'Backspace') return;

    const next = [...code];

    if (code[index]) {
      next[index] = '';
      setCode(next);
      return;
    }

    if (index > 0) {
      const next = [...code];
      next[index - 1] = '';

      setCode(next);
      inputs.current[index - 1]?.focus();
    }
  };

  return {
    handleChange,
    handleKeyPress,
    registerInput,
    code,
    resetInputs,
  };
}
