import { SEASONTITLE_CHANGE } from '../constants';

const initialState = {
    title:"Sessions"
};
const sessionscreenReducer = (state = initialState, action) => {
    switch(action.type) {
        case SEASONTITLE_CHANGE:
            return {...state, title:action.payload};
        default:
            return state;
    }
}
export default sessionscreenReducer;