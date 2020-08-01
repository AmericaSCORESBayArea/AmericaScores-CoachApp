import { USER_LOGIN, USER_LOGOUT, PHONE_AUTH_CONFIRMATION } from '../constants';

const initialState = { user: null, logged: false };

const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case USER_LOGIN:
            return { ...state, user: action.payload, logged: true };
        case USER_LOGOUT:
            return { ...state, user: null, logged: false};
        case PHONE_AUTH_CONFIRMATION:
            return { ...state, confirmation: action.payload }
        default:
            return state;
    }
}
export default userReducer;