import React from 'react';
import ReactDOM from 'react-dom/client';


// Componente principal para manejar las rutas

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Correct import
import './index.css';
import Login from './Login';
import Admin from './Admin'; 
import ClientInfo from './ClientInfo';
import reportWebVitals from './reportWebVitals';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user-search" element={<ClientInfo />} />
      </Routes>
    </Router>
  );
}

// Renderizamos la app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App/> 
  </React.StrictMode>
);

// Si quieres medir el rendimiento, puedes usar reportWebVitals

reportWebVitals();

