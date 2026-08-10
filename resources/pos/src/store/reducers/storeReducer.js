import { storeActionType, Tokens } from '../../constants';

const initialState = {
    stores: [],
    currentStoreId: localStorage.getItem(Tokens.CURRENT_STORE_ID) || null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case storeActionType.FETCH_MY_STORES:
            return { ...state, stores: action.payload };
        case storeActionType.SET_CURRENT_STORE_ID:
            return { ...state, currentStoreId: action.payload };
        default:
            return state;
    }
};
