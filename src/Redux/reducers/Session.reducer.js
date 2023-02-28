import { SYNC, UPDATE_ATTENDANCE, SYNC_SESSIONS_TAB } from "../constants";

const initialState = { sessions: [], sessions_tab: [] };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SYNC:
      return { ...state, sessions: action.payload };
    case SYNC_SESSIONS_TAB:
      return { ...state, sessions_tab: action.payload };
    case UPDATE_ATTENDANCE:
      const index = state.sessions.findIndex(
        (session) => session.TeamSeasonId !== action.payload.teamSeasonId
      );
      const newSessions = [...state.sessions];
      newSessions[index].Enrollments = action.payload.enrollments;

      return { ...state, sessions: newSessions };
    default:
      return state;
  }
};
export default sessionReducer;
