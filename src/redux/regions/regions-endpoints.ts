import { EndpointPaths } from '@/interfaces/end-points-paths';
import type { EntityState } from '@reduxjs/toolkit';
import { ApiTagTypes } from '../api-tag-types';
import type { Region } from '@/interfaces/entities/region/regions-entities';
import { apiSlice, providesList } from '../apiSlice';
import { regionAdapter } from '@/api/adaptars/regions/region-adapter';
import { regionSerializer } from '@/serializers/regions/region-serializer';

export const brandEndpoints = apiSlice
  .enhanceEndpoints({
    addTagTypes: [ApiTagTypes.COACH_REGIONS],
  })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
      getCoachRegions: builder.query<EntityState<Region, string>, void>({
        query: () => ({
          url: EndpointPaths.COACH_REGIONS,
          method: 'GET',
        }),

        transformResponse: (response: Region[]) => {
          return regionAdapter.setAll(
            regionAdapter.getInitialState(),
            response.map(regionSerializer)
          ) as EntityState<Region, string>;
        },

        providesTags: (result) =>
          providesList(result?.ids, ApiTagTypes.COACH_REGIONS),
      }),
    }),
  });

export const { useGetCoachRegionsQuery } = brandEndpoints;
