import { storesActionType } from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case storesActionType.FETCH_STORES:
            return action.payload;
        case storesActionType.ADD_STORE:
            return [action.payload, ...state];
        case storesActionType.EDIT_STORE:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case storesActionType.DELETE_STORE:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};
