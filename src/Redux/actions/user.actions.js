import { PHONE_AUTH_CONFIRMATION, USER_LOGIN, USER_LOGOUT, UPDATE_FIRSTTIME } from '../constants';

export function loginUser(user) {
    return {
        type: USER_LOGIN,
        payload: user
    }
}

export function logOutUser() {
    return {
        type: USER_LOGOUT,
        payload: null,
    }
}

export function setPhoneAuthConfirmation(confirmation) {
    return {
        type: PHONE_AUTH_CONFIRMATION,
        payload: confirmation
    }
}

export function updateFirstTimeLoggedIn() {
    return {
        type: UPDATE_FIRSTTIME,
        payload: null,
    }
}