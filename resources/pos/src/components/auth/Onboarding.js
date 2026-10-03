import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import apiConfig from '../../config/apiConfig';
import { loginAction } from '../../store/action/authAction';
import TabTitle from '../../shared/tab-title/TabTitle';
import { onboardingStyles } from './styles/LoginStyles';
import AuthLayout from './AuthLayout';
import { EyeIcon, EyeOffIcon } from './styles/icons';

const initialValues = {
    organization_name: '',
    store_name: '',
    warehouse_name: 'Bodega principal',
    city: '',
    province: 'Manabí',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    terms: false,
};

const Onboarding = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const headingRef = useRef(null);

    useEffect(() => {
        headingRef.current?.focus();
    }, [step]);

    const change = ({ target }) => {
        const value = target.type === 'checkbox' ? target.checked : target.value;
        setValues((current) => ({ ...current, [target.name]: value }));
        setErrors((current) => ({ ...current, [target.name]: '' }));
        setServerError('');
    };

    const validateStep = (currentStep) => {
        const nextErrors = {};
        const required = currentStep === 1
            ? ['organization_name', 'city']
            : ['first_name', 'last_name', 'email', 'phone', 'password', 'password_confirmation'];
        required.forEach((key) => {
            if (!String(values[key] || '').trim()) nextErrors[key] = 'Este campo es obligatorio.';
        });

        if (currentStep === 2) {
            if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
                nextErrors.email = 'Ingrese un correo electrónico válido.';
            }
            if (values.password && values.password.length < 8) {
                nextErrors.password = 'Use al menos 8 caracteres, con letras y números.';
            }
            if (values.password !== values.password_confirmation) {
                nextErrors.password_confirmation = 'Las contraseñas no coinciden.';
            }
            if (!values.terms) nextErrors.terms = 'Debe aceptar los términos para continuar.';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const continueToOwner = () => {
        if (validateStep(1)) setStep(2);
    };

    const submit = async (event) => {
        event.preventDefault();
        if (!validateStep(2)) return;

        setLoading(true);
        setServerError('');
        try {
            await apiConfig.post('onboarding/register', values);

            const credentials = new FormData();
            credentials.append('email', values.email);
            credentials.append('password', values.password);
            credentials.append('language_code', 'sp');
            dispatch(loginAction(credentials, navigate, setLoading));
        } catch (error) {
            const validationErrors = error?.response?.data?.errors;
            if (validationErrors) {
                setErrors(Object.fromEntries(Object.entries(validationErrors).map(([name, messages]) => [
                    name, Array.isArray(messages) ? messages[0] : messages,
                ])));
                if (['organization_name', 'store_name', 'warehouse_name', 'city', 'province'].some((name) => validationErrors[name])) {
                    setStep(1);
                }
            }
            setServerError(error?.response?.data?.message || 'No pudimos crear la cuenta. Inténtelo nuevamente.');
            setLoading(false);
        }
    };

    const field = (name, label, options = {}) => (
        <div className={`auth-field ${options.full ? 'ob-full' : ''}`}>
            <div className="auth-field__header">
                <label htmlFor={`ob-${name}`}>{label}{options.required && <span className="ob-required" aria-hidden="true"> *</span>}</label>
                {options.optional && <span className="ob-optional">Opcional</span>}
            </div>
            <div className="auth-input-wrap auth-input-wrap--plain">
                <input
                    id={`ob-${name}`}
                    className={errors[name] ? 'is-invalid' : ''}
                    name={name}
                    type={options.type === 'password' && visiblePasswords[name] ? 'text' : (options.type || 'text')}
                    value={values[name]}
                    onChange={change}
                    placeholder={options.placeholder || ''}
                    autoComplete={options.autoComplete}
                    required={options.required}
                    aria-invalid={Boolean(errors[name])}
                    aria-describedby={[errors[name] && `ob-${name}-error`, options.hint && `ob-${name}-hint`].filter(Boolean).join(' ') || undefined}
                />
                {options.type === 'password' && <button
                    type="button"
                    className="auth-password-toggle"
                    aria-label={`${visiblePasswords[name] ? 'Ocultar' : 'Mostrar'} ${name === 'password_confirmation' ? 'confirmación de contraseña' : 'contraseña'}`}
                    aria-pressed={Boolean(visiblePasswords[name])}
                    onClick={() => setVisiblePasswords((current) => ({ ...current, [name]: !current[name] }))}
                >{visiblePasswords[name] ? <EyeOffIcon /> : <EyeIcon />}</button>}
            </div>
            {options.hint && <small className="ob-field-hint" id={`ob-${name}-hint`}>{options.hint}</small>}
            {errors[name] && <span id={`ob-${name}-error`} className="auth-error" role="alert">{errors[name]}</span>}
        </div>
    );

    return (
        <>
            <style>{onboardingStyles}</style>
            <TabTitle title="Crear organización" />
            <AuthLayout page="onboarding">
                        <div className="ob-topline">
                            <Link to="/login" className="auth-inline-link" aria-disabled={loading} onClick={(event) => loading && event.preventDefault()}>← Volver al acceso</Link>
                            <span aria-live="polite">Paso {step} de 2</span>
                        </div>
                        <ol className="ob-steps" aria-label="Pasos de registro">
                            <li className={step === 1 ? 'is-current' : 'is-complete'} aria-current={step === 1 ? 'step' : undefined}><span>{step === 2 ? '✓' : '1'}</span><strong>Tu empresa</strong></li>
                            <li className={step === 2 ? 'is-current' : ''} aria-current={step === 2 ? 'step' : undefined}><span>2</span><strong>Tu cuenta</strong></li>
                        </ol>
                        <div className="auth-card__intro">
                            <span className="auth-card__eyebrow">Cuenta empresarial</span>
                            <h2 ref={headingRef} tabIndex={-1}>{step === 1 ? 'Configura tu negocio' : 'Crea tu cuenta propietaria'}</h2>
                            <p>{step === 1 ? 'Estos datos identificarán tu espacio de trabajo.' : 'Usarás estas credenciales para administrar EcuaPOS.'}</p>
                        </div>

                        {serverError && <div className="ob-server-error" role="alert">{serverError}</div>}

                        <form onSubmit={step === 1 ? (event) => { event.preventDefault(); continueToOwner(); } : submit} noValidate>
                            <fieldset disabled={loading} className="ob-fieldset">
                        {step === 1 ? (
                            <div className="ob-form-grid">
                                {field('organization_name', 'Nombre de la empresa', { full: true, required: true, placeholder: 'Ej. Comercial Rivera', autoComplete: 'organization' })}
                                {field('store_name', 'Nombre de la tienda', { optional: true, placeholder: 'Ej. Matriz' })}
                                {field('warehouse_name', 'Bodega principal')}
                                {field('city', 'Ciudad', { required: true, placeholder: 'Ej. Manta', autoComplete: 'address-level2' })}
                                {field('province', 'Provincia', { autoComplete: 'address-level1' })}
                                <div className="ob-full">
                                    <button type="submit" className="auth-primary-button"><span className="auth-button__content"><span className="auth-button__label">Continuar con mi cuenta</span><span className="auth-button__arrow" aria-hidden="true">→</span></span></button>
                                </div>
                            </div>
                        ) : (
                            <div className="ob-form-grid">
                                <div className="ob-business-summary ob-full"><span>Tu empresa</span><strong>{values.organization_name}</strong><small>{values.city}{values.province ? `, ${values.province}` : ''}</small></div>
                                {field('first_name', 'Nombres', { required: true, autoComplete: 'given-name' })}
                                {field('last_name', 'Apellidos', { required: true, autoComplete: 'family-name' })}
                                {field('email', 'Correo electrónico', { full: true, required: true, type: 'email', autoComplete: 'email', placeholder: 'tu@correo.com' })}
                                {field('phone', 'Teléfono', { full: true, required: true, type: 'tel', autoComplete: 'tel' })}
                                {field('password', 'Contraseña', { required: true, type: 'password', autoComplete: 'new-password', hint: 'Al menos 8 caracteres, con letras y números.' })}
                                {field('password_confirmation', 'Confirmar contraseña', { required: true, type: 'password', autoComplete: 'new-password' })}
                                <label className={`ob-terms ob-full${errors.terms ? ' ob-terms--error' : ''}`}>
                                    <input type="checkbox" name="terms" checked={values.terms} onChange={change} aria-invalid={Boolean(errors.terms)} aria-describedby={errors.terms ? 'ob-terms-error' : undefined} />
                                    <span>Acepto los términos de servicio y el tratamiento de datos.</span>
                                </label>
                                {errors.terms && <span id="ob-terms-error" className="auth-error ob-full" role="alert">{errors.terms}</span>}
                                <div className="ob-actions ob-full">
                                    <button type="button" className="auth-secondary-button" onClick={() => setStep(1)} disabled={loading}>Atrás</button>
                                    <button type="submit" className="auth-primary-button" disabled={loading}>
                                        <span className="auth-button__content">{loading && <span className="auth-spinner" />}<span className="auth-button__label">{loading ? 'Preparando tu cuenta...' : 'Crear mi cuenta'}</span>{!loading && <span className="auth-button__arrow" aria-hidden="true">→</span>}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                            </fieldset>
                        </form>
                        <div className="auth-card__trust"><span className="auth-secure-dot" /><span>Tus datos quedan separados de los demás negocios. La configuración fiscal se realiza dentro de tu cuenta.</span></div>
            </AuthLayout>
        </>
    );
};

export default Onboarding;
