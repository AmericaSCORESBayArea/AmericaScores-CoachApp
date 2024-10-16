import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { GetAllSessions } from '../../interfaces/entities/session/sessions-entities';

// Initial state for all sessions
const initialState = {
  currentSessions: [] as GetAllSessions[], // Current sessions
  pastSessions: [] as GetAllSessions[], // Past sessions
  upComingSessions: [] as GetAllSessions[], // Upcoming sessions
  isLoadingAllSessions: true, // Loading status
  isErrorAllSessions: false, // Error status
};

// Creating the allSessions slice
const allSessionsSlice = createSlice({
  name: 'allSessions',
  initialState,
  reducers: {
    // Action to set current sessions
    setCurrentSessions: (state, action: PayloadAction<GetAllSessions[]>) => {
      state.currentSessions = action.payload;
      state.isLoadingAllSessions = false; // Set loading to false when data is fetched
      state.isErrorAllSessions = false; // Reset error state
    },
    // Action to set past sessions
    setPastSessions: (state, action: PayloadAction<GetAllSessions[]>) => {
      state.pastSessions = action.payload;
      state.isLoadingAllSessions = false; // Set loading to false when data is fetched
      state.isErrorAllSessions = false; // Reset error state
    },
    // Action to set upcoming sessions
    setUpComingSessions: (state, action: PayloadAction<GetAllSessions[]>) => {
      state.upComingSessions = action.payload;
      state.isLoadingAllSessions = false; // Set loading to false when data is fetched
      state.isErrorAllSessions = false; // Reset error state
    },
    // Action to indicate loading state
    setLoading: (state) => {
      state.isLoadingAllSessions = true; // Set loading to true
    },
    // Action to set error state
    setError: (state) => {
      state.isErrorAllSessions = true; // Set error to true
      state.isLoadingAllSessions = false; // Ensure loading is false when there's an error
    },
  },
});

// Action exports
export const {
  setCurrentSessions,
  setPastSessions,
  setUpComingSessions,
  setLoading,
  setError,
} = allSessionsSlice.actions;

// Selector for current sessions
export const selectCurrentSessions = (state: {
  allSessions: { currentSessions: GetAllSessions[] };
}) => state.allSessions.currentSessions;

// Selector for past sessions
export const selectPastSessions = (state: {
  allSessions: { pastSessions: GetAllSessions[] };
}) => state.allSessions.pastSessions;

// Selector for upcoming sessions
export const selectUpComingSessions = (state: {
  allSessions: { upComingSessions: GetAllSessions[] };
}) => state.allSessions.upComingSessions;

// Selector for loading state
export const selectIsLoadingAllSessions = (state: {
  allSessions: { isLoadingAllSessions: boolean };
}) => state.allSessions.isLoadingAllSessions;

// Selector for error state
export const selectIsErrorAllSessions = (state: {
  allSessions: { isErrorAllSessions: boolean };
}) => state.allSessions.isErrorAllSessions;

// Reducer export
export default allSessionsSlice.reducer;
