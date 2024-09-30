import { EndpointPaths } from '@/interfaces/end-points-paths';

import { ApiTagTypes } from '../api-tag-types';
import { apiSlice } from '../apiSlice';

import type { PostAttendance } from '@/interfaces/entities/attendance/attendance-entities';

import { PostAttendanceSerializer } from '@/serializers/attendance/attendance-serializer';

export const brandEndpoints = apiSlice
  .enhanceEndpoints({
    addTagTypes: [ApiTagTypes.COACH_ATTENDANCES],
  })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
      createCoachAttendance: builder.mutation<
        PostAttendance,
        { SessionDate: string; SessionTopic: string; TeamSeasonId: string }
      >({
        query: (newSession) => {
          console.log('newSession : ', newSession);

          return {
            url: EndpointPaths.COACH_ATTENDANCES,
            method: 'POST',
            body: newSession,
          };
        },

        transformResponse: (response: PostAttendance) => {
          return PostAttendanceSerializer(response);
        },

        invalidatesTags: [ApiTagTypes.COACH_ATTENDANCES],
      }),
    }),
  });

export const { useCreateCoachAttendanceMutation } = brandEndpoints;
