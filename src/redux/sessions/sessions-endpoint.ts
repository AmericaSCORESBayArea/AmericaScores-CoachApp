import { EndpointPaths } from '@/interfaces/end-points-paths';
import type { EntityState } from '@reduxjs/toolkit';
import { ApiTagTypes } from '../api-tag-types';
import type {
  Sessions,
  SessionsId,
  SessionsIdPatch,
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
  sessionsIdPatchSerializer,
} from '@/serializers/sessions/session-serializer';
import { sessionData } from '@/data/data-base';

export const brandEndpoints = apiSlice
  .enhanceEndpoints({
    addTagTypes: [ApiTagTypes.COACH_SESSIONS],
  })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
      ////////////////////////////// Get sessions ////////////////////////////////////////////

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
      ////////////////////////////// Post sessions ////////////////////////////////////////////

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
      ////////////////////////////// Get session by sessionId ////////////////////////////////////////////

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

      ////////////////////////////// Update session by session ID ////////////////////////////////////////////

      updateCoachSession: builder.mutation<
        SessionsIdPatch,
        {
          SessionId: string;
          SessionName?: string;
          SessionDate?: string;
          SessionTopic?: string;
          TeamSeasonId?: string;
          Headcount?: number;
          FemaleHeadcount?: number;
        }
      >({
        query: ({ SessionId, ...sessionPatch }) => {
          console.log('sessionsIdPatch: ', SessionId, sessionPatch);

          return {
            url: `${EndpointPaths.COACH_SESSIONS}/${SessionId}`,
            method: 'PATCH',
            body: {
              ...sessionData,
            },
          };
        },

        transformResponse: (response: SessionsIdPatch) => {
          return sessionsIdPatchSerializer(response);
        },

        invalidatesTags: [ApiTagTypes.COACH_SESSIONS],
      }),
      ////////////////////////////// Delete session by session ID ////////////////////////////////////////////

      deleteCoachSession: builder.mutation<
        void, // No return value on delete
        { SessionId: string }
      >({
        query: ({ SessionId }) => ({
          url: `${EndpointPaths.COACH_SESSIONS}/${SessionId}`,
          method: 'DELETE',
        }),
        invalidatesTags: [ApiTagTypes.COACH_SESSIONS],
      }),
    }),
  });

export const {
  useGetCoachSessionsQuery,
  useGetCoachSessionIdQuery,
  useCreateCoachSessionMutation,
  useUpdateCoachSessionMutation,
  useDeleteCoachSessionMutation,
} = brandEndpoints;
