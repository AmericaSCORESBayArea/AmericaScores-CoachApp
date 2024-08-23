import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Post } from './types';

type Variables = { id: string };
type Response = Post;

export const usePost = createQuery<Response, Variables, AxiosError>({
  queryKey: ['posts'],
  fetcher: async (variables) => {
    const response = await client.get(`posts/${variables.id}`);
    return response.data;
  },
});
