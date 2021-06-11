import { UNSAVED_ATTENDANCE, UPDATE_UNSAVED_ATTENDANCE } from '../constants';

export function UnsavedAttendance(sessionsAttendance) {
    return {
        type: UNSAVED_ATTENDANCE,
        payload: sessionsAttendance
    }
}

export function UpdateUnsavedAttendance(session) {
    return {
        type: UPDATE_UNSAVED_ATTENDANCE,
        payload: session,
    }
}
