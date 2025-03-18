import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { addProduct } from "../../Services/productService"; 

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

function ProductFormModal({ open, handleClose, brands, onProductAdded }) {
  const [formData, setFormData] = useState({
    product_name: "",
    quantity: "",
    sale_price: "",
    purchase_price: "",
    description: "",
    stock_status: "",
    brand_id: "",
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
      const newProduct = await addProduct(formData);
      console.log("Product added successfully:", newProduct);
      if (onProductAdded) onProductAdded(newProduct);
      handleClose();
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Add Product</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box component="form" noValidate autoComplete="off" display="flex" flexDirection="column" gap={2}>
          <TextField label="Product Name" name="product_name" value={formData.product_name} onChange={handleChange} fullWidth />
          <TextField label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} fullWidth />
          <TextField label="Sale Price" name="sale_price" type="number" value={formData.sale_price} onChange={handleChange} fullWidth />
          <TextField label="Purchase Price" name="purchase_price" type="number" value={formData.purchase_price} onChange={handleChange} fullWidth />
          <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={3} />
          <TextField label="Stock Status" name="stock_status" value={formData.stock_status} onChange={handleChange} fullWidth />
          <TextField select label="Brand" name="brand_id" value={formData.brand_id} onChange={handleChange} fullWidth>
            {brands.map((brand) => (
              <MenuItem key={brand.id} value={brand.id}>
                {brand.brand_name}
              </MenuItem>
            ))}
          </TextField>

          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2, fontWeight: "bold" }}>
            ADD
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brands, setBrands] = useState([]);

  // Fetch brands from API or set manually
  React.useEffect(() => {
    // Fetch brands logic here
    setBrands([
      { id: 1, brand_name: "Brand A" },
      { id: 2, brand_name: "Brand B" },
    ]);
  }, []);

  return (
    <div>
      <IconButton onClick={() => setIsModalOpen(true)}>
        <AddIcon />
      </IconButton>
      <ProductFormModal open={isModalOpen} handleClose={() => setIsModalOpen(false)} brands={brands} />
    </div>
  );
}