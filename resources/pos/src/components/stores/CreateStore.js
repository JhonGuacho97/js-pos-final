import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap-v5';
import StoreForm from './StoreForm';
import { getFormattedMessage } from '../../shared/sharedMethod';

const CreateStore = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);

    return (
        <div className='text-end w-sm-auto w-100'>
            <Button variant='primary mb-lg-0 mb-md-0 mb-4' onClick={handleClose}>
                {getFormattedMessage('store.create.title')}
            </Button>
            <StoreForm handleClose={handleClose} show={show} title={getFormattedMessage('store.create.title')} />
        </div>
    );
};

export default connect(null, {})(CreateStore);
