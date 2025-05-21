import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { addSubcategory } from '../../../Services/subCategoryService';
import { fetchCategories } from "../../../Services/categoryService";


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

function SubCategoryFormModal({ open, handleClose, onSubCategoryAdded }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    SubCategoryName: "",
    categoryId: "",
    description: "",
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        setCategories(response);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const newSubCategory = await addSubcategory(formData);
      console.log("SubCategory added successfully:", newSubCategory);
      if (onSubCategoryAdded) onSubCategoryAdded(newSubCategory);
      handleClose();
    } catch (error) {
      console.error("Failed to add subcategory:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Add SubCategory</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box component="form" noValidate autoComplete="off" display="flex" flexDirection="column" gap={2}>
          <FormControl fullWidth>
            <InputLabel>Select Category</InputLabel>
            <Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              fullWidth
            >
              {categories.map((category) => (
                <MenuItem key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="SubCategory Name"
            name="SubCategoryName"
            value={formData.SubCategoryName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
<TextField
  type="file"
  onChange={(e) =>
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }))
  }
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
      <SubCategoryFormModal open={isModalOpen} handleClose={() => setIsModalOpen(false)} />
    </div>
  );
}
