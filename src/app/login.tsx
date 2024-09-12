import { useRouter } from 'expo-router';
import React from 'react';

// import type { LoginFormProps } from '@/components/login-form';
import { useSoftKeyboardEffect } from '@/core/keyboard';
import { FocusAwareStatusBar } from '@/ui';
import LoginForm from '@/components/login-form';

export default function Login() {
  const router = useRouter();
  useSoftKeyboardEffect();

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm />
    </>
  );
}
