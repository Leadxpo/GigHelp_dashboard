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
import { editBrand } from "../../Services/brandService";

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

function EditBrandModal({ open, handleClose, brandData, onUpdate }) {
  const [formData, setFormData] = useState({
    brand_name: "",
    description: "",
    brand_image: null,
  });

  useEffect(() => {
    console.log("Brand data in EditBrandModal:", brandData);
  
    if (brandData && brandData.brand_id) {
      setFormData({
        brand_name: brandData.brand_name || "",
        description: brandData.description || "",
        brand_image: null,
      });
    }
  }, [brandData]);
  

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
      brand_image: e.target.files[0],
    }));
  };

  const handleSubmit = async () => {
    if (!brandData || !brandData.brand_id) {
      console.error("Brand ID is missing.");
      return;
    }
  
    try {
      await editBrand(brandData.brand_id, formData);
      onUpdate(); // Ensure this function updates the brand list
      handleClose();
    } catch (error) {
      console.error("Error updating brand:", error);
    }
  };
  
  
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Edit Brand</Typography>
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
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          <input type="file" accept="brand_image" onChange={handleFileChange} />
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

export default function EditBrandButton({ brand, onUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("Brand in EditBrandButton:", brand); // Check if brand is available

  return (
    <div>
      <IconButton onClick={() => {
        if (!brand || !brand.brand_id) {
          console.error("Brand data is missing in EditBrandButton:", brand);
          return;
        }
        setIsModalOpen(true);
      }}>
        <EditIcon />
      </IconButton>
      {isModalOpen && (
        <EditBrandModal
          open={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          brandData={brand} // Ensure brand data is passed
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}
