import React, { createRef, useState } from 'react';
import { connect } from 'react-redux';
import { Form, Modal } from 'react-bootstrap-v5';
import { addStore, editStore } from '../../store/action/storesAction';
import { getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import ModelFooter from '../../shared/components/modelFooter';

const StoreForm = (props) => {
    const { handleClose, show, title, addStore, editStore, singleStore } = props;
    const innerRef = createRef();
    const [storeValue, setStoreValue] = useState({
        name: singleStore ? singleStore.name : '',
    });
    const [errors, setErrors] = useState({ name: '' });

    const disabled = singleStore && singleStore.name === storeValue.name.trim();

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!storeValue['name'].trim()) {
            errorss['name'] = getFormattedMessage('globally.input.name.validate.label');
        } else if (storeValue['name'] && storeValue['name'].length > 255) {
            errorss['name'] = getFormattedMessage('brand.input.name.valid.validate.label');
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const onChangeInput = (e) => {
        e.preventDefault();
        setStoreValue(inputs => ({ ...inputs, [e.target.name]: e.target.value }));
        setErrors('');
    };

    const clearField = () => {
        setStoreValue({ name: '' });
        setErrors('');
        handleClose(false);
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        if (!valid) {
            return;
        }
        if (singleStore) {
            if (!disabled) {
                editStore(singleStore.id, { name: storeValue.name, is_active: singleStore.is_active }, handleClose);
            }
        } else {
            addStore({ name: storeValue.name });
            clearField();
        }
    };

    return (
        <Modal show={show}
               onHide={clearField}
               keyboard={true}
               onShow={() => setTimeout(() => { innerRef.current.focus(); }, 1)}
        >
            <Form onKeyPress={(e) => { if (e.key === 'Enter') { onSubmit(e); } }}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <div className='col-md-12 mb-5'>
                            <label className='form-label'>{getFormattedMessage('globally.input.name.label')}: </label>
                            <span className='required' />
                            <input type='text' name='name'
                                   placeholder={placeholderText('globally.input.name.placeholder.label')}
                                   className='form-control' ref={innerRef} autoComplete='off'
                                   onChange={(e) => onChangeInput(e)}
                                   value={storeValue.name} />
                            <span className='text-danger d-block fw-400 fs-small mt-2'>{errors['name'] ? errors['name'] : null}</span>
                        </div>
                    </div>
                </Modal.Body>
            </Form>
            <ModelFooter onEditRecord={singleStore} onSubmit={onSubmit} editDisabled={disabled}
                         clearField={clearField} addDisabled={!storeValue.name.trim()} />
        </Modal>
    );
};

export default connect(null, { addStore, editStore })(StoreForm);
