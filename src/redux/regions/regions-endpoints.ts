import { EndpointPaths } from '@/interfaces/end-points-paths';
import type { EntityState } from '@reduxjs/toolkit';
import { ApiTagTypes } from '../api-tag-types';
import type { Region } from '@/interfaces/entities/region/region';
import { apiSlice, providesList } from '../apiSlice';
import { regionAdapter } from '@/api/adaptars/region-adapter';
import { regionSerializer } from '@/serializers/regionSerializer';

export const brandEndpoints = apiSlice
  .enhanceEndpoints({
    addTagTypes: [ApiTagTypes.COACH_REGION],
  })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
      getCoachRegions: builder.query<EntityState<Region, string>, void>({
        query: () => ({
          url: EndpointPaths.COACH_REGION,
          method: 'GET',
        }),

        transformResponse: (response: { data: Region[] }) =>
          regionAdapter.setAll(
            regionAdapter.getInitialState(),
            response?.data.map(regionSerializer)
          ) as EntityState<Region, string>,

        providesTags: (result) =>
          providesList(result?.ids, ApiTagTypes.COACH_REGION),
      }),
    }),
  });

export const { useGetCoachRegionsQuery } = brandEndpoints;
