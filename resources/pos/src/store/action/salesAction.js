import apiConfig from "../../config/apiConfig";
import { apiBaseURL, saleActionType, toastType } from "../../constants";
import { addToast } from "./toastAction";
import {
    addInToTotalRecord,
    removeFromTotalRecord,
    setTotalRecord,
} from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import requestParam from "../../shared/requestParam";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { callSaleApi } from "./saleApiAction";
import { setSavingButton } from "./saveButtonAction";

export const fetchSales =
    (filter = {}, isLoading = true) =>
        async (dispatch) => {
            if (isLoading) {
                dispatch(setLoading(true));
            }
            const admin = filter.user_id ? undefined : true;
            let url = apiBaseURL.SALES;
            if (
                !_.isEmpty(filter) &&
                (
                    filter.page ||
                    filter.pageSize ||
                    filter.user_id ||
                    filter.search ||
                    filter.order_By ||
                    filter.created_at ||
                    filter.customer_id
                )
            ) {
                url += requestParam(filter, admin, null, null, url);
            }
            await apiConfig
                .get(url)
                .then((response) => {
                    dispatch({
                        type: saleActionType.FETCH_SALES,
                        payload: response.data.data,
                    });
                    dispatch({
                        type: saleActionType.FETCH_SALE_TOTALS,
                        payload: response.data.meta?.totals || {},
                    });
                    dispatch(
                        setTotalRecord(
                            response.data.meta.total !== undefined &&
                                response.data.meta.total >= 0
                                ? response.data.meta.total
                                : response.data.data.total
                        )
                    );
                    dispatch(callSaleApi(false));
                    if (isLoading) {
                        dispatch(setLoading(false));
                    }
                })
                .catch(({ response }) => {
                    dispatch(
                        addToast({
                            text: response.data.message,
                            type: toastType.ERROR,
                        })
                    );
                });
        };

export const fetchSale =
    (saleId, singleSale, isLoading = true) =>
        async (dispatch) => {
            if (isLoading) {
                dispatch(setLoading(true));
            }
            await apiConfig
                .get(apiBaseURL.SALES + "/" + saleId + "/edit", singleSale)
                .then((response) => {
                    dispatch({
                        type: saleActionType.FETCH_SALE,
                        payload: response.data.data,
                    });
                    if (isLoading) {
                        dispatch(setLoading(false));
                    }
                })
                .catch(({ response }) => {
                    dispatch(
                        addToast({
                            text: response.data.message,
                            type: toastType.ERROR,
                        })
                    );
                });
        };

export const addSale = (sale, navigate, emitirFacturaSri = false) => async (dispatch) => {
    dispatch(setSavingButton(true));
    await apiConfig
        .post(apiBaseURL.SALES, sale)
        .then((response) => {
            dispatch({
                type: saleActionType.ADD_SALE,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage("sale.success.create.message"),
                })
            );
            dispatch(addInToTotalRecord(1));

            // Si el usuario activó el switch de factura electrónica, la
            // disparamos en segundo plano (no bloquea la navegación).
            if (emitirFacturaSri && response.data.data?.id) {
                const ventaId = response.data.data.id;
                apiConfig
                    .post(`sales/${ventaId}/electronic-invoice/emitir`)
                    .then(() => {
                        dispatch(
                            addToast({
                                text: "Factura electrónica en proceso. Revisa el estado en la lista de ventas.",
                            })
                        );
                    })
                    .catch(({ response: errResponse }) => {
                        dispatch(
                            addToast({
                                text: errResponse?.data?.message || "Error al emitir la factura electrónica",
                                type: toastType.ERROR,
                            })
                        );
                    });
            }

            navigate("/app/sales");
            dispatch(setSavingButton(false));
        })
        .catch(({ response }) => {
            dispatch(setSavingButton(false));
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const editSale = (saleId, sale, navigate) => async (dispatch) => {
    dispatch(setSavingButton(true));
    await apiConfig
        .patch(apiBaseURL.SALES + "/" + saleId, sale)
        .then((response) => {
            dispatch(
                addToast({
                    text: getFormattedMessage("sale.success.edit.message"),
                })
            );
            navigate("/app/sales");
            dispatch({
                type: saleActionType.EDIT_SALE,
                payload: response.data.data,
            });
            dispatch(setSavingButton(false));
        })
        .catch(({ response }) => {
            dispatch(setSavingButton(false));
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const deleteSale = (userId) => async (dispatch) => {
    await apiConfig
        .delete(apiBaseURL.SALES + "/" + userId)
        .then(() => {
            dispatch(removeFromTotalRecord(1));
            dispatch({ type: saleActionType.DELETE_SALE, payload: userId });
            dispatch(
                addToast({
                    text: getFormattedMessage("sale.success.delete.message"),
                })
            );
        })
        .catch(({ response }) => {
            response &&
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
        });
};
