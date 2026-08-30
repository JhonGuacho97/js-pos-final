import { apiBaseURL, posCashPaymentActionType, toastType } from '../../../constants';
import apiConfig from '../../../config/apiConfig';
import { addToast } from '../toastAction';
import { fetchBrandClickable } from "./posAllProductAction";
import { getFormattedMessage } from '../../../shared/sharedMethod';
import { setLoading } from '../loadingAction';
import { fetchHoldLists } from "./HoldListAction";
import { isNetworkError } from "../../../offline/catalogStorage";


export const posCashPaymentAction = ( detailsCash, setUpdateProducts, posAllProduct, filterData, onSuccess = null, isLoading = true ) => async ( dispatch ) => {
    if ( isLoading ) {
        dispatch( setLoading( true ) )
    }
    let url = apiBaseURL.CASH_PAYMENT;
    try {
        const response = await apiConfig.post( url, detailsCash );
            dispatch( { type: posCashPaymentActionType.POS_CASH_PAYMENT, payload: response.data.data } );
            dispatch( addToast(
                { text: getFormattedMessage( "pos.payment.success.message" ) } ) );
            setUpdateProducts( [] )
            dispatch( fetchBrandClickable( filterData.brandId, filterData.categoryId, filterData.selectedOption.value ) )
            // Callback opcional con la venta creada (usado para disparar la
            // emisión de factura electrónica cuando el usuario la activó).
            if ( onSuccess && response.data.data?.id ) {
                onSuccess( response.data.data )
            }
            if ( isLoading ) dispatch( fetchHoldLists() );
            return { success: true, sale: response.data.data };
    } catch ( error ) {
        const responseStatus = Number(error?.response?.status || 0);
        // Un error de red, rate limit o 5xx es ambiguo: el servidor pudo
        // confirmar la transacción y perder la respuesta después. El POS debe
        // conservar el mismo client_uuid y reconciliar desde la cola en vez de
        // permitir que el cajero cree otra venta con un segundo intento.
        if ( isNetworkError(error) || responseStatus === 429 || responseStatus >= 500 ) {
            return { success: false, networkError: true, responseStatus };
        }
        dispatch( addToast({
            text: error?.response?.data?.message || "No se pudo registrar la venta.",
            type: toastType.ERROR,
        }) );
        return { success: false, networkError: false, responseStatus };
    } finally {
        if ( isLoading ) dispatch( setLoading( false ) );
    }
};
