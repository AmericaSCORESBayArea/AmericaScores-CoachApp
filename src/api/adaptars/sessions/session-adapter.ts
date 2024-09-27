import type {
  Sessions,
  SessionsId,
  SessionsIdDelete,
  SessionsIdPatch,
} from '@/interfaces/entities/session/sessions-entities';

import { createEntityAdapter } from '@reduxjs/toolkit';

export const sessionsAdapter = createEntityAdapter<Sessions, string>({
  selectId: (sessions) => sessions.SessionId,
});
export const sessionsPostAdapter = createEntityAdapter<SessionsId, string>({
  selectId: (Sessions) => Sessions.SessionId,
});

export const sessionsIdAdapter = createEntityAdapter<SessionsId, string>({
  selectId: (Sessions) => Sessions.SessionId,
});
export const sessionsIdPatchAdapter = createEntityAdapter<
  SessionsIdPatch,
  string
>({
  selectId: (Sessions) => Sessions.SessionId,
});

export const sessionsIdDeleteAdapter = createEntityAdapter<
  SessionsIdDelete,
  string
>({
  selectId: (Sessions) => Sessions.SessionId,
});
