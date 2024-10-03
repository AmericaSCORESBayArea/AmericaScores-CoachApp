import type {
  GetSessions,
  GetSessionsId,
  PostSessions,
} from '@/interfaces/entities/session/sessions-entities';

import { createEntityAdapter } from '@reduxjs/toolkit';

export const GetSessionsAdapter = createEntityAdapter<GetSessions, string>({
  selectId: (sessions) => sessions.SessionId,
});

export const GetSessionsIdAdapter = createEntityAdapter<GetSessionsId, string>({
  selectId: (Sessions) => Sessions.SessionId,
});
