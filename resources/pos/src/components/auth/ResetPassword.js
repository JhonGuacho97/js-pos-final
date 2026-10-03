import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import TabTitle from "../../shared/tab-title/TabTitle";
import { resetPassword } from "../../store/action/authAction";
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod";
import { loginStyles } from "./styles/LoginStyles";
import { EyeIcon, EyeOffIcon, LockIcon } from "./styles/icons";
import AuthLayout from "./AuthLayout";

const ResetPassword = ({ resetPassword }) => {
    const navigate = useNavigate();
    const { token, email } = useParams();
    const [values, setValues] = useState({
        password: "",
        password_confirmation: "",
        email,
        token,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState({ password: false, confirmation: false });

    const validate = () => {
        const nextErrors = {};
        if (!values.password) {
            nextErrors.password = getFormattedMessage("user.input.password.validate.label");
        } else if (values.password.length < 6) {
            nextErrors.password = "La contraseña debe tener al menos 6 caracteres.";
        }
        if (!values.password_confirmation) {
            nextErrors.password_confirmation = getFormattedMessage("user.input.confirm-password.validate.label");
        } else if (values.password !== values.password_confirmation) {
            nextErrors.password_confirmation = getFormattedMessage("reset-password.password.validate.label");
        }
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const submit = async (event) => {
        event.preventDefault();
        if (!validate()) return;

        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => formData.append(key, value));
        setLoading(true);
        await resetPassword(formData, navigate);
        setLoading(false);
    };

    const update = (event) => {
        const { name, value } = event.target;
        setValues((current) => ({ ...current, [name]: value }));
        setErrors((current) => ({ ...current, [name]: "" }));
    };

    const passwordField = (name, label, isVisible, toggle) => (
        <div className="auth-field">
            <div className="auth-field__header"><label htmlFor={`reset-${name}`}>{label}</label></div>
            <div className="auth-input-wrap">
                <LockIcon className="auth-input-icon" />
                <input
                    id={`reset-${name}`}
                    className={errors[name] ? "is-invalid" : ""}
                    type={isVisible ? "text" : "password"}
                    name={name}
                    value={values[name]}
                    autoComplete="new-password"
                    placeholder={placeholderText(name === "password"
                        ? "user.input.password.placeholder.label"
                        : "change-password.input.confirm.placeholder.label")}
                    aria-invalid={Boolean(errors[name])}
                    aria-describedby={errors[name] ? `reset-${name}-error` : undefined}
                    onChange={update}
                />
                <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={toggle}
                    aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                    aria-pressed={isVisible}
                >
                    {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>
            {errors[name] && <span id={`reset-${name}-error`} className="auth-error" role="alert">{errors[name]}</span>}
        </div>
    );

    return (
        <>
            <style>{loginStyles}</style>
            <TabTitle title="Restablecer contraseña" />
            <AuthLayout page="reset">
                <div className="auth-icon-box"><LockIcon /></div>
                <div className="auth-card__intro">
                    <span className="auth-card__eyebrow">Nuevo acceso</span>
                    <h2>Crea una nueva contraseña</h2>
                    <p>Elige una contraseña que no utilices en otros servicios para proteger mejor tu cuenta.</p>
                </div>

                <form onSubmit={submit} noValidate>
                    {passwordField(
                        "password",
                        getFormattedMessage("user.input.password.label"),
                        visible.password,
                        () => setVisible((current) => ({ ...current, password: !current.password }))
                    )}
                    {passwordField(
                        "password_confirmation",
                        "Confirmar contraseña",
                        visible.confirmation,
                        () => setVisible((current) => ({ ...current, confirmation: !current.confirmation }))
                    )}

                    <div className="auth-password-hint">
                        <span className={values.password.length >= 6 ? "is-complete" : ""}>Al menos 6 caracteres</span>
                        <span className={values.password && values.password === values.password_confirmation ? "is-complete" : ""}>Ambas contraseñas coinciden</span>
                    </div>

                    <button type="submit" className="auth-primary-button" disabled={loading}>
                        <span className="auth-button__content">
                            {loading && <span className="auth-spinner" />}
                            <span className="auth-button__label">{loading ? "Actualizando..." : "Guardar nueva contraseña"}</span>
                            {!loading && <span className="auth-button__arrow" aria-hidden="true">→</span>}
                        </span>
                    </button>
                </form>

                <Link to="/login" className="auth-back-link">← Volver a iniciar sesión</Link>
            </AuthLayout>
        </>
    );
};

export default connect(null, { resetPassword })(ResetPassword);
