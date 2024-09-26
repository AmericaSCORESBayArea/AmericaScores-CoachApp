import { useMutation } from '@tanstack/react-query';
import { authClient } from '../common';
import { setItem } from '@/core/storage';

export const login = async ({ useridentifier, serviceprovider }: any) => {
  const response = await authClient.get('auth/login', {
    params: {
      useridentifier,
      serviceprovider,
    },
  });

  return response.data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ useridentifier, serviceprovider }: any) =>
      login({ useridentifier, serviceprovider }),
    onSuccess: (data) => {
      setItem('user', data);
      console.log('Login successful:', data);
    },
    onError: (error) => {
      console.error('Error during login function call:', error.message);
    },
  });
};
