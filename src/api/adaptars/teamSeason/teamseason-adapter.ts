import type { GetTeamSeason } from '@/interfaces/entities/team-season/team-season-entities';
import { createEntityAdapter } from '@reduxjs/toolkit';

export const GetTeamSeasonsAdapter = createEntityAdapter<GetTeamSeason, string>(
  {
    selectId: (teamSeason) => teamSeason.TeamSeasonId,
  }
);
