import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Modal,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { green, blue, red } from "@mui/material/colors";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout"
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [id, setId] = useState(""); // State for input ID
  const [userData, setUserData] = useState([]); // State for user data
  const [error, setError] = useState(""); // State for error messages
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Delete modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // For success messages
  const [errorModalOpen, setErrorModalOpen] = useState(false); // For error modal visibility
  const [isNoMatchModalOpen, setIsNoMatchModalOpen] = useState(false); // Controls "No Match Found" modal
  const [duplicateError, setDuplicateError] = useState(false);
  const navigate = useNavigate();


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

  const handleSearch = async () => {
    setError("");
    setUserData([]);
    if (!id) {
      setError("Debe proporcionar un ID válido.");
      return;
    }
  
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/user-search/`, {
        params: { id },
      });
  
      if (response.data && Object.keys(response.data).length > 0) {
        setUserData([response.data]);
      } else {
        setIsNoMatchModalOpen(true); // Mostrar modal si no se encuentra el usuario
      }
    } catch (err) {
      setIsNoMatchModalOpen(true); // Mostrar modal para errores en la búsqueda
    }
  };
  

  const handleAddUser = async () => {
    if (!newUser.id || !newUser.username || !newUser.email || !newUser.registration_date || !newUser.role || !newUser.password) {
      setError("Todos los campos son obligatorios.");
      setErrorModalOpen(true);
      return;
    }

    if (!newUser.registration_date) {
      setError("Debe seleccionar una fecha de registro.");
      setErrorModalOpen(true);
      return;
    }

    if (newUser.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      setErrorModalOpen(true);
      return;
    }
  
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/user-search/`, {
        id: newUser.id,
        name: newUser.username,
        email: newUser.email,
        password: newUser.password,
        registration_date: newUser.registration_date,
        assigned_agent: newUser.role,
      });
  
      if (response.data.duplicate) {
        setDuplicateError(true); // Mostrar el modal de duplicado
      } else {
        setSuccessMessage("Usuario agregado exitosamente.");
        setNewUser({ id: "", username: "", email: "", registration_date: "", role: "", password: "" });
        setIsAddModalOpen(false);
        handleSearch();
      }
    } catch (err) {
      if (err.response?.data?.duplicate) {
        setDuplicateError(true); // Modal de duplicado
      } else {
        setError(err.response?.data?.error || "Error al guardar el usuario.");
        setErrorModalOpen(true);
      }
    }
  };
  
  const resetAddModalState = () => {
    setNewUser({
      id: "",
      username: "",
      email: "",
      registration_date: "",
      role: "",
      password: "",
    });
    setTouched({
      id: false,
      username: false,
      email: false,
      registration_date: false,
      role: false,
      password: false,
    });
  };
  
  
  const handleEditUser = async () => {
    if (!selectedUser.id || !selectedUser.username || !selectedUser.email || !selectedUser.registration_date || !selectedUser.role) {
      setError("Todos los campos son obligatorios.");
      setErrorModalOpen(true);
      return;
    }
  
    try {
      const formattedDate = selectedUser.registration_date?.split("T")[0];
      const payload = {
        id: selectedUser.id,
        name: selectedUser.username,
        email: selectedUser.email,
        registration_date: formattedDate,
        assigned_agent: selectedUser.role,
      };
  
      await axios.put(`http://127.0.0.1:8000/api/user-search/`, payload);
      setSuccessMessage("Usuario actualizado exitosamente.");
      setIsEditModalOpen(false);
      handleSearch();
    } catch (err) {
      setError(err.response?.data?.error || "Error al actualizar el usuario.");
      setErrorModalOpen(true);
    }
  };
  
  
  

  const [newUser, setNewUser] = useState({
    id: "",
    username: "",
    email: "",
    registration_date: "",
    role: "",
    password: "", // Added password field
  });
  
  const [touched, setTouched] = useState({
    id: false,
    username: false,
    email: false,
    registration_date: false,
    role: false,
    password: false,
  });
  

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/user-search/`, {
        params: { id: selectedUser?.id },
      });
      setSuccessMessage("Usuario eliminado exitosamente.");
      setUserData(userData.filter((user) => user.id !== selectedUser?.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || "Error al eliminar el usuario.");
      setErrorModalOpen(true);
    }
  };
  
  return (
    <>
{/* Top Bar */}
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
        textAlign: 'center'
      }}
    >
      Informacion de Cliente 
    </Typography>
  </Box>

      {/* Search Field */}
      {/* Search Field */}
<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
    marginBottom: 2,
    width: "100%",
  }}
>
  <TextField
    placeholder="Cédula"
    value={id}
    onChange={(e) => setId(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    }}
    InputProps={{
      style: {
        backgroundColor: "#ffffff",
        borderRadius: "25px",
        padding: "2px 8px",
        border: "none",
      },
      disableUnderline: true,
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={handleSearch}
            sx={{
              color: "#10AC84",
            }}
          >
            <SearchIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
    sx={{
      width: { xs: "90%", sm: "70%", md: "50%" },
      boxShadow: "none",
    }}
  />
</Box>


      {/* Display User Data */}
      <Paper
  sx={{
    flexGrow: 1,
    height: "auto",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: 2,
    overflow: "hidden",
    borderRadius: 2,
  }}
>
  {/* Heading and Add Icon */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 2,
    }}
  >
    <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
      <Typography variant="h6" component="div" gutterBottom>
        Información de Clientes
      </Typography>
    </Box>
    <IconButton
      onClick={() => {
        setSelectedUser(null); // Clear any selected user
        setIsAddModalOpen(true); // Open the Add modal
      }}
      sx={{
        color: blue[700],
        backgroundColor: "#E0F7FA",
        '&:hover': {
          backgroundColor: "#B2EBF2",
        },
      }}
    >
      <AddIcon />
    </IconButton>
  </Box>

  {/* Data Grid */}
  <DataGrid
  rows={userData.map((user) => ({
    id: user.id,
    cedula: user.id,
    username: user.name,
    email: user.email,
    role: user.assigned_agent || "No asignado",
    registration_date: user.registration_date,
  }))}
  columns={[
    { field: "cedula", headerName: "Cédula", width: 150 },
    { field: "username", headerName: "Nombre", width: 300 },
    { field: "email", headerName: "Correo", width: 300 },
    { field: "role", headerName: "Agente", width: 150 },
    { field: "registration_date", headerName: "Fecha Registro", width: 150 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 150, // Fija el ancho de la columna para evitar redimensionamiento
      sortable: false, // Evita que sea ordenable
      disableColumnMenu: true, // Deshabilita el menú contextual en esta columna
      resizable: false, // Impide que el usuario ajuste el ancho
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center", // Asegura que los íconos estén centrados
            alignItems: "center",
            gap: 0.5, // Reduce el espacio entre los íconos
            width: "100%",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <IconButton
            onClick={() => {
              setSelectedUser(params.row);
              setIsEditModalOpen(true);
            }}
            sx={{ padding: 0 }}
          >
            <EditIcon sx={{ color: green[700] }} />
          </IconButton>
          <IconButton
            onClick={() => {
              setSelectedUser(params.row);
              setIsDeleteModalOpen(true);
            }}
            sx={{ padding: 0 }}
          >
            <DeleteIcon sx={{ color: red[700] }} />
          </IconButton>
        </Box>
      ),
    },
  ]}
  autoHeight
  disableColumnMenu
  sx={{
    border: 1,
    borderRadius: 2,
    "& .MuiDataGrid-main": {
      overflowX: "hidden", // Bloquea el desplazamiento horizontal global
    },
    "& .MuiDataGrid-cell": {
      overflow: "hidden", // Previene desbordamiento en celdas
    },
    "& .MuiDataGrid-columnHeader": {
      pointerEvents: "none", // Deshabilita la interacción en la columna de acciones
    },
    "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus": {
      outline: "none", // Elimina el contorno al enfocar
    },
  }}
/>

{/* Add Modal */}
<Modal
  open={isAddModalOpen}
  onClose={() => {
    setIsAddModalOpen(false);
    resetAddModalState(); // Reinicia el formulario y los errores al cerrar el modal
  }}
>
  <Box
    sx={{
      width: { xs: "90%", sm: "75%", md: "50%" }, // Responsive width
      maxHeight: "90vh", // Prevent overflow
      overflowY: "auto", // Scroll content if it exceeds viewport height
      margin: "auto",
      padding: { xs: 2, sm: 3 },
      backgroundColor: "#fff",
      borderRadius: 2,
      boxShadow: 24,
      outline: "none", // Remove default focus outline
    }}
  >
    <Typography variant="h6" textAlign="center">Agregar Usuario</Typography>

    {/* Cédula */}
    <TextField
      fullWidth
      margin="normal"
      label="Cédula *"
      value={newUser.id}
      onBlur={() => setTouched((prev) => ({ ...prev, id: true }))} // Marca el campo como tocado
      onChange={(e) => {
        const regex = /^[0-9]{0,9}$/; // Solo permite hasta 9 números
        if (regex.test(e.target.value)) {
          setNewUser((prev) => ({ ...prev, id: e.target.value }));
        }
      }}
      error={touched.id && !/^\d{9}$/.test(newUser.id)} // Verifica que sean exactamente 9 dígitos
      helperText={
        touched.id && !/^\d{9}$/.test(newUser.id)
          ? "La cédula debe contener exactamente 9 dígitos numéricos."
          : ""
      }
      InputLabelProps={{ shrink: true }}
    />

    {/* Nombre */}
    <TextField
      fullWidth
      margin="normal"
      label="Nombre *"
      value={newUser.username}
      onBlur={() => setTouched((prev) => ({ ...prev, username: true }))} // Marca el campo como tocado
      onChange={(e) => {
        const regex = /^[a-zA-Z\s]*$/; // Solo letras y espacios
        if (regex.test(e.target.value)) {
          setNewUser((prev) => ({ ...prev, username: e.target.value }));
        }
      }}
      error={touched.username && !/^[a-zA-Z\s]+$/.test(newUser.username)}
      helperText={
        touched.username && !/^[a-zA-Z\s]+$/.test(newUser.username)
          ? "El nombre solo debe contener letras y espacios."
          : ""
      }
      InputLabelProps={{ shrink: true }}
    />

    {/* Correo */}
    <TextField
      fullWidth
      margin="normal"
      label="Correo *"
      value={newUser.email}
      onBlur={() => setTouched((prev) => ({ ...prev, email: true }))} // Marca el campo como tocado
      onChange={(e) =>
        setNewUser((prev) => ({ ...prev, email: e.target.value }))
      }
      error={touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)}
      helperText={
        touched.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)
          ? "Ingrese un correo válido."
          : ""
      }
      InputLabelProps={{ shrink: true }}
    />

    {/* Fecha de Registro */}
    <TextField
      fullWidth
      margin="normal"
      label="Fecha de Registro *"
      type="date"
      value={newUser.registration_date}
      onBlur={() => setTouched((prev) => ({ ...prev, registration_date: true }))}
      onChange={(e) =>
        setNewUser((prev) => ({
          ...prev,
          registration_date: e.target.value,
        }))
      }
      error={touched.registration_date && !newUser.registration_date}
      helperText={
        touched.registration_date && !newUser.registration_date
          ? "Debe seleccionar una fecha."
          : ""
      }
      InputLabelProps={{ shrink: true }}
    />

    {/* Agente Asignado */}
    <TextField
      fullWidth
      margin="normal"
      label="Agente Asignado *"
      value={newUser.role}
      onBlur={() => setTouched((prev) => ({ ...prev, role: true }))} // Marca el campo como tocado
      onChange={(e) => {
        const regex = /^[0-9]*$/; // Solo números
        if (regex.test(e.target.value)) {
          setNewUser((prev) => ({ ...prev, role: e.target.value }));
        }
      }}
      error={touched.role && !/^[0-9]+$/.test(newUser.role)}
      helperText={
        touched.role && !/^[0-9]+$/.test(newUser.role)
          ? "El agente asignado debe ser un número."
          : ""
      }
      InputLabelProps={{ shrink: true }}
    />

    {/* Contraseña */}
    <TextField
      fullWidth
      margin="normal"
      label="Contraseña *"
      type="password"
      value={newUser.password}
      onBlur={() => setTouched((prev) => ({ ...prev, password: true }))} // Marca el campo como tocado
      onChange={(e) =>
        setNewUser((prev) => ({ ...prev, password: e.target.value }))
      } // Actualiza el valor de contraseña
      error={touched.password && newUser.password.length < 8} // Error si es menor a 8 caracteres
      helperText={
        touched.password && newUser.password.length < 8
          ? "La contraseña debe tener al menos 8 caracteres."
          : ""
      }
      InputLabelProps={{ shrink: true }}
    />

    <Box display="flex" justifyContent="center" mt={3}>
      <Button
        variant="contained"
        color="success"
        onClick={handleAddUser}
        disabled={
          !newUser.id ||
          !/^\d{9}$/.test(newUser.id) || // Verifica que sean exactamente 9 dígitos
          !newUser.username ||
          !newUser.email ||
          !newUser.registration_date ||
          !newUser.role ||
          !newUser.password ||
          newUser.password.length < 8 ||
          !/^[a-zA-Z\s]+$/.test(newUser.username) ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email) ||
          !/^[0-9]+$/.test(newUser.role)
        }
      >
        Guardar
      </Button>

      <Button
        variant="outlined"
        onClick={() => {
          setIsAddModalOpen(false);
          resetAddModalState(); // Reinicia el formulario y los errores al cerrar
        }}
        sx={{ marginLeft: 2 }}
      >
        Cancelar
      </Button>
    </Box>
  </Box>
</Modal>



{/* Edit Modal */}
<Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
  <Box
    sx={{
      width: { xs: "90%", sm: "75%", md: "50%" },
      maxHeight: "90vh",
      overflowY: "auto",
      margin: "auto",
      padding: { xs: 2, sm: 3 },
      backgroundColor: "#fff",
      borderRadius: 2,
      boxShadow: 24,
      outline: "none",
    }}
  >
    <Typography variant="h6" textAlign="center">Editar Usuario</Typography>
    
    {/* Cédula */}
    <TextField
      fullWidth
      margin="normal"
      label="Cédula"
      value={selectedUser?.id || ""}
      InputProps={{ readOnly: true }}
    />

    {/* Nombre */}
    <TextField
      fullWidth
      margin="normal"
      label="Nombre"
      value={selectedUser?.username || ""}
      onChange={(e) => {
        const regex = /^[a-zA-Z\s]*$/; // Solo permite letras y espacios
        if (regex.test(e.target.value)) {
          setSelectedUser((prev) => ({ ...prev, username: e.target.value }));
        }
      }}
      error={!/^[a-zA-Z\s]+$/.test(selectedUser?.username || "")}
      helperText={!/^[a-zA-Z\s]+$/.test(selectedUser?.username || "") ? "Solo se permiten letras y espacios." : ""}
    />

    {/* Correo */}
    <TextField
      fullWidth
      margin="normal"
      label="Correo"
      value={selectedUser?.email || ""}
      onChange={(e) => {
        setSelectedUser((prev) => ({ ...prev, email: e.target.value }));
      }}
      error={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectedUser?.email || "")}
      helperText={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectedUser?.email || "") ? "Ingrese un correo válido." : ""}
    />

    {/* Fecha de Registro */}
    <TextField
      fullWidth
      margin="normal"
      label="Fecha de Registro"
      type="date"
      value={selectedUser?.registration_date?.split("T")[0] || ""}
      onChange={(e) => {
        setSelectedUser((prev) => ({ ...prev, registration_date: e.target.value }));
      }}
      InputLabelProps={{ shrink: true }}
    />

    {/* Agente Asignado */}
    <TextField
      fullWidth
      margin="normal"
      label="Agente Asignado"
      value={selectedUser?.role || ""}
      onChange={(e) => {
        const regex = /^[0-9]*$/; // Solo permite números
        if (regex.test(e.target.value)) {
          setSelectedUser((prev) => ({ ...prev, role: e.target.value }));
        }
      }}
      error={!/^[0-9]+$/.test(selectedUser?.role || "")}
      helperText={!/^[0-9]+$/.test(selectedUser?.role || "") ? "Solo se permiten números." : ""}
    />

    <Box display="flex" justifyContent="center" mt={3}>
      <Button
        variant="contained"
        color="success"
        onClick={handleEditUser}
        disabled={
          !selectedUser?.username ||
          !selectedUser?.email ||
          !selectedUser?.registration_date ||
          !selectedUser?.role ||
          !/^[a-zA-Z\s]+$/.test(selectedUser?.username || "") ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectedUser?.email || "") ||
          !/^[0-9]+$/.test(selectedUser?.role || "")
        }
      >
        Guardar
      </Button>
      <Button
        variant="outlined"
        onClick={() => setIsEditModalOpen(false)}
        sx={{ marginLeft: 2 }}
      >
        Cancelar
      </Button>
    </Box>
  </Box>
</Modal>




</Paper>
{/* Delete Confirmation Modal */}
<Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
  <Box
    sx={{
      width: { xs: "90%", sm: "60%", md: "30%" }, // Adjust the width for smaller modals
      maxHeight: "90vh",
      display: "flex", // Use flexbox for centering
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      margin: "auto",
      padding: 3,
      backgroundColor: "#fff",
      borderRadius: 4,
      boxShadow: 24,
      outline: "none",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)", // Center the modal
    }}
  >
    <Typography variant="h6" textAlign="center" mb={2}>
      ¿Está seguro de que desea eliminar este usuario?
    </Typography>
    <Box
      display="flex"
      justifyContent="center" // Center the buttons
      gap={1} // Add gap for consistent spacing between buttons
      mt={2}
    >
      <Button variant="contained" color="error" onClick={handleDelete}>
        Eliminar
      </Button>
      <Button
        variant="outlined"
        onClick={() => setIsDeleteModalOpen(false)}
      >
        Cancelar
      </Button>
    </Box>
  </Box>
</Modal>

{/* No Matches Modal */}
<Modal open={isNoMatchModalOpen} onClose={() => setIsNoMatchModalOpen(false)}>
  <Box
    sx={{
      width: { xs: "90%", sm: "75%", md: "40%" },
      maxHeight: "90vh",
      margin: "auto",
      padding: { xs: 2, sm: 3 },
      backgroundColor: "#fff",
      borderRadius: 2,
      boxShadow: 24,
      outline: "none",
    }}
  >
    <Typography variant="h6" textAlign="center" color="error.main">
      Usuario no encontrado
    </Typography>
    <Typography variant="body1" textAlign="center" mt={2}>
      No se ha encontrado ningún registro que coincida con la información proporcionada.
    </Typography>
    <Box display="flex" justifyContent="center" mt={3}>
      <Button
        variant="outlined"
        onClick={() => setIsNoMatchModalOpen(false)}
      >
        Cerrar
      </Button>
    </Box>
  </Box>
</Modal>

{/* Duplicate Modal */}
{duplicateError && (
  <Modal open={duplicateError} onClose={() => setDuplicateError(false)}>
    <Box
      sx={{
        width: "40%",
        margin: "auto",
        backgroundColor: "white",
        padding: 3,
        borderRadius: 2,
        boxShadow: 24,
        textAlign: "center",
      }}
    >
      <Typography variant="h6" color="error">
        Usuario o cliente ya existe
      </Typography>
      <Button onClick={() => setDuplicateError(false)} sx={{ marginTop: 2 }}>
        Cerrar
      </Button>
    </Box>
  </Modal>
)}


{/* Mensaje de Éxito */}
{successMessage && (
  <Modal open={!!successMessage} onClose={() => setSuccessMessage("")}>
    <Box
      sx={{
        width: { xs: "90%", sm: "75%", md: "40%" },
        maxHeight: "90vh",
        margin: "auto",
        padding: { xs: 2, sm: 3 },
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: 24,
        outline: "none",
      }}
    >
      <Typography variant="h6" textAlign="center" color="success.main">
        Éxito
      </Typography>
      <Typography variant="body1" textAlign="center" mt={2}>
        {successMessage}
      </Typography>
      <Box display="flex" justifyContent="center" mt={3}>
        <Button variant="outlined" onClick={() => setSuccessMessage("")}>
          Cerrar
        </Button>
      </Box>
    </Box>
  </Modal>
  
)}
    </>
  );
};

export default App;
