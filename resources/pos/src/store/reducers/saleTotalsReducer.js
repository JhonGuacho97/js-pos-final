import { saleActionType } from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case saleActionType.FETCH_SALE_TOTALS:
            return action.payload;
        default:
            return state;
    }
};
