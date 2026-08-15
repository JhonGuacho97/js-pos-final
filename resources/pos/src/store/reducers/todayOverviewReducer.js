import { todayOverviewActionType } from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case todayOverviewActionType.TODAY_OVERVIEW:
            return action.payload;
        default:
            return state;
    }
};
