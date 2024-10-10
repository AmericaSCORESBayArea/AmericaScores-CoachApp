import { EndpointPaths } from '@/interfaces/end-points-paths';
import type { EntityState } from '@reduxjs/toolkit';
import { ApiTagTypes } from '../api-tag-types';
import type {
  GetSessionsId,
  PatchSessionsId,
  PostSessions,
  GetSessions,
} from '@/interfaces/entities/session/sessions-entities';

import { apiSlice, providesList } from '../apiSlice';
import {
  GetSessionsAdapter,
  GetSessionsIdAdapter,
} from '@/api/adaptars/sessions/session-adapter';
import {
  GetSessionsSerializer,
  GetSessionsIdSerializer,
  PostSessionsSerializer,
  PatchSessionsIdSerializer,
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
        EntityState<GetSessions, string>,
        { teamSeasonId: string; date: string }
      >({
        query: ({ teamSeasonId, date }) => ({
          url: `${EndpointPaths.COACH_SESSIONS}?teamSeasonId=${teamSeasonId}&date=${date}`,
          method: 'GET',
        }),

        transformResponse: (response: GetSessions[]) => {
          return GetSessionsAdapter.setAll(
            GetSessionsAdapter.getInitialState(),
            response.map(GetSessionsSerializer)
          ) as EntityState<GetSessions, string>;
        },

        providesTags: (result) =>
          providesList(result?.ids, ApiTagTypes.COACH_SESSIONS),
      }),
      ////////////////////////////// Post sessions ////////////////////////////////////////////

      createCoachSession: builder.mutation<
        PostSessions,
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

        transformResponse: (response: PostSessions) => {
          return PostSessionsSerializer(response);
        },

        invalidatesTags: [ApiTagTypes.COACH_SESSIONS],
      }),
      ////////////////////////////// Get session by sessionId ////////////////////////////////////////////

      getCoachSessionId: builder.query<
        EntityState<GetSessionsId, string>,
        { sessionId: string }
      >({
        query: ({ sessionId }) => ({
          url: `${EndpointPaths.COACH_SESSIONS}/${sessionId}`,
          method: 'GET',
        }),

        transformResponse: (response: GetSessionsId | null) => {
          if (!response) {
            return GetSessionsIdAdapter.getInitialState();
          }

          return GetSessionsIdAdapter.setAll(
            GetSessionsIdAdapter.getInitialState(),
            Array.isArray(response)
              ? response.map(GetSessionsIdSerializer)
              : [GetSessionsIdSerializer(response)]
          ) as EntityState<GetSessionsId, string>;
        },

        providesTags: (result) =>
          providesList(result?.ids, ApiTagTypes.COACH_SESSIONS),
      }),

      ////////////////////////////// Update session by session ID ////////////////////////////////////////////

      updateCoachSessionId: builder.mutation<
        PatchSessionsId,
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
          console.log('PatchSessionsId: ', SessionId, sessionPatch);

          return {
            url: `${EndpointPaths.COACH_SESSIONS}/${SessionId}`,
            method: 'PATCH',
            body: {
              ...sessionPatch,
            },
          };
        },

        transformResponse: (response: PatchSessionsId) => {
          return PatchSessionsIdSerializer(response);
        },

        invalidatesTags: [ApiTagTypes.COACH_SESSIONS],
      }),
      ////////////////////////////// Delete session by session ID ////////////////////////////////////////////

      deleteCoachSessionId: builder.mutation<
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
  useUpdateCoachSessionIdMutation,
  useDeleteCoachSessionIdMutation,
} = brandEndpoints;
