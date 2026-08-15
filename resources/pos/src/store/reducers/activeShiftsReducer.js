import { activeShiftsActionType } from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case activeShiftsActionType.ACTIVE_SHIFTS:
            return action.payload;
        default:
            return state;
    }
};
