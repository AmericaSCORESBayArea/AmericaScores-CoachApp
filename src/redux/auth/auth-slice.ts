import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface AuthState {
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state: AuthState, action: PayloadAction<AuthState>) => {
      const { isLoggedIn } = action.payload;
      state.isLoggedIn = isLoggedIn;
      AsyncStorage.setItem('userCredentials', JSON.stringify(action.payload));
    },
    logOut: (state: AuthState) => {
      state.isLoggedIn = false;
      AsyncStorage.removeItem('userCredentials');
      AsyncStorage.removeItem('userDetails');
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
