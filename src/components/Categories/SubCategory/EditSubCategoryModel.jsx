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
import EditIcon from "@mui/icons-material/Edit";
import { editSubcategory } from "../../../Services/subCategoryService"; // Ensure service functions exist
import { fetchCategories } from "../../../Services/categoryService"; // Ensure service functions exist


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

function EditSubCategoryModal({ open, handleClose, subCategoryData, onUpdate }) {
  const [formData, setFormData] = useState({
    SubCategoryName: "",
    description: "",
    subCategoryImage: null,
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);

 useEffect(() => {
  if (subCategoryData?.SubCategoryId) {
    setFormData({
      SubCategoryName: subCategoryData.SubCategoryName || "",
      description: subCategoryData.description || "",
      categoryId: subCategoryData.categoryId || "",
      subCategoryImage: null,
    });
  }


  
  fetchCategories()
    .then((res) => {
      console.log("Fetched categories:", res.data);
      setCategories(res.data.data); // <- Adjust if needed
      console.log("ooooooocategoriesooo>",res.data.data)
    })
    .catch((error) => console.error("Error fetching categories:", error));
}, [subCategoryData]);



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

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      subCategoryImage: e.target.files[0],
    }));
  };

  const handleSubmit = async () => {
    if (!subCategoryData || !subCategoryData.SubCategoryId) {
      console.error("Subcategory ID is missing.");
      return;
    }

    try {
      const updateData = new FormData();
      updateData.append("categoryName", formData.SubCategoryName); // assuming backend expects `categoryName`
      updateData.append("description", formData.description);
      updateData.append("categoryId", formData.categoryId);
      if (formData.subCategoryImage) {
        updateData.append("subCategoryImage", formData.subCategoryImage);
      }

      await editSubcategory(subCategoryData.SubCategoryId, updateData);
      onUpdate();
      handleClose();
    } catch (error) {
      console.error("Error updating subcategory:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Edit Subcategory</Typography>
          <IconButton onClick={handleClose}><CloseIcon /></IconButton>
        </Box>

        <Box component="form" noValidate autoComplete="off" display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Subcategory Name"
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


          <input type="file" accept="image/*" onChange={handleFileChange} />
          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>Save</Button>
        </Box>
      </Box>
    </Modal>
  );
}


export default function EditSubCategoryButton({ subCategory, onUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("Subcategory in EditSubCategoryButton:", subCategory); // Check if subcategory is available

  return (
    <div>
      <IconButton
        onClick={() => {
          if (!subCategory || !subCategory.SubCategoryId) {
            console.error("Subcategory data is missing in EditSubCategoryButton:", subCategory);
            return;
          }
          setIsModalOpen(true);
        }}
      >
        <EditIcon />
      </IconButton>
      {isModalOpen && (
        <EditSubCategoryModal
          open={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          subCategoryData={subCategory} // Ensure subcategory data is passed
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}
