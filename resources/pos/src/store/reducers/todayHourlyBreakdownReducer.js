import { todayHourlyBreakdownActionType } from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case todayHourlyBreakdownActionType.TODAY_HOURLY_BREAKDOWN:
            return action.payload;
        default:
            return state;
    }
};
