import { client } from '../common';
import type { LoginResponse } from './types';

export const login = async (username: string, password: string) => {
  const response = await client.post<LoginResponse>('/auth/login', {
    username,
    password,
  });
  return response.data;
};
