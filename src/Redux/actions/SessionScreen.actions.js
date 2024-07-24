import {
  SEASONTITLE_CHANGE,
  USER_FIRST_TIME,
  USER_FIRST_TIME_MODAL,
} from "../constants";
import { TEAMNAMETITLE_CHANGE } from "../constants";
import { COACHREGION_CHANGE } from "../constants";
import { REGIONS_LIST } from "../constants";
import { UPDATE_APP } from "../constants";
export function changeTitle(title) {
  return {
    type: SEASONTITLE_CHANGE,
    payload: title,
  };
}
export function changeRegion(region) {
  return {
    type: COACHREGION_CHANGE,
    payload: region,
  };
}
export function isUserFirstTime(flag) {
  return {
    type: USER_FIRST_TIME,
    payload: flag,
  };
}
export function showFirstTimeModal(flag) {
  return {
    type: USER_FIRST_TIME_MODAL,
    payload: flag,
  };
}
export function changeTitleTeam(teamname) {
  return {
    type: TEAMNAMETITLE_CHANGE,
    payload: teamname,
  };
}
export function changeRegionList(listofregions) {
  return {
    type: REGIONS_LIST,
    payload: listofregions,
  };
}
export function changeUpdateApp(flagUpdate) {
  return {
    type: UPDATE_APP,
    payload: flagUpdate,
  };
}
