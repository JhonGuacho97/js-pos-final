import {toastType} from '../../constants';

export default (state = [], action) => {
    const { type, payload } = action;
    switch (type) {
        case toastType.ADD_TOAST:
            // React Toastify administra la vida visual del aviso. No conservamos
            // copias cerradas en Redux porque terminaban acumulándose por sesión.
            return state;
        case toastType.REMOVE_TOAST:
            return state.filter(toast => toast.id !== payload);
        default:
            return state;
    }
};
