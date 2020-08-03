import { SYNC } from '../constants';

const initialState = { sessions: [] };

const sessionReducer = (state = initialState, action) => {
    switch(action.type) {
        case SYNC:
            return { ...state, sessions: action.payload};
        default:
            return state;
    }
}
export default sessionReducer;