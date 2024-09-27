import type {
  Sessions,
  SessionsId,
  SessionsIdDelete,
  SessionsIdPatch,
  SessionsPost,
} from '@/interfaces/entities/session/sessions-entities';

export function sessionsSerializer(sessions: Sessions): Sessions {
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

export function sessionsIdSerializer(sessions: SessionsId): SessionsId {
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

export function sessionsPostSerializer(sessions: SessionsPost): SessionsPost {
  const { SessionId } = sessions;

  return {
    SessionId,
  };
}
export function sessionsIdPatchSerializer(
  sessions: SessionsIdPatch
): SessionsIdPatch {
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
export function sessionsIdDeleteSerializer(
  sessions: SessionsIdDelete
): SessionsIdDelete {
  const { SessionId } = sessions;

  return {
    SessionId,
  };
}
