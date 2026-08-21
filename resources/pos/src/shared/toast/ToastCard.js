import React from 'react';
import PropTypes from 'prop-types';
import {toastType} from '../../constants/index';
import {faCheck, faXmark, faTriangleExclamation} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {placeholderText} from "../sharedMethod";

const ToastCard = (props) => {
    const {type, text, closeToast} = props;
    const variant = type === toastType.ERROR
        ? 'error'
        : (type === toastType.WARNING ? 'warning' : 'success');

    const renderCard = () => {
        const icon = type === toastType.ERROR
            ? faXmark
            : (type === toastType.WARNING ? faTriangleExclamation : faCheck);
        const titulo = type === toastType.ERROR
            ? placeholderText("toast.error.title")
            : (type === toastType.WARNING ? placeholderText("toast.warning.title") : placeholderText("toast.successful.title"));

        return (
            <div className='toast-card__layout'>
                <div className={`toast-card__icon toast-card__icon--${variant}`} aria-hidden='true'>
                    <FontAwesomeIcon icon={icon}/>
                </div>
                <div className='toast-card__content'>
                    <h2 className='toast-card__toast-title'>
                        {titulo}
                    </h2>
                    <p className='toast-card__toast-message'>{text}</p>
                </div>
            </div>
        );
    };

    return (
        <div className={`toast-card toast-card--${variant}`}>
            <span className='toast-card__accent' aria-hidden='true'/>
            <button
                type='button'
                className='toast-card__close-btn'
                onClick={closeToast}
                aria-label='Cerrar notificación'
            >
                <FontAwesomeIcon icon={faXmark}/>
            </button>
            {renderCard()}
        </div>
    )
};

ToastCard.propTypes = {
    text: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    type: PropTypes.string,
    closeToast: PropTypes.func,
};

export default ToastCard;
