import React from "react";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import { editCustomer } from "../../store/action/customerAction";
import ModelFooter from "../../shared/components/modelFooter";
import IdentificacionField from "./identificacionField";
import { useCustomerForm } from "../../hooks/useCustomerFom";
import { getFormattedMessage } from "../../shared/sharedMethod";
import "./customer-credit.scss";

const CustomerForm = (props) => {
    const { addCustomerData, id, editCustomer, singleCustomer } = props;

    const {
        customerData,
        customerValue,
        errors,
        sriLoading,
        isDisabled,
        onChangeInput,
        onSubmit,
        handleSriLookup,
    } = useCustomerForm({ singleCustomer, addCustomerData, editCustomer, id });

    const field = (name, label, type = "text", extra = {}) => (
        <div className="col-md-6 mb-3">
            <label>{label}</label>
            <input
                type={type}
                name={name}
                className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                value={customerValue[name] || ""}
                onChange={onChangeInput}
                {...extra}
            />
            {errors[name] && (
                <span className="text-danger" style={{ fontSize: "0.85rem" }}>
                    {errors[name]}
                </span>
            )}
        </div>
    );

    return (
        <div className="card">
            <div className="card-body">
                <Form onSubmit={onSubmit}>
                    <div className="row">

                        {/* Tipo identificación */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Tipo de identificación:</label>
                            <select
                                name="tipo_identificacion"
                                className="form-control"
                                value={customerValue.tipo_identificacion}
                                onChange={onChangeInput}
                                disabled={!!customerData}
                            >
                                <option value="05">Cédula</option>
                                <option value="04">RUC</option>
                            </select>
                        </div>

                        <IdentificacionField
                            tipo={customerValue.tipo_identificacion}
                            value={customerValue.identification}
                            onChange={onChangeInput}
                            error={errors.identification}
                            isEdit={!!customerData}
                            sriLoading={sriLoading}
                            onSriLookup={handleSriLookup}
                        />

                        {field("name", getFormattedMessage('globally.input.name.label'))}
                        {field("email", getFormattedMessage('globally.input.email.label'))}
                        {field("phone", getFormattedMessage('globally.input.phone-number.label'))}
                        {field("city", getFormattedMessage('globally.input.city.label'))}
                        {field("country", getFormattedMessage('globally.input.country.label'))}

                        {/* Dirección como textarea */}
                        <div className="col-md-6 mb-3">
                            <label>{getFormattedMessage('globally.input.address.label')}</label>
                            <textarea
                                name="address"
                                className={`form-control ${errors.address ? "is-invalid" : ""}`}
                                value={customerValue.address || ""}
                                onChange={onChangeInput}
                            />
                            {errors.address && (
                                <span className="text-danger" style={{ fontSize: "0.85rem" }}>
                                    {errors.address}
                                </span>
                            )}
                        </div>

                        <div className="col-12">
                            <section className={`customer-credit-card ${customerValue.credit_enabled ? "is-enabled" : ""}`}>
                                <div className="customer-credit-card__heading">
                                    <div className="customer-credit-card__icon"><i className="bi bi-credit-card-2-front" /></div>
                                    <div><span>CONDICIONES COMERCIALES</span><h3>Control de crédito</h3><p>Define un cupo y plazo predeterminado para las ventas pendientes.</p></div>
                                    <label className="customer-credit-switch"><input type="checkbox" name="credit_enabled" checked={Boolean(customerValue.credit_enabled)} onChange={onChangeInput} /><span /><b>{customerValue.credit_enabled ? "Control activo" : "Sin límite controlado"}</b></label>
                                </div>
                                {customerValue.credit_enabled && <div className="customer-credit-fields">
                                    <label>Cupo máximo<div><span>$</span><input type="number" min="0" step="0.01" name="credit_limit" value={customerValue.credit_limit} onChange={onChangeInput} /></div>{errors.credit_limit && <small>{errors.credit_limit}</small>}</label>
                                    <label>Plazo habitual<div><input type="number" min="0" max="3650" name="default_payment_terms_days" value={customerValue.default_payment_terms_days} onChange={onChangeInput} /><span>días</span></div>{errors.default_payment_terms_days && <small>{errors.default_payment_terms_days}</small>}</label>
                                    <p><i className="bi bi-info-circle" /> Las ventas parciales o no pagadas usarán este plazo y no podrán superar el cupo disponible.</p>
                                </div>}
                            </section>
                        </div>

                        <ModelFooter
                            onEditRecord={customerData}
                            onSubmit={onSubmit}
                            editDisabled={isDisabled}
                            addDisabled={!customerValue.name}
                            link="/app/customers"
                        />
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default connect(null, { editCustomer })(CustomerForm);
