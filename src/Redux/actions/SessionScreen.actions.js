import { SEASONTITLE_CHANGE } from '../constants';

export function changeTitle(title) {
    return {
        type: SEASONTITLE_CHANGE,
        payload: title,
    }
}