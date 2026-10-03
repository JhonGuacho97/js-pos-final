import React, { useState } from "react";
import TabTitle from "../../shared/tab-title/TabTitle";
import * as EmailValidator from "email-validator";
import { forgotPassword } from "../../store/action/authAction";
import { useDispatch } from "react-redux";
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod";
import { Link } from "react-router-dom";
import { loginStyles } from "./styles/LoginStyles";
import { LockIcon, MailIcon } from "./styles/icons";
import AuthLayout from "./AuthLayout";

const SuccessIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 11.1V12a8 8 0 1 1-4.7-7.3" />
        <path d="m9 11 3 3L22 4" />
    </svg>
);

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [submittedEmail, setSubmittedEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!email.trim()) {
            setError(getFormattedMessage("globally.input.email.validate.label"));
            return false;
        }
        if (!EmailValidator.validate(email.trim())) {
            setError(getFormattedMessage("globally.input.email.valid.validate.label"));
            return false;
        }
        setError("");
        return true;
    };

    const submit = async (event) => {
        event.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("email", email.trim());
        const sent = await dispatch(forgotPassword(formData));
        setLoading(false);
        if (sent) setSubmittedEmail(email.trim());
    };

    const startAgain = () => {
        setSubmittedEmail("");
        setError("");
    };

    return (
        <>
            <style>{loginStyles}</style>
            <TabTitle title="Recuperar contraseña" />
            <AuthLayout page="recovery">
                {submittedEmail ? (
                    <div className="auth-success" role="status">
                        <span className="auth-success__icon"><SuccessIcon /></span>
                        <span className="auth-card__eyebrow">Correo enviado</span>
                        <h2>Revisa tu bandeja de entrada</h2>
                        <p>
                            Si existe una cuenta asociada a <strong>{submittedEmail}</strong>, recibirás un enlace para crear una nueva contraseña.
                        </p>
                        <div className="auth-notice">
                            El mensaje puede tardar unos minutos. Revisa también las carpetas de spam o correo no deseado.
                        </div>
                        <Link to="/login" className="auth-primary-button auth-primary-button--link">
                            Volver a iniciar sesión <span aria-hidden="true">→</span>
                        </Link>
                        <button type="button" className="auth-secondary-button" onClick={startAgain}>
                            Usar otro correo
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="auth-icon-box"><LockIcon /></div>
                        <div className="auth-card__intro">
                            <span className="auth-card__eyebrow">Recuperación de acceso</span>
                            <h2>Recupera tu contraseña</h2>
                            <p>Escribe el correo de tu cuenta y te enviaremos un enlace seguro para restablecerla.</p>
                        </div>

                        <form onSubmit={submit} noValidate>
                            <div className="auth-field">
                                <div className="auth-field__header">
                                    <label htmlFor="recovery-email">{getFormattedMessage("globally.input.email.label")}</label>
                                    <Link to="/login" className="auth-inline-link">Volver al acceso</Link>
                                </div>
                                <div className="auth-input-wrap">
                                    <MailIcon />
                                    <input
                                        id="recovery-email"
                                        className={error ? "is-invalid" : ""}
                                        type="email"
                                        name="email"
                                        value={email}
                                        autoFocus
                                        autoComplete="email"
                                        placeholder={placeholderText("globally.input.email.placeholder.label")}
                                        aria-invalid={Boolean(error)}
                                        aria-describedby={error ? "recovery-email-error" : undefined}
                                        onChange={(event) => {
                                            setEmail(event.target.value);
                                            if (error) setError("");
                                        }}
                                    />
                                </div>
                                {error && <span id="recovery-email-error" className="auth-error" role="alert">{error}</span>}
                            </div>

                            <button type="submit" className="auth-primary-button" disabled={loading || !email.trim()}>
                                <span className="auth-button__content">
                                    {loading && <span className="auth-spinner" />}
                                    <span className="auth-button__label">{loading ? "Enviando enlace..." : "Enviar enlace de recuperación"}</span>
                                    {!loading && <span className="auth-button__arrow" aria-hidden="true">→</span>}
                                </span>
                            </button>
                        </form>

                        <p className="auth-help-copy">
                            Por seguridad, el enlace tendrá un tiempo limitado de validez.
                        </p>
                    </>
                )}
            </AuthLayout>
        </>
    );
};

export default ForgotPassword;
