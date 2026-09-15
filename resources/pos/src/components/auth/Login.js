import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as EmailValidator from "email-validator";
import { loginAction } from "../../store/action/authAction";
import TabTitle from "../../shared/tab-title/TabTitle";
import { Tokens } from "../../constants";
import {
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import { loginStyles } from "./styles/LoginStyles";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "./styles/icons";
import AuthLayout from "./AuthLayout";

const ShieldIcon = () => (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
        <path d="M7 1.3L12 3.1v3.5c0 3.2-2.1 5.6-5 6.1c-2.9-.5-5-2.9-5-6.1V3.1L7 1.3Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M4.8 6.9L6.3 8.4L9.3 5.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const token = localStorage.getItem(Tokens.ADMIN);

    const [loginInputs, setLoginInputs] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: "", password: "" });

    useEffect(() => {
        if (token) navigate("/", { replace: true });
    }, []);

    const handleValidation = () => {
        let errorss = {};
        let isValid = true;
        if (!EmailValidator.validate(loginInputs["email"])) {
            errorss["email"] = !loginInputs["email"]
                ? getFormattedMessage("globally.input.email.validate.label")
                : getFormattedMessage("globally.input.email.valid.validate.label");
            isValid = false;
        }
        if (!loginInputs["password"]) {
            errorss["password"] = getFormattedMessage("user.input.password.validate.label");
            isValid = false;
        }
        setErrors(errorss);
        return isValid;
    };

    const prepareFormData = () => {
        const formData = new FormData();
        formData.append("email", loginInputs.email);
        formData.append("password", loginInputs.password);
        formData.append("language_code", localStorage.getItem("updated_language"));
        return formData;
    };

    const onLogin = async (e) => {
        e.preventDefault();
        const valid = handleValidation();
        if (valid) {
            setLoading(true);
            dispatch(loginAction(prepareFormData(loginInputs), navigate, setLoading));
        }
    };

    const handleChange = (e) => {
        e.persist();
        setLoginInputs((inputs) => ({ ...inputs, [e.target.name]: e.target.value }));
        setErrors((current) => ({ ...current, [e.target.name]: "" }));
    };

    return (
        <>
            <style>{loginStyles}</style>
            <TabTitle title={placeholderText("login-form.login-btn.label")} />

            <AuthLayout page="login">
                        <div className="auth-card__intro">
                            <span className="auth-card__eyebrow">Acceso al sistema</span>
                            <h2>{getFormattedMessage("login-form.title")}</h2>
                            <p>Ingresa tus credenciales para continuar con la gestión de tu negocio.</p>
                        </div>

                        <form onSubmit={onLogin} noValidate>

                            {/* Email */}
                            <div className="auth-field">
                                <div className="auth-field__header">
                                    <label htmlFor="login-email">
                                        {getFormattedMessage("globally.input.email.label")}
                                    </label>
                                </div>
                                <div className="auth-input-wrap">
                                    <MailIcon />
                                    <input
                                        id="login-email"
                                        className={errors["email"] ? "is-invalid" : ""}
                                        type="email"
                                        name="email"
                                        placeholder={placeholderText("globally.input.email.placeholder.label")}
                                        required
                                        autoFocus
                                        autoComplete="email"
                                        aria-invalid={Boolean(errors["email"])}
                                        aria-describedby={errors["email"] ? "login-email-error" : undefined}
                                        value={loginInputs.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors["email"] && (
                                    <span id="login-email-error" className="auth-error" role="alert">{errors["email"]}</span>
                                )}
                            </div>

                            {/* Password */}
                            <div className="auth-field">
                                <div className="auth-field__header">
                                    <label htmlFor="login-password">
                                        {getFormattedMessage("user.input.password.label")}
                                    </label>
                                    <Link to="/forgot-password" className="auth-inline-link">
                                        {getFormattedMessage("login-form.forgot-password.label")}
                                    </Link>
                                </div>
                                <div className="auth-input-wrap">
                                    <LockIcon className="auth-input-icon" />
                                    <input
                                        id="login-password"
                                        className={errors["password"] ? "is-invalid" : ""}
                                        type={showPw ? "text" : "password"}
                                        name="password"
                                        placeholder={placeholderText("user.input.password.placeholder.label")}
                                        required
                                        autoComplete="current-password"
                                        aria-invalid={Boolean(errors["password"])}
                                        aria-describedby={errors["password"] ? "login-password-error" : undefined}
                                        value={loginInputs.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="auth-password-toggle"
                                        onClick={() => setShowPw((v) => !v)}
                                        aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        aria-pressed={showPw}
                                    >
                                        {showPw ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                                {errors["password"] && (
                                    <span id="login-password-error" className="auth-error" role="alert">{errors["password"]}</span>
                                )}
                            </div>

                            {/* Submit */}
                            <button type="submit" className="auth-primary-button" disabled={loading}>
                                <span className="auth-button__content">
                                    {loading && <span className="auth-spinner" />}
                                    <span className="auth-button__label">
                                        {loading
                                            ? getFormattedMessage("globally.loading.label")
                                            : getFormattedMessage("login-form.login-btn.label")
                                        }
                                    </span>
                                    {!loading && <span className="auth-button__arrow" aria-hidden="true">→</span>}
                                </span>
                            </button>
                        </form>

                        <div className="auth-card__trust">
                            <ShieldIcon />
                            <span>Tu sesión está protegida. Nunca compartas tu contraseña.</span>
                        </div>
            </AuthLayout>
        </>
    );
};

export default Login;
