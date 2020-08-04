import { SYNC, UPDATE_ATTENDANCE } from '../constants';

export function syncSessions(sessions) {
    return {
        type: SYNC,
        payload: sessions
    }
}

export function updateSession(session) {
    return {
        type: UPDATE_ATTENDANCE,
        payload: session,
    }
}
