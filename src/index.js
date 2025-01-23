import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Login from './Login';
import Admin from './Admin'; 
import reportWebVitals from './reportWebVitals';

// Componente principal para manejar las rutas
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
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
