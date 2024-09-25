import type { Sessions } from '@/interfaces/entities/session/sessions-entities';

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
