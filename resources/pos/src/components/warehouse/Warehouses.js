import React, { useState } from 'react';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(isoWeek);
dayjs.extend(relativeTime);
import { useNavigate } from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import { fetchWarehouses, toggleWarehouseStatus } from '../../store/action/warehouseAction';
import ReactDataTable from '../../shared/table/ReactDataTable';
import DeleteWarehouse from './DeleteWarehouse';
import TabTitle from '../../shared/tab-title/TabTitle';
import { getFormattedDate, getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import ActionButton from '../../shared/action-buttons/ActionButton';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const Warehouses = ( props ) => {
    const { fetchWarehouses, toggleWarehouseStatus, warehouses, totalRecord, isLoading, allConfigData } = props;
    const [ deleteModel, setDeleteModel ] = useState( false );
    const [ isDelete, setIsDelete ] = useState( null );
    const [ updatingWarehouseId, setUpdatingWarehouseId ] = useState( null );
    const navigate = useNavigate();

    const onClickDeleteModel = ( isDelete = null ) => {
        setDeleteModel( !deleteModel );
        setIsDelete( isDelete );
    };

    const onChange = ( filter ) => {
        fetchWarehouses( filter, true, true );
    };

    const goToEditProduct = ( item ) => {
        const id = item.id
        navigate( `/app/warehouse/edit/${id}` )
    };

    const goToProductDetailPage = ( id ) => {
        navigate( `/app/warehouse/detail/${id}` )
    };

    const onToggleStatus = async ( warehouse ) => {
        if ( updatingWarehouseId !== null ) {
            return;
        }
        setUpdatingWarehouseId( warehouse.id );
        await toggleWarehouseStatus( warehouse );
        setUpdatingWarehouseId( null );
    };

    const itemsValue = warehouses.length >= 0 && warehouses.map( warehouse => ( {
        date: getFormattedDate( warehouse.attributes.created_at, allConfigData && allConfigData ),
        time: dayjs( warehouse.attributes.created_at ).format( 'LT' ),
        name: warehouse.attributes.name,
        phone: warehouse.attributes.phone,
        country: warehouse.attributes.country,
        city: warehouse.attributes.city,
        email: warehouse.attributes.email,
        zip_code: warehouse.attributes.zip_code,
        is_active: warehouse.attributes.is_active,
        id: warehouse.id
    } ) );

    const columns = [
        {
            name: getFormattedMessage( 'globally.detail.warehouse' ),
            selector: row => row.name,
            sortField: 'name',
            sortable: true,
            cell: row => {
                return <div>
                    <div className='text-primary'>{row.name}</div>
                    <div>{row.email}</div>
                </div>
            }
        },
        {
            name: 'Estado',
            selector: row => row.is_active,
            sortable: true,
            cell: row => (
                <div className='d-flex align-items-center gap-2' onClick={event => event.stopPropagation()}>
                    <div className='form-check form-switch m-0'>
                        <input
                            id={`warehouse-status-${row.id}`}
                            className='form-check-input cursor-pointer'
                            type='checkbox'
                            role='switch'
                            aria-label={`${row.is_active ? 'Desactivar' : 'Activar'} ${row.name}`}
                            checked={row.is_active}
                            disabled={updatingWarehouseId !== null}
                            onChange={() => onToggleStatus(row)}
                        />
                    </div>
                    <label
                        htmlFor={`warehouse-status-${row.id}`}
                        className={`badge cursor-pointer ${row.is_active ? 'bg-light-success text-success' : 'bg-light-danger text-danger'}`}
                    >
                        {updatingWarehouseId === row.id && <span className='spinner-border spinner-border-sm me-1' />}
                        {row.is_active ? 'Activa' : 'Inactiva'}
                    </label>
                </div>
            )
        },
        {
            name: getFormattedMessage( 'globally.input.phone-number.label' ),
            selector: row => row.phone,
            sortField: 'phone',
            sortable: true,
        },
        {
            name: getFormattedMessage( 'globally.input.country.label' ),
            selector: row => row.country,
            sortField: 'country',
            sortable: true,
        },
        {
            name: getFormattedMessage( 'globally.input.city.label' ),
            selector: row => row.city,
            sortField: 'city',
            sortable: true,
        },
        {
            name: getFormattedMessage( 'warehouse.input.zip-code.label' ),
            selector: row => row.zip_code,
            sortField: 'zip_code',
            sortable: true,
        },
        {
            name: getFormattedMessage( 'globally.react-table.column.created-date.label' ),
            selector: row => row.date,
            sortField: 'created_at',
            sortable: true,
            cell: row => {
                return (
                    <span className='badge bg-light-info'>
                        <div className='mb-1'>{row.time}</div>
                        {row.date}
                    </span>
                )
            }

        },
        {
            name: getFormattedMessage( 'react-data-table.action.column.label' ),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton isViewIcon={true} item={row} goToDetailScreen={goToProductDetailPage}
                goToEditProduct={goToEditProduct} isEditMode={true}
                onClickDeleteModel={onClickDeleteModel} />
        }
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText( 'warehouse.title' )} />
            <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} isLoading={isLoading}
                ButtonValue={getFormattedMessage( 'warehouse.create.title' )} totalRows={totalRecord}
                to='#/app/warehouse/create' />
            <DeleteWarehouse onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete} />
        </MasterLayout>
    )
};

const mapStateToProps = ( state ) => {
    const { warehouses, totalRecord, isLoading, allConfigData } = state;
    return { warehouses, totalRecord, isLoading, allConfigData }
};

export default connect( mapStateToProps, { fetchWarehouses, toggleWarehouseStatus } )( Warehouses );

