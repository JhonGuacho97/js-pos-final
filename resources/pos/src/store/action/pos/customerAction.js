import apiConfig from '../../../config/apiConfig';
import { apiBaseURL, toastType } from '../../../constants';
import { addToast } from './../toastAction'
import { getFormattedMessage } from '../../../shared/sharedMethod';
import { setSavingButton } from "./../saveButtonAction";
import { fetchAllCustomer } from "../customerAction";
import { enqueueOfflineCustomer, offlineCustomerToResource } from '../../../offline/catalogStorage';
import { requestOfflineSaleBackgroundSync } from '../../../offline/backgroundSync';

export const addCustomer = ( supplier, hide, options = {} ) => async ( dispatch ) => {
    dispatch( setSavingButton( true ) )
    if (options.offlineMode || !navigator.onLine) {
        try {
            const customer = await enqueueOfflineCustomer(supplier);
            await requestOfflineSaleBackgroundSync().catch(() => null);
            const resource = offlineCustomerToResource(customer);
            await dispatch(fetchAllCustomer());
            dispatch(addToast({ text: 'Cliente guardado en el dispositivo. Se sincronizará al recuperar conexión.' }));
            dispatch(setSavingButton(false));
            hide(false);
            return resource;
        } catch (error) {
            dispatch(setSavingButton(false));
            dispatch(addToast({ text: error?.message || 'No se pudo guardar el cliente offline.', type: toastType.ERROR }));
            return null;
        }
    }

    return apiConfig.post( apiBaseURL.CUSTOMERS, supplier )
        .then( async ( response ) => {
            await dispatch( fetchAllCustomer() )
            dispatch( addToast( { text: getFormattedMessage( 'customer.success.create.message' ) } ) );
            dispatch( setSavingButton( false ) )
            hide( false )
            return response.data.data;
        } )
        .catch( ( error ) => {
            dispatch( setSavingButton( false ) )
            dispatch( addToast(
                { text: error?.response?.data?.message || 'No se pudo crear el cliente.', type: toastType.ERROR } ) );
            return null;
        } );
};
