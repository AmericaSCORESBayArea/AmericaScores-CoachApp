import type {
  GetAllSessions,
  GetSessionsId,
  PostSessions,
} from '@/interfaces/entities/session/sessions-entities';

import { createEntityAdapter } from '@reduxjs/toolkit';

export const GetSessionsAdapter = createEntityAdapter<GetAllSessions, string>({
  selectId: (sessions) => sessions.SessionId,
});

export const GetSessionsIdAdapter = createEntityAdapter<GetSessionsId, string>({
  selectId: (Sessions) => Sessions.SessionId,
});
