import { apiBaseURL, posCashPaymentActionType, toastType } from '../../../constants';
import apiConfig from '../../../config/apiConfig';
import { addToast } from '../toastAction';
import { fetchBrandClickable } from "./posAllProductAction";
import { getFormattedMessage } from '../../../shared/sharedMethod';
import { setLoading } from '../loadingAction';
import { fetchHoldLists } from "./HoldListAction";
import { isNetworkError } from "../../../offline/catalogStorage";


export const posCashPaymentAction = ( detailsCash, setUpdateProducts, setModalShowPaymentSlip, posAllProduct, filterData, onSuccess = null, isLoading = true ) => async ( dispatch ) => {
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
            setModalShowPaymentSlip( true )
            dispatch( fetchBrandClickable( filterData.brandId, filterData.categoryId, filterData.selectedOption.value ) )
            // Callback opcional con la venta creada (usado para disparar la
            // emisión de factura electrónica cuando el usuario la activó).
            if ( onSuccess && response.data.data?.id ) {
                onSuccess( response.data.data )
            }
            if ( isLoading ) dispatch( fetchHoldLists() );
            return { success: true, sale: response.data.data };
    } catch ( error ) {
        if ( isNetworkError(error) ) {
            return { success: false, networkError: true };
        }
        dispatch( addToast({
            text: error?.response?.data?.message || "No se pudo registrar la venta.",
            type: toastType.ERROR,
        }) );
        return { success: false, networkError: false };
    } finally {
        if ( isLoading ) dispatch( setLoading( false ) );
    }
};
