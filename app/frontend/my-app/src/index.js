// index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Update this import
import './index.css';
import App from './App';

// This is the new way to render in React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
