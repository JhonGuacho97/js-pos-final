import { topProductsActionType } from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case topProductsActionType.TOP_PRODUCTS:
            return action.payload;
        default:
            return state;
    }
};
