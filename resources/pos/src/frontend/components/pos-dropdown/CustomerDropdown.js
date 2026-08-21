import React, {useEffect} from 'react';
import {InputGroup, Button} from 'react-bootstrap-v5';
import Select from 'react-select';
import {connect} from 'react-redux';
import {fetchAllCustomer} from '../../../store/action/customerAction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { getFormattedMessage } from '../../../shared/sharedMethod';
import { getOfflineCustomer, OFFLINE_CUSTOMERS_EVENT } from '../../../offline/catalogStorage';

const CustomerDropDown = (props) => {
    const {setSelectedCustomerOption, selectedCustomerOption, fetchAllCustomer, customers, customerModel, updateCustomer, offlineMode} = props;

    const customerOption = customers && customers.map((customer) => {
        const status = customer.attributes?.offline_status;
        const suffix = ["pending", "syncing"].includes(status)
            ? " · pendiente"
            : status === "requires_review" ? " · revisar" : "";
        return {
            value: customer.id,
            label: `${customer.attributes.name}${suffix}`,
            offlineCustomerUuid: customer.attributes?.offline_client_uuid || null,
            offlineStatus: status || null,
        }
    });

    useEffect(() => {
        const loadCustomers = async () => {
            await fetchAllCustomer();
            if (!selectedCustomerOption?.offlineCustomerUuid) return;
            const localCustomer = await getOfflineCustomer(selectedCustomerOption.offlineCustomerUuid).catch(() => null);
            if (localCustomer?.status === "synced" && localCustomer.serverCustomerId) {
                setSelectedCustomerOption({
                    value: localCustomer.serverCustomerId,
                    label: localCustomer.payload?.name || selectedCustomerOption.label,
                });
            }
        };
        const handleWorkerMessage = (event) => {
            if (event.data?.type === "OFFLINE_CUSTOMERS_STATUS_CHANGED") loadCustomers();
        };
        loadCustomers();
        window.addEventListener('online', loadCustomers);
        window.addEventListener(OFFLINE_CUSTOMERS_EVENT, loadCustomers);
        navigator.serviceWorker?.addEventListener('message', handleWorkerMessage);
        return () => {
            window.removeEventListener('online', loadCustomers);
            window.removeEventListener(OFFLINE_CUSTOMERS_EVENT, loadCustomers);
            navigator.serviceWorker?.removeEventListener('message', handleWorkerMessage);
        };
    },[selectedCustomerOption?.offlineCustomerUuid]);

    const onChangeWarehouse = (obj) => {
        setSelectedCustomerOption(obj);
    };

    return (
        <div className={`select-box pos-customer-select col-6 pe-sm-1 position-relative ${offlineMode ? 'is-offline' : ''}`}>
            <InputGroup className='pos-customer-select__group flex-nowrap'>
                <InputGroup.Text id='basic-addon1' className='pos-customer-select__icon bg-transparent position-absolute border-0 z-index-1'>
                    <i className="bi bi-person" />
                </InputGroup.Text>
                <Select
                    className='pos-customer-select__select'
                    classNamePrefix='pos-customer-react'
                    placeholder='Seleccionar cliente'
                    defaultValue={selectedCustomerOption}
                    value={selectedCustomerOption}
                    onChange={onChangeWarehouse}
                    options={customerOption}
                    isOptionDisabled={(option) => option.offlineStatus === "requires_review"}
                    noOptionsMessage={() => getFormattedMessage('no-option.label')}
                />
                <Button
                    title={offlineMode ? "Crear cliente sin conexión" : "Crear cliente"}
                    aria-label="Crear cliente"
                    onClick={() => customerModel(true)}
                    className='pos-customer-select__button position-absolute'
                >
                    <FontAwesomeIcon icon={faUserPlus} />
                </Button>
            </InputGroup>
        </div>
    )
};

const mapStateToProps = (state) => {
    const {customers} = state;
    return {customers}
};
export default connect(mapStateToProps, {fetchAllCustomer})(CustomerDropDown);
