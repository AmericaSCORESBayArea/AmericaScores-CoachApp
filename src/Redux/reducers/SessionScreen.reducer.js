import { SEASONTITLE_CHANGE } from '../constants';
import { COACHREGION_CHANGE } from '../constants';
import { TEAMNAMETITLE_CHANGE } from '../constants';
import { REGIONS_LIST } from '../constants';
const initialState = {
    title:"Sessions",
    region:null,
    teamname:"Team Sessions",
    listofregions:null,
};
const sessionscreenReducer = (state = initialState, action) => {
    switch(action.type) {
        case SEASONTITLE_CHANGE:
            return {...state, title:action.payload};
        case COACHREGION_CHANGE:
            return {...state, region:action.payload};
        case TEAMNAMETITLE_CHANGE:
            return {...state, teamname:action.payload};
        case REGIONS_LIST:
            return {...state, listofregions:action.payload};    
        default:
            return state;
    }
}
export default sessionscreenReducer;