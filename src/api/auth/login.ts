import { useMutation } from '@tanstack/react-query';
import { authClient } from '../common';

export const login = async ({ useridentifier, serviceprovider }: any) => {
  console.log('Sending login request with:', {
    useridentifier,
    serviceprovider,
  });

  const response = await authClient.get('auth/login', {
    params: {
      useridentifier,
      serviceprovider,
    },
  });

  console.log('Response:', response);
  return response.data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ useridentifier, serviceprovider }: any) =>
      login({ useridentifier, serviceprovider }),
    onSuccess: (data) => {
      console.log('Login successful:', data);
    },
    onError: (error) => {
      console.error('Error during login function call:', error.message);
    },
  });
};
