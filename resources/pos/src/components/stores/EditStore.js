import React from 'react';
import { connect } from 'react-redux';
import StoreForm from './StoreForm';
import { getFormattedMessage } from '../../shared/sharedMethod';

const EditStore = (props) => {
    const { handleClose, show, store } = props;

    return (
        <>
            {store &&
                <StoreForm handleClose={handleClose} show={show} singleStore={store}
                           title={getFormattedMessage('store.edit.title')} />
            }
        </>
    );
};

export default connect(null)(EditStore);
