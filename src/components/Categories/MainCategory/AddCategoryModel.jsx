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

const API_URL = "http://localhost:3001/dashboard/categories";
const token = localStorage.getItem("accessToken");

// ✅ Move this outside the component
const addCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

function CategoryFormModal({ open, handleClose, onCategoryAdded }) {
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("categoryName", formData.categoryName);
      data.append("description", formData.description);
      if (imageFile) data.append("categoryImage", imageFile);

      const newCategory = await addCategory(data);
      console.log("Category added successfully:", newCategory);
      if (onCategoryAdded) onCategoryAdded(newCategory);
      handleClose();
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Add Category</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box component="form" noValidate autoComplete="off" display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Category Name"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            fullWidth
          />
          <Button variant="outlined" component="label">
            Upload Category Image
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>
          {imageFile && (
            <Typography variant="body2" color="textSecondary">
              Selected: {imageFile.name}
            </Typography>
          )}
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
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
      <CategoryFormModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
