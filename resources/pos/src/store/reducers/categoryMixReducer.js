import { categoryMixActionType } from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case categoryMixActionType.CATEGORY_MIX:
            return action.payload;
        default:
            return state;
    }
};
