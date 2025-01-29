import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import { Button, Link, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [PassError, setPassError] = useState('');
  let [message, setMessage] = useState('');
  const navigate = useNavigate();


  const Submit = async (e) => {
   if(e) e.preventDefault();

    let hasError = false;

    // Validaciones
    if (password.length < 8) {
      setPassError('La contraseña debe tener al menos 8 caracteres.');
      hasError = true;
    } else {
      setPassError('');
    }

    if (email.length <= 0) {
      setEmailError('Por favor ingrese un usuario');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (hasError) return;
    try {
      const response = await axios.post(
        'http://localhost:8000/api/login/',
        { username: email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const { redirectUrl, role } = response.data;
      setMessage('¡Inicio de sesión exitoso!');
      navigate(redirectUrl, { state: { username: email, role }, replace: true });
    } catch (error) {
      if (error.response) {
        setMessage('Usuario o contraseña incorrectos');
      } else {
        setMessage('Ocurrió un error inesperado.');
      }
  };
}

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#D9D9D9',
        padding: { xs: 2, md: 0 }, 
      }}
    >
      <Card
        sx={{
          width: { xs: '100%', sm: 450, md: 600 },
          maxWidth: '90vw',
          height: 'auto',
          minHeight: '60%',
          textAlign: 'center',
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <CardMedia
          component="img"
          height="350"
          image="/images/Logo.jpeg"
          alt="Logo"
          sx={{
            objectFit: 'contain',
          }}
        />
        <CardHeader title="Iniciar Sesión" />
        <CardContent>
          <TextField onKeyDown={(e) => {if (e.key === "Enter") {Submit()}}} value={email} onChange={(e) => setEmail(e.target.value)}required id="email" label="Usuario"type="text"sx={{width: '100%',maxWidth: 400,marginBottom: 2,'& .MuiOutlinedInput-root': { borderRadius: '18px' },}}error={!!emailError}helperText={emailError}/>
          <TextField onKeyDown={(e) => {if (e.key === "Enter") {Submit()}}}
            value={password}
            onChange={(e) => setPassword(e.target.value)} required id="password" label="Contraseña" type="password" sx={{ width: '100%', maxWidth: 400,marginBottom: 3,'& .MuiOutlinedInput-root': { borderRadius: '18px' }, }} error={!!PassError} helperText={PassError} />
          <Button  onClick={Submit} variant="contained"sx={{width: '100%', maxWidth: 400,borderRadius: '10px',backgroundColor: '#10AC84','&:hover': { backgroundColor: '#10AC84' }, }} >
            Ingresar
          </Button>
          <Typography sx={{ marginTop: 2, color: message.includes('incorrectos') ? 'red' : 'green',}}>
            {message}
          </Typography>
        </CardContent>
        <Link sx={{color: '#576574','&:hover': { color: '#222f3e' }}} href="#"
        >¿Olvidaste tu contraseña?
        </Link>
      </Card>
    </Box>
  );
}