import type {
  GetSessions,
  GetSessionsId,
  DeleteSessionsId,
  PatchSessionsId,
  PostSessions,
} from '@/interfaces/entities/session/sessions-entities';

export function GetSessionsSerializer(sessions: GetSessions): GetSessions {
  const {
    TeamSeasonId,
    SessionId,
    SessionName,
    SessionDate,
    SessionStartTime,
    SessionEndTime,
    SessionTopic,
  } = sessions;

  return {
    TeamSeasonId,
    SessionId,
    SessionName,
    SessionDate,
    SessionStartTime,
    SessionEndTime,
    SessionTopic,
  };
}

export function GetSessionsIdSerializer(
  sessions: GetSessionsId
): GetSessionsId {
  const {
    SessionId,
    SessionName,
    SessionDate,
    SessionStartTime,
    SessionEndTime,
    SessionTopic,
    TeamSeasonId,
    BoysPresent,
    GirlsPresent,
    NonbinaryPresent,
    UnknownPresent,
    UsesHeadcount,
    ProgramType,
  } = sessions;

  return {
    SessionId,
    SessionName,
    SessionDate,
    SessionStartTime,
    SessionEndTime,
    SessionTopic,
    TeamSeasonId,
    BoysPresent,
    GirlsPresent,
    NonbinaryPresent,
    UnknownPresent,
    UsesHeadcount,
    ProgramType,
  };
}

export function PostSessionsSerializer(sessions: PostSessions): PostSessions {
  const { SessionId } = sessions;

  return {
    SessionId,
  };
}
export function PatchSessionsIdSerializer(
  sessions: PatchSessionsId
): PatchSessionsId {
  const {
    SessionId,
    SessionName,
    SessionDate,
    SessionTopic,
    TeamSeasonId,
    Headcount,
    FemaleHeadcount,
  } = sessions;

  return {
    SessionId,
    SessionName,
    SessionDate,
    SessionTopic,
    TeamSeasonId,
    Headcount,
    FemaleHeadcount,
  };
}
export function DeleteSessionsIdSerializer(
  sessions: DeleteSessionsId
): DeleteSessionsId {
  const { SessionId } = sessions;

  return {
    SessionId,
  };
}
