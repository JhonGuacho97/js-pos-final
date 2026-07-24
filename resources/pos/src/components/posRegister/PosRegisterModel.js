import React, { useState } from 'react'
import { getFormattedMessage } from '../../shared/sharedMethod';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { registerCashInHandAction } from '../../store/action/pos/posRegisterDetailsAction';
import { useNavigate } from 'react-router';
import DenominationCounter from './DenominationCounter';
import { buildEmptyDenominationRows } from '../../shared/cashDenominations';

const PosRegisterModel = ({ showPosRegisterModel, onClickshowPosRegisterModel }) => {

    const [rows, setRows] = useState(buildEmptyDenominationRows());
    const [cashInHand, setCashInHand] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { frontSetting } = useSelector((state) => state);
    const currencySymbol = (frontSetting && frontSetting.value && frontSetting.value.currency_symbol) || '$';

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
                show={showPosRegisterModel}
                onHide={() => onClickshowPosRegisterModel()}
            >
                <Modal.Header closeButton className='py-4 pt-5'>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <h4>POS Register</h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='py-4'>
                    <label className='form-label mb-2'>
                        {getFormattedMessage('globally.input.cash-in-hand.label')}:
                    </label>
                    <DenominationCounter
                        rows={rows}
                        setRows={setRows}
                        currencySymbol={currencySymbol}
                        onTotalChange={setCashInHand}
                    />
                </Modal.Body>
                <Modal.Footer className='py-4 pb-5'>
                    <Button onClick={onSubmit}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


export default PosRegisterModel
