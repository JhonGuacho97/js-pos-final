import { salesHeatmapActionType } from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case salesHeatmapActionType.SALES_HEATMAP:
            return action.payload;
        default:
            return state;
    }
};
