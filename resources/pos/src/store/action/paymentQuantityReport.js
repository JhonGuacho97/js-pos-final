import { setLoading } from "./loadingAction";
import { apiBaseURL, productQuantityReportActionType } from "../../constants";
import apiConfig from "../../config/apiConfig";
import { setTotalRecord } from "./totalRecordAction";
import requestParam from "../../shared/requestParam";

export const productQuantityReportAction =
    (id, filter = {}, isLoading = true, setTotalRecords) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url =
            apiBaseURL.PRODUCT_STOCK_REPORT + `${id !== null ? "/" + id : ""}`;
        if (!_.isEmpty(filter) && (filter.page || filter.pageSize)) {
            url += requestParam(filter, false, false, true, url);
        }
        await apiConfig
            .get(url)
            .then((response) => {
                dispatch({
                    type: productQuantityReportActionType.QUANTITY_REPORT,
                    payload: response.data.data || [],
                });
                dispatch(
                    setTotalRecord(
                        response.data.meta?.total ?? response.data.summary?.total ?? 0
                    )
                );
                if (typeof setTotalRecords === "function") {
                    setTotalRecords(response.data.summary?.total ?? response.data.meta?.total ?? 0);
                }
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            })
            .catch(({ response }) => {
                // dispatch(addToast(
                //     {text: response.data.message, type: toastType.ERROR}));
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            });
    };
