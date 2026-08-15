import {topCustomersActionType} from '../../constants';

export default (state = { items: [], total: 0 }, action) => {
    switch (action.type) {
        case topCustomersActionType.FETCH_STOCK_ALERT:
            return action.payload;
        default:
            return state;
    }
};
