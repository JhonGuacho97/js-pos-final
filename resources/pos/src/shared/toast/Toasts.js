import React from 'react';
import PropTypes from 'prop-types';
import Toast from './Toast';

const Toasts = ({language}) => <Toast language={language}/>;

Toasts.propTypes = {
    language: PropTypes.string,
};

export default Toasts;
