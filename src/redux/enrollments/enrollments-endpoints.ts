import { EndpointPaths } from '@/interfaces/end-points-paths';
import type { EntityState } from '@reduxjs/toolkit';
import { ApiTagTypes } from '../api-tag-types';
import { apiSlice, providesList } from '../apiSlice';
import type {
  GetEnrollments,
  GetEnrollmentsId,
  PatchEnrollmentsId,
  PostEnrollments,
} from '@/interfaces/entities/enrollments/enrollments-entities';
import {
  GetEnrollmentsIdSerializer,
  GetEnrollmentsSerializer,
  PatchEnrollmentsIdSerializer,
  PostEnrollmentsSerializer,
} from '@/serializers/enrollments/enrollments-serializer';
import {
  GetEnrollmentsAdapter,
  GetEnrollmentsIdAdapter,
} from '@/api/adaptars/enrollments/enrollments-adapter';

export const brandEndpoints = apiSlice
  .enhanceEndpoints({
    addTagTypes: [ApiTagTypes.COACH_ENROLLMENTS],
  })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
      ////////////////////////////// Get Enrollments ////////////////////////////////////////////

      getCoachEnrollments: builder.query<
        EntityState<GetEnrollments, string>,
        { teamSeasonId: string }
      >({
        query: ({ teamSeasonId }) => ({
          url: `${EndpointPaths.COACH_ENROLLMENTS}?teamSeasonId=${teamSeasonId}`,
          method: 'GET',
        }),

        transformResponse: (response: GetEnrollments[]) => {
          return GetEnrollmentsAdapter.setAll(
            GetEnrollmentsAdapter.getInitialState(),
            response.map(GetEnrollmentsSerializer)
          ) as EntityState<GetEnrollments, string>;
        },

        providesTags: (result) =>
          providesList(result?.ids, ApiTagTypes.COACH_ENROLLMENTS),
      }),

      ////////////////////////////// Post Enrollments ////////////////////////////////////////////

      createCoachEnrollments: builder.mutation<
        PostEnrollments,
        {
          TeamSeasonId: string;
          StudentId: string;
          StartDate?: string;
          EndDate?: string;
        }
      >({
        query: (newEnrollment) => {
          console.log('newEnrollment: ', newEnrollment);

          return {
            url: EndpointPaths.COACH_ENROLLMENTS,
            method: 'POST',
            body: newEnrollment,
          };
        },

        transformResponse: (response: PostEnrollments) => {
          return PostEnrollmentsSerializer(response);
        },

        invalidatesTags: [ApiTagTypes.COACH_ENROLLMENTS],
      }),
      ////////////////////////////// Delete Enrollments ////////////////////////////////////////////
      deleteCoachEnrollments: builder.mutation<
        void, // No return value on delete
        { EnrollmentId: string } // Type for the body
      >({
        query: ({ EnrollmentId }) => ({
          url: `${EndpointPaths.COACH_ENROLLMENTS}`,
          method: 'DELETE',
          body: [{ EnrollmentId }], // Send EnrollmentId as an array of objects
        }),
        invalidatesTags: [ApiTagTypes.COACH_ENROLLMENTS], // Invalidate the cache
      }),

      ////////////////////////////// Get EnrollmentsId ////////////////////////////////////////////

      getCoachEnrollmentsId: builder.query<
        EntityState<GetEnrollmentsId, string>,
        { enrollmentId: string }
      >({
        query: ({ enrollmentId }) => ({
          url: `${EndpointPaths.COACH_ENROLLMENTS}/${enrollmentId}`,
          method: 'GET',
        }),

        transformResponse: (response: GetEnrollmentsId[]) => {
          return GetEnrollmentsIdAdapter.setAll(
            GetEnrollmentsIdAdapter.getInitialState(),
            response.map(GetEnrollmentsIdSerializer)
          ) as EntityState<GetEnrollmentsId, string>;
        },

        providesTags: (result) =>
          providesList(result?.ids, ApiTagTypes.COACH_ENROLLMENTS),
      }),
      ////////////////////////////// Update Enrollments by Enrollment ID ////////////////////////////////////////////

      updateCoachEnrollmentsId: builder.mutation<
        PatchEnrollmentsId,
        {
          EnrollmentId: string;
          EnrollmentName?: string;
          TeamSeasonId?: string;
          StudentId?: string;
          StudentName?: string;
          FirstName?: string;
          LastName?: string;
          Birthdate?: string;
          Gender?: string;
          Ethnicity?: string;
          ZipCode?: string;
        }
      >({
        query: ({ EnrollmentId, ...enrollmentPatch }) => {
          console.log('PatchSessionsId: ', EnrollmentId, enrollmentPatch);

          return {
            url: `${EndpointPaths.COACH_ENROLLMENTS}/${EnrollmentId}`,
            method: 'PATCH',
            body: {
              ...enrollmentPatch,
            },
          };
        },

        transformResponse: (response: PatchEnrollmentsId) => {
          console.log('res : ', response);

          return PatchEnrollmentsIdSerializer(response);
        },

        invalidatesTags: [ApiTagTypes.COACH_ENROLLMENTS],
      }),
    }),
  });

export const {
  useGetCoachEnrollmentsQuery,
  useCreateCoachEnrollmentsMutation,
  useDeleteCoachEnrollmentsMutation,
  useGetCoachEnrollmentsIdQuery,
  useUpdateCoachEnrollmentsIdMutation,
} = brandEndpoints;
