import React from 'react';
import { Form } from 'react-bootstrap-v5';
import Select from 'react-select';
import { useSelector } from "react-redux";
import { getFormattedMessage } from '../sharedMethod';

const ReactSelect = (props) => {
    const { title, placeholder, data, defaultValue, onChange, errors, value, isRequired, multiLanguageOption, isWarehouseDisable, addSearchItems } = props;
    // 'isOptionDisabled' es un booleano GLOBAL en Redux que representa
    // "el carrito de la venta/compra/etc. en curso ya tiene items" --
    // lo escriben los Form (SalesForm, PurchaseForm, etc.) en un efecto
    // propio que observa su carrito. Antes este componente TAMBIÉN
    // escribía a ese mismo booleano global en cada montaje, en base a
    // 'addSearchItems' de ESTA instancia puntual -- como una página
    // tiene varios <ReactSelect> (cliente, almacén, estado, forma de
    // pago...), cualquiera de ellos que se montara/remontara después
    // pisaba el valor correcto con el suyo propio (casi siempre 'false',
    // porque solo el select de almacén recibe 'addSearchItems'),
    // dejando el candado de almacén en un estado impredecible que ya no
    // dependía de si el carrito tenía items. Ahora 'addSearchItems' se
    // combina en el momento, solo para esta instancia, sin pasar por
    // Redux -- ninguna otra instancia puede pisarlo.
    const isOptionDisabled = useSelector((state) => state.isOptionDisabled);

    const option = data ? data?.map((da) => {
        const variationLabel = da.attributes?.variation_product?.variation_type_name;
        return {
            value: da.value ? da.value : da.id,
            label: da.label
                ? da.label
                : da.attributes.symbol
                    ? da.attributes.symbol
                    : variationLabel
                        ? `${da.attributes.name} (${variationLabel})`
                        : da.attributes.name
        }
    }) : multiLanguageOption?.map((option) => {
        return {
            value: option.id,
            label: option.name
        }
    })

    return (
        <Form.Group className='form-group w-100' controlId='formBasic'>
            {title ? <Form.Label>{title}:</Form.Label> : ''}
            {isRequired ? '' : <span className='required' />}
            <Select
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                options={option}
                noOptionsMessage={() => getFormattedMessage('no-option.label')}
                isDisabled={isWarehouseDisable ? (Boolean(addSearchItems) || isOptionDisabled) : false}
            />
            {errors ? <span className='text-danger d-block fw-400 fs-small mt-2'>{errors ? errors : null}</span> : null}
        </Form.Group>
    )
};
export default ReactSelect;
