import { EndpointPaths } from '@/interfaces/end-points-paths';

import { ApiTagTypes } from '../api-tag-types';
import { apiSlice, providesList } from '../apiSlice';

import type {
  GetAttendance,
  PostAttendance,
} from '@/interfaces/entities/attendance/attendance-entities';

import {
  GetAttendanceSerializer,
  PostAttendanceSerializer,
} from '@/serializers/attendance/attendance-serializer';
import type { EntityState } from '@reduxjs/toolkit';
import { GetAttendanceAdapter } from '@/api/adaptars/attendance/attendance-adapter';

export const brandEndpoints = apiSlice
  .enhanceEndpoints({
    addTagTypes: [ApiTagTypes.COACH_ATTENDANCES],
  })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
      ////////////////////////////// Get attendance ////////////////////////////////////////////

      getCoachAttendance: builder.query<
        EntityState<GetAttendance, string>,
        { teamSeasonId: string; sessionId: string } // The query parameters
      >({
        query: ({ teamSeasonId, sessionId }) => ({
          url: `${EndpointPaths.COACH_ATTENDANCES}/teamseasons/${teamSeasonId}/sessions/${sessionId}/attendances`,
          method: 'GET',
        }),

        transformResponse: (response: GetAttendance[]) => {
          return GetAttendanceAdapter.setAll(
            GetAttendanceAdapter.getInitialState(),
            response.map(GetAttendanceSerializer)
          ) as EntityState<GetAttendance, string>;
        },

        providesTags: (result) =>
          providesList(result?.ids, ApiTagTypes.COACH_ATTENDANCES),
      }),

      ////////////////////////////// Post attendance ////////////////////////////////////////////

      createCoachAttendance: builder.mutation<
        PostAttendance, // Define the expected response type
        {
          TeamSeasonId: string;
          SessionId: string;
          attendanceData: Array<{ StudentId: string; Attended: boolean }>; // Define the expected input structure
        }
      >({
        query: ({ TeamSeasonId, SessionId, attendanceData }) => {
          console.log('attendanceData : ', attendanceData);

          return {
            url: `${EndpointPaths.COACH_ATTENDANCES}/teamseasons/${TeamSeasonId}/sessions/${SessionId}/attendances`, // Construct URL with TeamSeasonId and SessionId
            // url: `${EndpointPaths.COACH_ATTENDANCES}/teamseasons/a0qcX000000GEggQAG/sessions/a0pcX0000004gn3QAA/attendances`, // Construct URL with TeamSeasonId and SessionId
            method: 'POST',
            body: attendanceData, // Use the array of attendance objects directly as the body
          };
        },

        transformResponse: (response: PostAttendance) => {
          return PostAttendanceSerializer(response); // Transform the response if necessary
        },

        invalidatesTags: [ApiTagTypes.COACH_ATTENDANCES], // Invalidate relevant cache tags
      }),
    }),
  });

export const { useGetCoachAttendanceQuery, useCreateCoachAttendanceMutation } =
  brandEndpoints;
