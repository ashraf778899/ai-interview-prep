import React from 'react';
import '../../styles/LoadingSpinner.css';

const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="spinner-container">
    <div className="spinner"></div>
    <p className="spinner-text">{text}</p>
  </div>
);

export default LoadingSpinner;
