import React, { useEffect, useState } from 'react'
import { getFormattedMessage } from '../../shared/sharedMethod';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { registerCashInHandAction } from '../../store/action/pos/posRegisterDetailsAction';
import { useNavigate } from 'react-router';
import DenominationCounter from './DenominationCounter';
import { buildEmptyDenominationRows } from '../../shared/cashDenominations';
import { currencySymbolHandling } from '../../shared/sharedMethod';
import apiConfig from '../../config/apiConfig';

const PosRegisterModel = ({ showPosRegisterModel, onClickshowPosRegisterModel }) => {

    const [rows, setRows] = useState(buildEmptyDenominationRows());
    const [cashInHand, setCashInHand] = useState(0);
    const [cashRegisters, setCashRegisters] = useState([]);
    const [selectedRegister, setSelectedRegister] = useState('');
    const [loadingRegisters, setLoadingRegisters] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { frontSetting, allConfigData, settings } = useSelector((state) => state);
    const currencySymbol = (frontSetting && frontSetting.value && frontSetting.value.currency_symbol) || '$';

    // Mismo criterio de fallback que ya usa PosMainPage.js para el
    // selector de almacén: el propio del usuario si tiene uno asignado,
    // si no el de la tienda activa -- así el cajero ve en qué sucursal
    // está abriendo caja antes de confirmar.
    const warehouseName = allConfigData?.default_warehouse_id
        ? allConfigData.default_warehouse_name
        : settings?.attributes?.warehouse_name;
    const storeName = frontSetting?.value?.company_name;

    // Último cierre de este mismo usuario, para poder reutilizarlo como
    // punto de partida en vez de contar todo el efectivo desde cero.
    // Fetch local (no Redux) para no pisar el estado que usa la pantalla
    // de "Cuadre de caja" -- register-report ya viene ordenado por fecha
    // descendente y solo trae cajas cerradas.
    const [lastClose, setLastClose] = useState(null);
    useEffect(() => {
        if (!showPosRegisterModel) {
            return;
        }
        apiConfig
            .get('register-report?page[size]=1')
            .then((response) => {
                const last = response.data?.data?.[0]?.attributes;
                if (last?.closing_denominations?.length > 0) {
                    setLastClose(last);
                }
            })
            .catch(() => {});
    }, [showPosRegisterModel]);

    useEffect(() => {
        if (!showPosRegisterModel) return;
        setLoadingRegisters(true);
        apiConfig.get('available-cash-registers')
            .then((response) => {
                const registers = response.data?.data || [];
                setCashRegisters(registers);
                const firstAvailable = registers.find((register) => register.available);
                setSelectedRegister(firstAvailable ? String(firstAvailable.id) : '');
            })
            .catch(() => setCashRegisters([]))
            .finally(() => setLoadingRegisters(false));
    }, [showPosRegisterModel]);

    const useLastClose = () => {
        if (!lastClose) {
            return;
        }
        const quantityByValue = Object.fromEntries(
            lastClose.closing_denominations.map((denomination) => [denomination.value, denomination.quantity])
        );
        setRows(
            buildEmptyDenominationRows().map((row) => ({
                ...row,
                quantity: quantityByValue[row.value] ? String(quantityByValue[row.value]) : '',
            }))
        );
    };

    const onSubmit = () => {
        dispatch(
            registerCashInHandAction(
                {
                    cash_in_hand: cashInHand,
                    // Solo se guardan las denominaciones que el usuario llenó,
                    // para no ensuciar el registro con ceros.
                    opening_denominations: rows
                        .filter((row) => Number(row.quantity) > 0)
                        .map((row) => ({
                            value: row.value,
                            quantity: Number(row.quantity),
                            subtotal: Number(row.quantity) * row.value,
                        })),
                    cash_register_id: selectedRegister || undefined,
                },
                navigate
            )
        );

        onClickshowPosRegisterModel();
    };

    return (
        <>
            <Modal
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                scrollable
                show={showPosRegisterModel}
                onHide={() => onClickshowPosRegisterModel()}
            >
                <Modal.Header closeButton className='py-4 pt-5'>
                    <div>
                        <Modal.Title id="contained-modal-title-vcenter">
                            <h4 className='mb-1'>Abrir caja</h4>
                        </Modal.Title>
                        {warehouseName && (
                            <div className='text-muted small'>
                                Abriendo caja en <strong className='text-body'>{warehouseName}</strong>
                                {storeName ? ` · ${storeName}` : ''}
                            </div>
                        )}
                    </div>
                </Modal.Header>
                <Modal.Body className='py-4'>
                    <div className='mb-4'>
                        <label className='form-label'>Caja física</label>
                        {loadingRegisters ? (
                            <div className='form-control text-muted'>Cargando cajas disponibles...</div>
                        ) : cashRegisters.length ? (
                            <select className='form-select' value={selectedRegister} onChange={(event) => setSelectedRegister(event.target.value)}>
                                <option value=''>Selecciona una caja disponible</option>
                                {cashRegisters.map((register) => (
                                    <option key={register.id} value={register.id} disabled={!register.available}>
                                        {register.name} · {register.code}{register.available ? '' : ` · En uso por ${register.current_user?.first_name || 'otro cajero'}`}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className='rounded-3 bg-light p-3 small text-muted'>Se creará automáticamente la caja principal de esta sucursal.</div>
                        )}
                    </div>
                    <div className='d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2'>
                        <label className='form-label mb-0'>
                            {getFormattedMessage('globally.input.cash-in-hand.label')}:
                        </label>
                        {lastClose && (
                            <button
                                type='button'
                                className='btn btn-sm btn-outline-secondary'
                                onClick={useLastClose}
                            >
                                Usar el mismo cierre anterior ({currencySymbolHandling(allConfigData, currencySymbol, lastClose.cash_in_hand_while_closing || 0)})
                            </button>
                        )}
                    </div>
                    <DenominationCounter
                        rows={rows}
                        setRows={setRows}
                        currencySymbol={currencySymbol}
                        onTotalChange={setCashInHand}
                    />
                </Modal.Body>
                <Modal.Footer className='py-4 pb-5'>
                    <Button onClick={onSubmit} disabled={loadingRegisters || (cashRegisters.length > 0 && !selectedRegister)}>Abrir caja</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


export default PosRegisterModel
