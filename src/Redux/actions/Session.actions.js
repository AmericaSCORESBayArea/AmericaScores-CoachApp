import { SYNC, UPDATE_ATTENDANCE, SYNC_SESSIONS_TAB } from "../constants";

export function syncSessions(sessions) {
  return {
    type: SYNC,
    payload: sessions,
  };
}

export function syncSessions_SessionTab(sessions_tab) {
  return {
    type: SYNC_SESSIONS_TAB,
    payload: sessions_tab,
  };
}

export function updateSession(session) {
  return {
    type: UPDATE_ATTENDANCE,
    payload: session,
  };
}
