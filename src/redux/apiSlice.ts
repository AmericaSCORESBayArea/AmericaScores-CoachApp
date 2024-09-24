import type { EntityId } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { cacheFetch } from '@/constants/cache';
import { Env } from '@env';

const baseQuery = fetchBaseQuery({
  baseUrl: Env.API_URL,
  prepareHeaders: (headers) => {
    headers.set('client_id', Env.CLIENT_ID);
    headers.set('client_secret', Env.CLIENT_SECRET);
    return headers;
  },
});

export function providesList<R extends EntityId[], T extends string>(
  resultsWithIds: R | undefined,
  tagType: T
) {
  return resultsWithIds
    ? [
        { type: tagType, id: 'LIST' },
        ...resultsWithIds.map((id) => ({ type: tagType, id })),
      ]
    : [{ type: tagType, id: 'LIST' }];
}

export const apiSlice = createApi({
  baseQuery: baseQuery,
  keepUnusedDataFor: cacheFetch,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
