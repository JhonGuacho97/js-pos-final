import { kardexActionType } from "../action/kardexAction";

const initialState = {
    opening_balance: 0,
    opening_cost: 0,
    rows: [],
    total: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case kardexActionType.FETCH_KARDEX:
            return action.payload;
        case kardexActionType.CLEAR_KARDEX:
            return initialState;
        default:
            return state;
    }
};
