import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
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

function EditSystemUserModal({ open, handleClose, userData, onUpdate }) {
  const [formData, setFormData] = useState({
    userName: "",
    phoneNumber: "",
    email: "",
    password: "",
    role: "",
    address: "",
  });
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (userData && userData.userId) {
      setFormData({
        userName: userData.userName || "",
        phoneNumber: userData.phoneNumber || "",
        email: userData.email || "",
        password: "", // keep it blank or handle accordingly
        role: userData.role || "",
        address: userData.address || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!userData || !userData.userId) {
      console.error("User ID is missing.");
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (profilePic) data.append("profilePic", profilePic);

const response = await axios.put(`${API_URL}/user-update/${userData.userId}`, data, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  },
});


      console.log("System user updated:", response.data);
      if (onUpdate) onUpdate(response.data);
      handleClose();
    } catch (error) {
      console.error("Failed to update system user:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Edit System User</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box component="form" noValidate autoComplete="off" display="flex" flexDirection="column" gap={2}>
          <TextField label="User Name" name="userName" value={formData.userName} onChange={handleChange} fullWidth />
          <TextField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} fullWidth />
          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
          <TextField label="Password" name="password" value={formData.password} onChange={handleChange} fullWidth />

          <Select name="role" value={formData.role} onChange={handleChange} displayEmpty fullWidth>
            <MenuItem value="" disabled>Select Role</MenuItem>
            <MenuItem value="Super Admin">Super Admin</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </Select>

          <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth multiline rows={2} />

          <Button variant="outlined" component="label">
            Upload Profile Picture
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>
          {profilePic && (
            <Typography variant="body2" color="textSecondary">
              Selected: {profilePic.name}
            </Typography>
          )}

          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2, fontWeight: "bold" }}>
            Save Changes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default function EditSystemUserButton({ user, onUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <IconButton
        onClick={() => {
          if (!user || !user.userId) {
            console.error("User data is missing.");
            return;
          }
          setIsModalOpen(true);
        }}
      >
        <EditIcon />
      </IconButton>
      {isModalOpen && (
        <EditSystemUserModal
          open={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          userData={user}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}
