import type { GetTeamSeason } from '@/interfaces/entities/team-season/team-season-entities';

export function GetTeamSeasonSerializer(
  teamseason: GetTeamSeason
): GetTeamSeason {
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
