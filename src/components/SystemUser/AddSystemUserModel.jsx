import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { Select, MenuItem } from "@mui/material";

import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const API_URL = "http://localhost:3001/dashboard/systemuser";
const token = localStorage.getItem("accessToken");

const addSystemUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding system user:", error);
    throw error;
  }
};

function SystemUserFormModal({ open, handleClose, onUserAdded }) {
  const [formData, setFormData] = useState({
    userName: "",
    phoneNumber: "",
    email: "",
    password: "",
    role: "",
    address: "",
  });
  const [profilePic, setProfilePic] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("userName", formData.userName);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("role", formData.role);
      data.append("address", formData.address);
      if (profilePic) data.append("profilePic", profilePic);

      const newUser = await addSystemUser(data);
      console.log("System user added successfully:", newUser);
      if (onUserAdded) onUserAdded(newUser);
      handleClose();
    } catch (error) {
      console.error("Failed to add system user:", error);
    }
  };

  return (
   <Modal open={open} onClose={handleClose}>
  <Box sx={{ ...style, maxHeight: "90vh", overflowY: "auto" }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6">Add System User</Typography>
      <IconButton onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </Box>

    <Box
      component="form"
      noValidate
      autoComplete="off"
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <TextField
        label="User Name"
        name="userName"
        value={formData.userName}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Phone Number"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        fullWidth
      />

      {/* Role dropdown */}
      <Select
        label="Role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        displayEmpty
        fullWidth
      >
        <MenuItem value="" disabled>Select Role</MenuItem>
        <MenuItem value="Super Admin">Super Admin</MenuItem>
        <MenuItem value="Admin">Admin</MenuItem>
      </Select>

      <TextField
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        fullWidth
        multiline
        rows={2}
      />
      <Button variant="outlined" component="label">
        Upload Profile Picture
        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
      </Button>
      {profilePic && (
        <Typography variant="body2" color="textSecondary">
          Selected: {profilePic.name}
        </Typography>
      )}
      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{ mt: 2, fontWeight: "bold" }}
      >
        ADD
      </Button>
    </Box>
  </Box>
</Modal>

  );
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <IconButton onClick={() => setIsModalOpen(true)}>
        <AddIcon />
      </IconButton>
      <SystemUserFormModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
