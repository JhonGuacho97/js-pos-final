import {Tokens, errorMessage} from '../constants';
import {environment} from './environment'

export default {
    // El parámetro `isToken` (siempre true en los 3 call sites reales:
    // apiConfig.js, apiConfigWithoutToken.js, apiConfigWthFormData.js)
    // quedaba shadowed por un `let isToken` local para el resto de la
    // función -- por Temporal Dead Zone, el `if (isToken) return config`
    // de abajo referenciaba esa variable local (no el parámetro), lo cual
    // revienta con ReferenceError en JS estándar. Hoy "funciona" solo
    // porque Babel transpila `let`->`var` (que se inicializa en
    // `undefined`, no en TDZ), así que ese `if` nunca era cierto y el
    // token SIEMPRE se intentaba adjuntar -- que es el comportamiento
    // real que espera toda la app. Se elimina la rama muerta y se
    // renombra la variable local para no depender de ese detalle de
    // transpilación.
    setupInterceptors: (axios, isToken = false, isFormData = false) => {
        axios.interceptors.request.use((config) => {
                const token = localStorage.getItem(Tokens.ADMIN);
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                } else {
                    if (!window.location.href.includes('login') && !window.location.href.includes('reset-password') && !window.location.href.includes('forgot-password')) {
                        window.location.href = environment.URL + '#/' + 'login';
                    }
                }
                // Validado siempre server-side contra user_store antes de
                // usarse (ver ResolveActiveStore::handle()) -- acá solo se
                // adjunta, nunca se confía en él para nada del lado cliente.
                const storeId = localStorage.getItem(Tokens.CURRENT_STORE_ID);
                if (storeId) {
                    config.headers['X-Store-Id'] = storeId;
                }
                if (isFormData) {
                    config.headers['Content-Type'] = 'multipart/form-data';
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        axios.interceptors.response.use(
            response => successHandler(response),
            error => errorHandler(error)
        );
        const errorHandler = (error) => {
            if (error.response.status === 401
                || error.response.data.message === errorMessage.TOKEN_NOT_PROVIDED
                || error.response.data.message === errorMessage.TOKEN_INVALID
                || error.response.data.message === errorMessage.TOKEN_INVALID_SIGNATURE
                || error.response.data.message === errorMessage.TOKEN_EXPIRED) {
                localStorage.removeItem(Tokens.ADMIN);
                localStorage.removeItem(Tokens.USER);
                localStorage.removeItem(Tokens.GET_PERMISSIONS);
                window.location.href = environment.URL + '#' + '/login';
            }else if(error.response.status === 403 || error.response.status === 404) {
                window.location.href = environment.URL + '#' + '/app/dashboard';
            }else {
                return Promise.reject({...error})
            }
        };
        const successHandler = (response) => {
            return response;
        };
    }
};
