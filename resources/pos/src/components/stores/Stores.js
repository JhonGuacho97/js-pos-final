import React, { useState } from 'react';
import { connect } from 'react-redux';
import MasterLayout from '../MasterLayout';
import { fetchStores, toggleStoreStatus, setDefaultStore } from '../../store/action/storesAction';
import ReactDataTable from '../../shared/table/ReactDataTable';
import CreateStore from './CreateStore';
import EditStore from './EditStore';
import DeleteStore from './DeleteStore';
import TabTitle from '../../shared/tab-title/TabTitle';
import { getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import ActionButton from '../../shared/action-buttons/ActionButton';
import TopProgressBar from '../../shared/components/loaders/TopProgressBar';

const Stores = (props) => {
    const { fetchStores, toggleStoreStatus, setDefaultStore, storesList, totalRecord, isLoading } = props;
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [editModel, setEditModel] = useState(false);
    const [store, setStore] = useState();

    const handleClose = (item) => {
        setEditModel(!editModel);
        setStore(item);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        fetchStores(filter, true);
    };

    const itemsValue = storesList.length >= 0 && storesList.map(store => ({
        name: store.attributes.name,
        is_active: store.attributes.is_active,
        is_default: store.attributes.is_default,
        users_count: store.attributes.users_count,
        id: store.id,
    }));

    const columns = [
        {
            name: getFormattedMessage('globally.input.name.label'),
            selector: row => row.name,
            sortField: 'name',
            sortable: true,
        },
        {
            name: getFormattedMessage('purchase.select.status.label'),
            sortField: 'is_active',
            cell: row => (
                <div className='d-flex align-items-center mt-4'>
                    <label className='form-check form-switch form-switch-sm'>
                        <input name='status' className='form-check-input admin-status' type='checkbox'
                               value='1' checked={row.is_active} onChange={() => toggleStoreStatus(row)} />
                        <span className='switch-slider' data-checked='✓' data-unchecked='✕'></span>
                    </label>
                </div>
            ),
            sortable: false,
        },
        {
            name: getFormattedMessage('store.table.default.column.label'),
            sortField: 'is_default',
            cell: row => (
                <div className='d-flex align-items-center mt-4'>
                    <label className='form-check' title={getFormattedMessage('store.table.default.column.label')}>
                        <input name='is_default' type='radio' className='form-check-input'
                               checked={row.is_default} onChange={() => !row.is_default && setDefaultStore(row)} />
                    </label>
                </div>
            ),
            sortable: false,
        },
        {
            name: getFormattedMessage('store.table.users.column.label'),
            selector: row => row.users_count,
        },
        {
            name: getFormattedMessage('react-data-table.action.column.label'),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton item={row} goToEditProduct={handleClose} isEditMode={true}
                                        onClickDeleteModel={onClickDeleteModel} />,
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText('store.title')} />
            <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} isLoading={isLoading}
                            AddButton={<CreateStore />} totalRows={totalRecord} />
            <EditStore handleClose={handleClose} show={editModel} store={store} />
            <DeleteStore onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete} />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { storesList, totalRecord, isLoading } = state;
    return { storesList, totalRecord, isLoading };
};

export default connect(mapStateToProps, { fetchStores, toggleStoreStatus, setDefaultStore })(Stores);
