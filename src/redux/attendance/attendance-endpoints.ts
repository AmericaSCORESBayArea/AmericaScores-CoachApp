import { EndpointPaths } from '@/interfaces/end-points-paths';

import { ApiTagTypes } from '../api-tag-types';
import { apiSlice, providesList } from '../apiSlice';

import type {
  GetAttendance,
  PatchAttendance,
  PostAttendance,
} from '@/interfaces/entities/attendance/attendance-entities';

import {
  GetAttendanceSerializer,
  PatchAttendanceSerializer,
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

      ////////////////////////////// Patch Attendance ////////////////////////////////////////////

      patchCoachAttendance: builder.mutation<
        PatchAttendance,
        {
          TeamSeasonId: string;
          SessionId: string;
          attendancePatchData: Array<{
            AttendanceId: string;
            Attended: boolean;
          }>;
        }
      >({
        query: ({ TeamSeasonId, SessionId, attendancePatchData }) => {
          return {
            url: `${EndpointPaths.COACH_ATTENDANCES}/teamseasons/${TeamSeasonId}/sessions/${SessionId}/attendances`,
            method: 'PATCH', // Use PATCH method for updating
            body: attendancePatchData, // Only send the fields that need to be updated
          };
        },

        transformResponse: (response: PatchAttendance) => {
          return PatchAttendanceSerializer(response);
        },

        invalidatesTags: [ApiTagTypes.COACH_ATTENDANCES],
      }),
    }),
  });

export const {
  useGetCoachAttendanceQuery,
  useCreateCoachAttendanceMutation,
  usePatchCoachAttendanceMutation,
} = brandEndpoints;
