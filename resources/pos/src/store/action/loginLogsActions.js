import { apiBaseURL, loginLogsActionType, toastType } from "../../constants";
import requestParam from "../../shared/requestParam";
import { setLoading } from "./loadingAction";
import { setTotalRecord } from "./totalRecordAction";
import { addToast } from "./toastAction";
import _ from "lodash";
import apiConfig from "../../config/apiConfig";

export const fetchLoginLogs =
    (filter = {}, isLoading = true) =>
        async (dispatch) => {
            if (isLoading) {
                dispatch(setLoading(true));
            }

            let url = apiBaseURL.LOGIN_LOGS;

            if (
                !_.isEmpty(filter) &&
                (filter.page ||
                    filter.pageSize ||
                    filter.search ||
                    filter.order_By ||
                    filter.status)
            ) {
                url += requestParam(filter, null, null, null, url);
            }

            apiConfig
                .get(url)
                .then((response) => {
                    dispatch({
                        type: loginLogsActionType.FETCH_LOGIN_LOGS_SUCCESS,
                        payload: response.data.data,
                    });
                    dispatch(
                        setTotalRecord(response.data.total)
                    );
                    if (isLoading) {
                        dispatch(setLoading(false));
                    }
                })
                .catch(({ response }) => {
                    console.error("Error:", response);
                    dispatch({
                        type: loginLogsActionType.FETCH_LOGIN_LOGS_FAILURE,
                    });
                });
        };

export const deleteLoginLog = (id) => async (dispatch) => {
    apiConfig
        .delete(`${apiBaseURL.LOGIN_LOGS}/${id}`)
        .then((response) => {
            dispatch({
                type: loginLogsActionType.DELETE_LOGIN_LOG,
                payload: id,
            });
            dispatch(
                addToast({
                    text: response.data.message,
                    type: toastType.SUCCESS,
                })
            );
        })
        .catch(({ response }) => {
            const message =
                response?.data?.message || "No se pudo eliminar el registro.";
            dispatch(addToast({ text: message, type: toastType.ERROR }));
        });
};

export const bulkDeleteLoginLogs = (ids) => async (dispatch) => {
    apiConfig
        .delete(`${apiBaseURL.LOGIN_LOGS}/bulk-delete`, { data: { ids } })
        .then((response) => {
            dispatch({
                type: loginLogsActionType.BULK_DELETE_LOGIN_LOGS,
                payload: ids,
            });
            dispatch(
                addToast({
                    text: response.data.message,
                    type: toastType.SUCCESS,
                })
            );
        })
        .catch(({ response }) => {
            const message =
                response?.data?.message ||
                "No se pudieron eliminar los registros seleccionados.";
            dispatch(addToast({ text: message, type: toastType.ERROR }));
        });
};