import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Post } from './types';

type Response = Post[];
type Variables = void; // as react-query-kit is strongly typed, we need to specify the type of the variables as void in case we don't need them

export const usePosts = createQuery<Response, Variables, AxiosError>({
  queryKey: ['posts'],
  fetcher: async () => {
    const response = await client.get(`posts`);
    return response.data.posts;
  },
});

export const getStudent = createQuery<Response, Variables, AxiosError>({
  queryKey: ['coach'],
  fetcher: async (variables) => {
    const response = await client.get(
      '/003U8000008dKdNIAU/teamseasons/a0qHs00000BvrIUIAZ/sessions/a0pHs00000TqrmUIAR/assessments'
    );
    console.log('response', response);
    return response.data;
  },
});

// return await Axios.get(
//   //     // `${ApiConfig.dataApi}/coach/${user.user.ContactId}/teamseasons/${route.params.teamSeasonId}/enrollments`
//   //   )
