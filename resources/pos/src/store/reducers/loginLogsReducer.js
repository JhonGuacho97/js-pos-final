import { loginLogsActionType } from "../../constants";

const initialState = {
    loginLogs: [],
};

const loginLogsReducer = (state = initialState, action) => {
    switch (action.type) {
        case loginLogsActionType.FETCH_LOGIN_LOGS_REQUEST:
            return {
                ...state,
            };

        case loginLogsActionType.FETCH_LOGIN_LOGS_SUCCESS:
            return {
                ...state,
                loginLogs: action.payload, // 👈 aquí guardas los datos
            };

        case loginLogsActionType.FETCH_LOGIN_LOGS_FAILURE:
            return {
                ...state,
                loginLogs: [],
            };

        case loginLogsActionType.DELETE_LOGIN_LOG:
            return {
                ...state,
                loginLogs: state.loginLogs.filter(
                    (log) => log.id !== action.payload
                ),
            };

        case loginLogsActionType.BULK_DELETE_LOGIN_LOGS:
            return {
                ...state,
                loginLogs: state.loginLogs.filter(
                    (log) => !action.payload.includes(log.id)
                ),
            };

        default:
            return state;
    }
};

export default loginLogsReducer;