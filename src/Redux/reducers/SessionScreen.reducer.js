import { SEASONTITLE_CHANGE } from '../constants';
import { COACHREGION_CHANGE } from '../constants';
const initialState = {
    title:"Sessions",
    region:null,
};
const sessionscreenReducer = (state = initialState, action) => {
    switch(action.type) {
        case SEASONTITLE_CHANGE:
            return {...state, title:action.payload};
        case COACHREGION_CHANGE:
            return {...state, region:action.payload};
        default:
            return state;
    }
}
export default sessionscreenReducer;