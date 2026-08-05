import React from 'react';
import PropTypes from 'prop-types';
import {toastType} from '../../constants/index';
import {faCheck, faClose, faXmark, faTriangleExclamation} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {placeholderText} from "../sharedMethod";

const ToastCard = (props) => {
    const {type, text, closeToast} = props;
    const iconColor = type === toastType.ERROR
        ? 'toast-card__icon--error'
        : (type === toastType.WARNING ? 'toast-card__icon--warning' : 'toast-card__icon--success');

    const renderCard = () => {
        const icon = type === toastType.ERROR
            ? faXmark
            : (type === toastType.WARNING ? faTriangleExclamation : faCheck);
        const titulo = type === toastType.ERROR
            ? placeholderText("toast.error.title")
            : (type === toastType.WARNING ? placeholderText("toast.warning.title") : placeholderText("toast.successful.title"));

        return (
            <div className='d-flex align-items-center'>
                <div className={`${iconColor}`} style={type === toastType.WARNING ? { color: '#fd7e14' } : undefined}>
                    <FontAwesomeIcon icon={icon}
                                     className='fs-1'/>
                </div>
                <div className='mx-3'>
                    <h2 className='toast-card__toast-title'>
                        {titulo}
                    </h2>
                    <p className='toast-card__toast-message'>{text}</p>
                </div>
            </div>
        );
    };

    return (
        <div className='toast-card'>
            <FontAwesomeIcon icon={faClose} className='fs-3 toast-card__close-btn' onClick={closeToast}/>
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
