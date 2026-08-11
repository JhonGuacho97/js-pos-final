import React from 'react';
import { useSelector } from 'react-redux';
import CustomerDropDown from "../pos-dropdown/CustomerDropdown";
import WarehouseDropDown from "../pos-dropdown/WarehouseDropDown";
import { Row } from "react-bootstrap-v5";

const PosHeader = ( props ) => {
    const { setSelectedCustomerOption, selectedCustomerOption, setSelectedOption, selectedOption, customerModel, updateCustomer } = props;
    const { frontSetting } = useSelector((state) => state);
    const storeName = frontSetting?.value?.company_name;

    return (
        <>
            {/* Franja fija con la tienda/almacén activo -- para que nunca
                sea ambiguo dónde se está vendiendo, sobre todo para un
                usuario con acceso a varias tiendas. Va FUERA de .top-nav
                a propósito: ese contenedor tiene height fijo (6.93vh) para
                alinear los selects, y agregar contenido adentro lo
                desbordaba/tapaba. */}
            {(storeName || selectedOption?.label) && (
                <div className="active-store-badge mt-3 mb-1">
                    <i className="bi bi-shop me-2" />
                    {storeName}
                    {storeName && selectedOption?.label ? " · " : ""}
                    {selectedOption?.label}
                </div>
            )}
            <div className='top-nav my-3'>
                <Row className="align-items-center justify-content-between grp-select h-100">
                    <CustomerDropDown setSelectedCustomerOption={setSelectedCustomerOption}
                        selectedCustomerOption={selectedCustomerOption} customerModel={customerModel}
                        updateCustomer={updateCustomer} />

                    <WarehouseDropDown setSelectedOption={setSelectedOption}
                        selectedOption={selectedOption} />
                </Row>
            </div>
            <style>
                {`
.active-store-badge {
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    font-weight: 600;
    color: #2F6FED;
    background: #eef2ff;
    padding: 4px 10px;
    border-radius: 6px;
}
                `}
            </style>
        </>
    )
};
export default PosHeader
