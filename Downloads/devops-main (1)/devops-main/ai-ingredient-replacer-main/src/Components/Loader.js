// Components/Loader.js
import React from 'react';
import '../styles/Loader.css'; // Import custom styling

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Loading content, please wait...</p>
    </div>
  );
};

export default Loader;
