import Box from '@mui/material/Box';  // Importación del componente Box
import TextField from '@mui/material/TextField';
import LogoutIcon from '@mui/icons-material/Logout';
import Typography from '@mui/material/Typography';
import {IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export default function Admin() {
    const navigate = useNavigate();
    const location = useLocation();
    const activeUSer = location.state?.username;
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});
    const [open, setOpen] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const handleClose = () => {setOpen(false); setOpenDelete(false);};
    const handleCloseEdit = () => setOpenEdit(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [userIdDelete, setUserIdDelete] = useState(null);
    const [formData, setFormData] = useState({
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: '',
    });
    const [formDataEdit, setFormDataEdit] = useState({
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      role: '',
    });
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };
    const roles = [
      {
        value: 'Admin',
        label: 'Admin',
      },
      {
        value: 'Servicio al cliente',
        label: 'Servicio al cliente',
      },
      {
        value: 'Ventas',
        label: 'Ventas',
      },
      {
        value: 'Garaje',
        label: 'Garaje',
      },
    ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleOpen = (employee) => {
    setFormDataEdit({
      id: employee.id,
      username: employee.username,
      email: employee.email,
      role: employee.role,
      first_name: employee.first_name,
      last_name: employee.last_name,
    });
    setOpen(true);
    }

  const handleOpenModalDelete = (id) => {
    setUserIdDelete(id);
    setOpenDelete(true);
  }
    
  const validate = () => {
    let newErrors = {};
    if (!formData.username) newErrors.username = 'Debe digitar un usuario';
    if (!formData.first_name) newErrors.first_name = 'Debe digitar un nombre';
    if (!formData.last_name) newErrors.last_name = 'Debe digitar los apellidos';
    if (!formData.role) newErrors.role = 'Debe seleccionar un rol';
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del correo es inválido';
    }
    if (formData.password.length < 9) {
      newErrors.password = 'La contaseña debe tener 9 caracteres como mínimo';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/editEmployee/${formDataEdit.id}/`,
        formDataEdit,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      handleClose();
      setOpenEdit(true);
      showEmployee();
    } catch (error) {
      console.error('Error al actualizar el empleado:', error);
      console.log('Error al actualizar el empleado.');
    }
  };
  const handleRemove = async (id) => {
    const response = await axios.delete(`http://localhost:8000/api/removeEmployee/${userIdDelete}/`)
    handleClose();
    showEmployee();
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Formulario enviado");
    setMessage('');

    if(validate()){
    try {
      setIsSubmitting(true);
      const response = await axios.post('http://localhost:8000/api/addEmployee/', formData,
      {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status !== 200){
      throw new Error("Error al guardar los datos");
    }
    setMessage('¡Empleado agregado con éxito!');
    setFormData({username: '', email: '', password:'', role: '' , first_name: '', last_name: ''});
    showEmployee();
    
  }catch (error) {
        setMessage('Error en ' + error.message);
      } finally {
          setIsSubmitting(false);
      }
      }
    };

    const showEmployee = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/showEmployee/', {
          withCredentials: true,  // Incluye cookies de sesión
        });
        setUsers(response.data);
      }catch (error){
          console.log('Error al mostrar empleados' , error.response || error.message);
      }
    };

    useEffect(() =>{
    
    showEmployee();
   }, []);

   
    const handleLogout = async () => {
        try {
          const response = await axios.post('http://localhost:8000/api/logout/', {
            withCredentials: true,  // Incluye cookies de sesión
          });
          console.log(response); 
          navigate('/login', { replace: true });  
        } catch (error) {
          console.error('Error al cerrar sesión:', error.response || error.message);
          alert('Hubo un problema al cerrar sesión. Por favor, intentalo de nuevo.');
        }
      };
  return (
    <>
    <Box
    sx={{
      position: "sticky",
      top: 0,
      left: 0,
      width: "100%",
      height: "100px",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      backgroundColor: "#10AC84",
      padding: "0 20px",
      boxSizing: "border-box",
    }}
  >
    <IconButton onClick={handleLogout}>
    <LogoutIcon></LogoutIcon>
    </IconButton>
    <img
      src="/images/Logo.png"
      alt="Logo"
      style={{ height: "250px", width: "auto", alignItems:'left'}}
    />
    <Typography
      variant="h5"
      sx={{
        color: "#ffffff",
        fontWeight: "bold",
        textAlign: 'left'
      }}
    >
      Administrador: {activeUSer}
    </Typography>
  </Box>
  <Box
  sx={{
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center', 
    height: 'calc(100vh - 100px)', // Usa espacio total menos una barra superior
    width: '100%',
    backgroundColor: '#D9D9D9',
    padding: '30px', 
    boxSizing: 'border-box',
    gap: '1px'
  }}
>
<Paper sx={{ height: '70%', width: '50%', padding: '40px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
    <Typography sx={{ textAlign: 'center', width: '100%' }} variant="h6" component="div" gutterBottom>
      Información de empleados
    </Typography>
  </Box>
  <DataGrid
    rows={users.map((user) => ({
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    }))}
    columns={[
      {field:'username', headerName: 'Usuario', width: 150 },
      {field: 'first_name', headerName: 'Nombre', width: 150},
      {field: 'last_name', headerName: 'Apellidos', width: 250},
      {field: 'email', headerName: 'Correo electrónico', width: 250 },
      {field: 'role', headerName: 'Rol', width: 150 },
      {
        field: 'actions',
        headerName: 'Acciones',
        width: 80,
        renderCell: (params) => (
          <Box display="flex" width="100%">
            <IconButton onClick={() => handleOpen(params.row)} color="success">
              <CreateIcon />
            </IconButton>
            <IconButton onClick={() => handleOpenModalDelete(params.row.id)} style={{ color: red[900] }}>
              <DeleteIcon />
            </IconButton>
          </Box>
          
        ),
      },
    ]}
    sx={{
      "& .MuiDataGrid-columnHeader": {
        pointerEvents: "none", // Deshabilita la interacción en la columna de acciones
      }
    }}
    disableColumnReorder
  />
</Paper>
  <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Typography sx={{textAlign:'center'}}  id="modal-modal-title" variant="h6" component="h2">
            Editar un empleado
          </Typography>
          <TextField sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px'}, my:1}} name='username' id="username" label="Usuario" variant="outlined" fullWidth value={formDataEdit.username} onChange={(e) => setFormDataEdit({ ...formDataEdit, username: e.target.value})} error={!!errors.username} helperText={errors.username}/>
          <TextField sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px'}, my:1}} name='first_name' id="first_name" label="Nombre" variant="outlined" fullWidth value={formDataEdit.first_name} onChange={(e) => setFormDataEdit({ ...formDataEdit, first_name: e.target.value })} error={!!errors.first_name} helperText={errors.first_name}/>
          <TextField sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px'}, my:1}} name='last_name' id="last_name" label="Apellidos" variant="outlined" fullWidth value={formDataEdit.last_name} onChange={(e) => setFormDataEdit({ ...formDataEdit, last_name: e.target.value })} error={!!errors.last_name} helperText={errors.last_name}/>
          <TextField sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px'}, my:1}} name='email' id="email" label="Correo Electrónico" variant="outlined" fullWidth value={formDataEdit.email} onChange={(e) => setFormDataEdit({ ...formDataEdit, email: e.target.value })}error={!!errors.email} helperText={errors.email}/>
          <TextField
          sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px'}, my:1}}
          name='role'
          id="outlined-select-currency"
          select
          label="Select"
          defaultValue="Admin"
          helperText="Seleccione el rol"
          value={formDataEdit.role}
          onChange={(e) => setFormDataEdit({ ...formDataEdit, role: e.target.value })}
          error={!!errors.role}
        >
          {roles.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
    </TextField>
    <Button onClick={handleEdit}  fullWidth variant="contained" sx={{borderRadius: '10px' , backgroundColor: '#10AC84', '&: hover': {
            backgroundColor: '#10AC84',}}}>Editar</Button>
        </Box>
      </Modal>

      <Dialog open={openEdit} onClose={handleClose}>
        <DialogContent>Usuario actualizado correctamente</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={handleClose}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <p>¿Estás seguro de que deseas eliminar este usuario?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleRemove} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
  <Paper
  sx={{
    padding: '24px',
    boxSizing: 'border-box',
    height: '70%',
    width: '30%'
  }}
>
  <Typography 
    sx={{ 
      textAlign: 'center', 
      marginBottom: '16px'
    }} 
    variant="h6" 
    component="div"
  >
    Agregar un empleado
  </Typography>
  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <TextField sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px'}}} name='username' id="username" label="Usuario" variant="outlined" fullWidth value={formData.username} onChange={handleChange} error={!!errors.username} helperText={errors.username}/>
    <TextField sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px'}}} name='first_name' id="first_name" label="Nombre" variant="outlined" fullWidth value={formData.first_name} onChange={handleChange} error={!!errors.first_name} helperText={errors.first_name}/>
    <TextField sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px'}}} name='last_name' id="last_name" label="Apellidos" variant="outlined" fullWidth value={formData.last_name} onChange={handleChange} error={!!errors.last_name} helperText={errors.last_name}/>
    <TextField sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px'}}} name='email' id="email" label="Correo Electrónico" variant="outlined" fullWidth value={formData.email} onChange={handleChange}error={!!errors.email} helperText={errors.email}/>
    <TextField sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px'}}} name='password' type='password' id="password" label="Contraseña" variant="outlined" fullWidth value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password}/>
    <TextField
          sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px'}}}
          name='role'
          id="outlined-select-currency"
          select
          label="Select"
          defaultValue="Admin"
          helperText="Seleccione el rol"
          value={formData.role}
          onChange={handleChange} 
          error={!!errors.role}
        >
          {roles.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
    </TextField>
    <Button type='submit' disabled={isSubmitting}  fullWidth variant="contained" sx={{borderRadius: '10px' , backgroundColor: '#10AC84', '&: hover': {
            backgroundColor: '#10AC84',
          }}}>{isSubmitting ? 'Guardando...' : 'Guardar'}</Button>
     <Typography sx={{textAlign:'center', color:'green'}} variant="body1">{message}</Typography>
  </form>
</Paper>
</Box>

  </>
  );
}