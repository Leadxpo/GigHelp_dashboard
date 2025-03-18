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
import { addBrand } from "../../Services/brandService"; 

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

function BrandFormModal({ open, handleClose , onBrandAdded }) {
  const [formData, setFormData] = useState({
    brand_name: "",
    brand_image: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const newBrand = await addBrand(formData);
      console.log("Brand added successfully:", newBrand);
      if (onBrandAdded) onBrandAdded(newBrand);
      handleClose();
    } catch (error) {
      console.error("Failed to add brand:", error);
    }
  };
  

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Add Brand</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box component="form" noValidate autoComplete="off" display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Brand Name"
            name="brand_name"
            value={formData.brand_name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Brand Image URL"
            name="brand_image"
            value={formData.brand_image}
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
      <BrandFormModal open={isModalOpen} handleClose={() => setIsModalOpen(false)} />
    </div>
  );
}
