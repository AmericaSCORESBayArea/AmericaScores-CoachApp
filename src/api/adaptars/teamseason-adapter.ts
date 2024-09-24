import type { TeamSeason } from '@/interfaces/entities/team-season/team-season';
import { createEntityAdapter } from '@reduxjs/toolkit';

export const teamSeasonsAdapter = createEntityAdapter<TeamSeason, string>({
  selectId: (teamSeason) => teamSeason.TeamSeasonId,
});
