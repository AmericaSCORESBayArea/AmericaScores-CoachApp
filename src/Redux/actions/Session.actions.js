import { SYNC } from '../constants';

export function syncSessions(sessions) {
    return {
        type: SYNC,
        payload: sessions
    }
}
