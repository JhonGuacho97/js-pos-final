import React from 'react';
import { connect } from 'react-redux';
import { deleteStore } from '../../store/action/storesAction';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import { getFormattedMessage } from '../../shared/sharedMethod';

const DeleteStore = (props) => {
    const { deleteStore, onDelete, deleteModel, onClickDeleteModel } = props;

    const deleteStoreClick = () => {
        deleteStore(onDelete.id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel &&
                <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                             deleteUserClick={deleteStoreClick} name={getFormattedMessage('store.title')} />
            }
        </div>
    );
};

export default connect(null, { deleteStore })(DeleteStore);
