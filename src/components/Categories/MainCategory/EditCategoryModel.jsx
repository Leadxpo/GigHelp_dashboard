import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { editCategory } from "../../../Services/categoryService";

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

function EditCategoryModal({ open, handleClose, categoryData, onUpdate }) {
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    console.log("Category data in EditCategoryModal:", categoryData);

    if (categoryData && categoryData.categoryId) {
      setFormData({
        categoryName: categoryData.categoryName || "",
        description: categoryData.description || "",
        image: null,
      });
    }
  }, [categoryData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async () => {
    if (!categoryData || !categoryData.categoryId) {
      console.error("Category ID is missing.");
      return;
    }

    try {
      await editCategory(categoryData.categoryId, formData);
      onUpdate(); // Ensure this function updates the category list
      handleClose();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Edit Category</Typography>
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
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              padding: "8px 16px",
              fontSize: "16px",
              marginLeft: "auto",
              display: "block",
              fontWeight: "bold",
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default function EditCategoryButton({ category, onUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("Category in EditCategoryButton:", category); // Check if category is available

  return (
    <div>
      <IconButton
        onClick={() => {
          if (!category || !category.categoryId) {
            console.error("Category data is missing in EditCategoryButton:", category);
            return;
          }
          setIsModalOpen(true);
        }}
      >
        <EditIcon />
      </IconButton>
      {isModalOpen && (
        <EditCategoryModal
          open={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          categoryData={category} // Ensure category data is passed
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}
