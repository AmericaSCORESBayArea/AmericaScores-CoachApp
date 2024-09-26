import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useSoftKeyboardEffect } from '@/core/keyboard';
import { FocusAwareStatusBar } from '@/ui';
import LoginForm from '@/components/login-form';
import { getItem } from '@/core/storage';

export default function Login() {
  const router = useRouter();
  useSoftKeyboardEffect();

  useEffect(() => {
    async function fetchUser() {
      const user = await getItem('user');
      if (user) {
        router.push('(app)');
      }
    }
    fetchUser();
  }, [router]);

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm />
    </>
  );
}
