import { EndpointPaths } from '@/interfaces/end-points-paths';
import type { EntityState } from '@reduxjs/toolkit';
import { ApiTagTypes } from '../api-tag-types';
import type {
  Sessions,
  SessionsId,
  SessionsPost,
} from '@/interfaces/entities/session/sessions-entities';

import { apiSlice, providesList } from '../apiSlice';
import {
  sessionsAdapter,
  sessionsIdAdapter,
} from '@/api/adaptars/sessions/session-adapter';
import {
  sessionsSerializer,
  sessionsIdSerializer,
  sessionsPostSerializer,
} from '@/serializers/sessions/session-serializer';

export const brandEndpoints = apiSlice
  .enhanceEndpoints({
    addTagTypes: [ApiTagTypes.COACH_SESSIONS],
  })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
      // Get sessions by TeamSeasonId and date
      getCoachSessions: builder.query<
        EntityState<Sessions, string>,
        { teamSeasonId: string; date: string }
      >({
        query: ({ teamSeasonId, date }) => ({
          url: `${EndpointPaths.COACH_SESSIONS}?teamSeasonId=${teamSeasonId}&date=${date}`,
          method: 'GET',
        }),

        transformResponse: (response: Sessions[]) => {
          return sessionsAdapter.setAll(
            sessionsAdapter.getInitialState(),
            response.map(sessionsSerializer)
          ) as EntityState<Sessions, string>;
        },

        providesTags: (result) =>
          providesList(result?.ids, ApiTagTypes.COACH_SESSIONS),
      }),
      // Post session by session
      createCoachSession: builder.mutation<
        SessionsPost,
        { SessionDate: string; SessionTopic: string; TeamSeasonId: string }
      >({
        query: (newSession) => {
          console.log('newSession : ', newSession);

          return {
            url: EndpointPaths.COACH_SESSIONS,
            method: 'POST',
            body: newSession,
          };
        },

        transformResponse: (response: SessionsPost) => {
          return sessionsPostSerializer(response);
        },

        invalidatesTags: [ApiTagTypes.COACH_SESSIONS],
      }),

      // Get session by sessionId
      getCoachSessionId: builder.query<
        EntityState<SessionsId, string>,
        { sessionId: string }
      >({
        query: ({ sessionId }) => ({
          url: `${EndpointPaths.COACH_SESSIONS}/${sessionId}`,
          method: 'GET',
        }),

        transformResponse: (response: SessionsId | null) => {
          if (!response) {
            return sessionsIdAdapter.getInitialState();
          }

          return sessionsIdAdapter.setAll(
            sessionsIdAdapter.getInitialState(),
            Array.isArray(response)
              ? response.map(sessionsIdSerializer)
              : [sessionsIdSerializer(response)]
          ) as EntityState<SessionsId, string>;
        },

        providesTags: (result) =>
          providesList(result?.ids, ApiTagTypes.COACH_SESSIONS),
      }),
    }),
  });

export const {
  useGetCoachSessionsQuery,
  useGetCoachSessionIdQuery,
  useCreateCoachSessionMutation,
} = brandEndpoints;
