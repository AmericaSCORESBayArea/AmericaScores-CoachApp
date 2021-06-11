import { UNSAVED_ATTENDANCE, UPDATE_UNSAVED_ATTENDANCE } from '../constants';

const initialState = { sessionsAttendance: [] };

const AttendanceReducer = (state = initialState, action) => {
    switch(action.type) {
        case UNSAVED_ATTENDANCE:
            console.log("redux",action.payload)
            return { ...state, sessionsAttendance: action.payload};
        /*case UPDATE_UNSAVED_ATTENDANCE:
            const index = state.sessions.findIndex(session => session.TeamSeasonId !== action.payload.teamSeasonId) 
            const newSessions = [...state.sessions];
            newSessions[index].Enrollments = action.payload.enrollments;

            return { ...state, sessions: newSessions }*/
        default:
            return state;
    }
}
export default AttendanceReducer;