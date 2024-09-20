import { Env } from '@env';
import axios from 'axios';

export const client = axios.create({
  baseURL: Env.API_URL,
  headers: {
    client_id: Env.CLIENT_ID,
    client_secret: Env.CLIENT_SECRET,
  },
});

export const authClient = axios.create({
  baseURL: Env.AUTH_URL,
  headers: {
    client_id: Env.CLIENT_ID,
    client_secret: Env.CLIENT_SECRET,
  },
});
