import React from 'react';
import {ToastContainer} from 'react-toastify';
import PropTypes from 'prop-types';

const Toast = (props) => {
    const {language} = props;

    return (
        <ToastContainer
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={language === "ar" ? true : false}
            draggable
            pauseOnHover
            pauseOnFocusLoss
        />
    );
};

Toast.propTypes = {
    language: PropTypes.string,
};

export default Toast;
