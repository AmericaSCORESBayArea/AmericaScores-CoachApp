import { EndpointPaths } from '@/interfaces/end-points-paths';
import type { EntityState } from '@reduxjs/toolkit';
import { ApiTagTypes } from '../api-tag-types';
import type { GetRegion } from '@/interfaces/entities/region/regions-entities';
import { apiSlice, providesList } from '../apiSlice';
import { GetRegionAdapter } from '@/api/adaptars/regions/region-adapter';
import { GetRegionSerializer } from '@/serializers/regions/region-serializer';

export const brandEndpoints = apiSlice
  .enhanceEndpoints({
    addTagTypes: [ApiTagTypes.COACH_REGIONS],
  })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
      getCoachRegions: builder.query<
        EntityState<GetRegion, string>,
        { coachId: string }
      >({
        query: ({ coachId }) => ({
          url: `${EndpointPaths.COACH_REGIONS}/${coachId}/regions`,
          method: 'GET',
        }),

        transformResponse: (response: GetRegion[]) => {
          return GetRegionAdapter.setAll(
            GetRegionAdapter.getInitialState(),
            response.map(GetRegionSerializer)
          ) as EntityState<GetRegion, string>;
        },

        providesTags: (result) =>
          providesList(result?.ids, ApiTagTypes.COACH_REGIONS),
      }),
    }),
  });

export const { useGetCoachRegionsQuery } = brandEndpoints;
