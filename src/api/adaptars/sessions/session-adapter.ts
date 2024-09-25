import type { Sessions } from '@/interfaces/entities/session/sessions-entities';

import { createEntityAdapter } from '@reduxjs/toolkit';

export const sessionsAdapter = createEntityAdapter<Sessions, string>({
  selectId: (sessions) => sessions.SessionId,
});
