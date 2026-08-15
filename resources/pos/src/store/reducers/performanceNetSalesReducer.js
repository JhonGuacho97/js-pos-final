import { performanceNetSalesActionType } from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case performanceNetSalesActionType.PERFORMANCE_NET_SALES:
            return action.payload;
        default:
            return state;
    }
};
