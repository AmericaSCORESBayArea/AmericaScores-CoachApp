import type { TeamSeason } from '@/interfaces/entities/team-season/team-season';

export function teamSeasonSerializer(teamseason: TeamSeason): TeamSeason {
  const {
    SeasonStartDate,
    TotalNoOfSessions,
    CoachWriting,
    Partnership,
    SeasonName,
    TotalNoOfPlayers,
    TeamSeasonName,
    CoachSoccer,
    TeamSeasonId,
    TeamName,
    SchoolSite,
    SeasonEndDate,
    ScoresProgramManager,
    ProgramCoordinator,
    Region,
    SeasonId,
  } = teamseason;

  return {
    SeasonStartDate,
    TotalNoOfSessions,
    CoachWriting,
    Partnership,
    SeasonName,
    TotalNoOfPlayers,
    TeamSeasonName,
    CoachSoccer,
    TeamSeasonId,
    TeamName,
    SchoolSite,
    SeasonEndDate,
    ScoresProgramManager,
    ProgramCoordinator,
    Region,
    SeasonId,
  };
}
