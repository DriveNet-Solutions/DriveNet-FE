import  React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Link from '@mui/material/Link';
import { TextField } from '@mui/material';
import axios from 'axios';


export default function Login() {
  const [email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [PassError, setPassError] = useState('');
  const emailFormato = /^\S+@\S+\.\S+$/;


  const Submit = async (e) => {
    e.preventDefault();

    //Verificaciones de email
   // if(!emailFormato.test(email)){
   //   setEmailError('Por favor ingrese un correo electrónico válido.')
   // }else{
   //   setEmailError('')
   // }

    //Verificaciones de contraseña
    if(password.length < 8){
      setPassError('La contraseña debe tener al menos 8 caracteres.');
      return;
      }
      else{
          setPassError('');
      }

  if (emailError || PassError) {
    return;
  }

  try {
    const response = await axios.post('http://localhost:8000/api/login/', {
      username: email, 
      password: password,
    },
    {
    headers: {
      'Content-Type': 'application/json',
    }});
    alert('¡Inicio de sesión exitoso!');
  } catch (error) {
    console.log(error);
    if (error.response) {
      alert('Usuario o contraseña incorrectos');
    } else {
      alert('Ocurrió un error inesperado.');
    }
  }
};


  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#D9D9D9'
      }}
    >
    <Card sx= {{width: 600, height: 700, textAlign:'center'}}>
    <CardMedia
      component="img"
      height="300"
      image="/images/Logo.jpeg"
      alt="Logo"
    />
      <CardHeader
      title="Iniciar Sesión"
      />
      <CardContent>
        <TextField value={email} onChange={(e) => setEmail(e.target.value)} required id = "email"
          label="Correo electrónico"
          type="text" sx={{width: 400, height:90, '& .MuiOutlinedInput-root': {
              borderRadius: '18px' }}} error = {!!emailError} helperText ={emailError}
        />
        <TextField value={password} onChange={(e) => setPassword(e.target.value)} required id="password"
          label="Contraseña"
          type="password"sx={{width: 400,marginBottom: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '18px'}}} error = {!!PassError} helperText ={PassError}/>
          <Button onClick={Submit} variant="contained" sx={{width:400,
              borderRadius: '10px' , backgroundColor: '#10AC84', '&: hover': {
            backgroundColor: '#10AC84',
          }}}>Ingresar</Button>
      </CardContent>
      <Link sx={{color:'#576574', '&: hover': {
            color: '#222f3e'}}} href="#">¿Olvidaste tu contraseña?</Link>
    </Card>
    </Box>
  );
}

