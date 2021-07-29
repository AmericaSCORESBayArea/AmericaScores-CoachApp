import { SEASONTITLE_CHANGE } from '../constants';
import { COACHREGION_CHANGE } from '../constants';
export function changeTitle(title) {
    return {
        type: SEASONTITLE_CHANGE,
        payload: title,
    }
}
export function changeRegion(region) {
    return {
        type: COACHREGION_CHANGE,
        payload: region,
    }
}