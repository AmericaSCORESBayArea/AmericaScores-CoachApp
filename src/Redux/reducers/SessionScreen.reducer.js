import {
  SEASONTITLE_CHANGE,
  USER_FIRST_TIME,
  USER_FIRST_TIME_MODAL,
} from "../constants";
import { COACHREGION_CHANGE } from "../constants";
import { TEAMNAMETITLE_CHANGE } from "../constants";
import { REGIONS_LIST } from "../constants";
import { UPDATE_APP } from "../constants";
const initialState = {
  title: "Sessions",
  region: null,
  teamname: "Team Sessions",
  updateapp: null,
  isUserFirstTime: false,
  showFirstTimeModal: false,
};
const sessionscreenReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEASONTITLE_CHANGE:
      return { ...state, title: action.payload };
    case COACHREGION_CHANGE:
      return { ...state, region: action.payload };
    case TEAMNAMETITLE_CHANGE:
      return { ...state, teamname: action.payload };
    case REGIONS_LIST:
      return { ...state, listofregions: action.payload };
    case UPDATE_APP:
      return { ...state, updateapp: action.payload };
    case USER_FIRST_TIME:
      return { ...state, isUserFirstTime: action.payload };
    case USER_FIRST_TIME_MODAL:
      return { ...state, showFirstTimeModal: action.payload };
    default:
      return state;
  }
};
export default sessionscreenReducer;
