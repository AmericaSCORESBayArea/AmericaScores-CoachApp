import { EndpointPaths } from '@/interfaces/end-points-paths';
import { apiSlice } from '../apiSlice';

export const authEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ useridentifier, serviceprovider }) => ({
        url: EndpointPaths.AUTH_LOGIN,
        method: 'GET',
        params: {
          useridentifier,
          serviceprovider,
        },
      }),
      onQueryStarted: async (args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          if (error instanceof Error) {
            console.error('Error during login function call:', error.message);
          } else {
            console.error('An unknown error occurred:', error);
          }
        }
      },
    }),
  }),
});

// Export the auto-generated hook
export const { useLoginMutation } = authEndpoints;
