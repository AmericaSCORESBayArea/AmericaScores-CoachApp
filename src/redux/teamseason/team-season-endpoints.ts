import { EndpointPaths } from '@/interfaces/end-points-paths';
import type { EntityState } from '@reduxjs/toolkit';
import { ApiTagTypes } from '../api-tag-types';
import { apiSlice, providesList } from '../apiSlice';
import type { TeamSeason } from '@/interfaces/entities/team-season/team-season-entities';
import { teamSeasonsAdapter } from '@/api/adaptars/teamSeason/teamseason-adapter';
import { teamSeasonSerializer } from '@/serializers/team-season/team-season-serializer';

export const brandEndpoints = apiSlice
  .enhanceEndpoints({
    addTagTypes: [ApiTagTypes.TEAM_SEASON],
  })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
      getTeamSeason: builder.query<EntityState<TeamSeason, string>, void>({
        query: () => ({
          url: EndpointPaths.TEAM_SEASON,
          method: 'GET',
        }),
        transformResponse: (response: TeamSeason[]) =>
          teamSeasonsAdapter.setAll(
            teamSeasonsAdapter.getInitialState(),
            response.map(teamSeasonSerializer)
          ) as EntityState<TeamSeason, string>,
        providesTags: (result) =>
          providesList(result?.ids, ApiTagTypes.TEAM_SEASON),
      }),
    }),
  });

export const { useGetTeamSeasonQuery } = brandEndpoints;
