import { EndpointPaths } from '@/interfaces/end-points-paths';
import type { EntityState } from '@reduxjs/toolkit';
import { ApiTagTypes } from '../api-tag-types';
import { apiSlice, providesList } from '../apiSlice';
import type { GetTeamSeason } from '@/interfaces/entities/team-season/team-season-entities';
import { GetTeamSeasonsAdapter } from '@/api/adaptars/teamSeason/teamseason-adapter';
import { GetTeamSeasonSerializer } from '@/serializers/team-season/team-season-serializer';

export const brandEndpoints = apiSlice
  .enhanceEndpoints({
    addTagTypes: [ApiTagTypes.TEAM_SEASON],
  })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
      getTeamSeason: builder.query<EntityState<GetTeamSeason, string>, void>({
        query: () => ({
          url: EndpointPaths.TEAM_SEASON,
          method: 'GET',
        }),
        transformResponse: (response: GetTeamSeason[]) =>
          GetTeamSeasonsAdapter.setAll(
            GetTeamSeasonsAdapter.getInitialState(),
            response.map(GetTeamSeasonSerializer)
          ) as EntityState<GetTeamSeason, string>,
        providesTags: (result) =>
          providesList(result?.ids, ApiTagTypes.TEAM_SEASON),
      }),
    }),
  });

export const { useGetTeamSeasonQuery } = brandEndpoints;
