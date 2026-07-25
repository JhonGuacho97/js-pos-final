import apiConfig from '../../config/apiConfig';
import { toastType } from '../../constants';
import { addToast } from './toastAction';
import { setLoading } from './loadingAction';
import { getFormattedMessage } from '../../shared/sharedMethod';

export const downloadBackup = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        // Necesitamos responseType: 'blob' para recibir el archivo binario
        const response = await apiConfig.get('backup/download', {
            responseType: 'blob',
        });

        // Crear URL temporal para el blob y forzar descarga
        const url      = window.URL.createObjectURL(new Blob([response.data]));
        const link     = document.createElement('a');
        link.href      = url;

        // Intentar obtener el nombre del archivo desde el header Content-Disposition
        const disposition = response.headers['content-disposition'];
        let filename      = `backup_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.sql`;
        if (disposition && disposition.includes('filename=')) {
            filename = disposition.split('filename=')[1].replace(/"/g, '').trim();
        }

        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        dispatch(addToast({
            text: getFormattedMessage('backup.success.message'),
            type: toastType.SUCCESS,
        }));
    } catch (error) {
        dispatch(addToast({
            text: getFormattedMessage('backup.error.message'),
            type: toastType.ERROR,
        }));
    } finally {
        dispatch(setLoading(false));
    }
};
