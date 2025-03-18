import React, { useState, useEffect } from "react";
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
import EditIcon from "@mui/icons-material/Edit";
import { editProduct } from "../../Services/productService";

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

function EditProductModal({ open, handleClose, productData, onUpdate }) {
  const [formData, setFormData] = useState({
    product_name: "",
    quantity: "",
    sale_price: "",
    purchase_price: "",
    description: "",
    stock_status: "",
  });

  useEffect(() => {
    if (productData && productData.product_id) {
      setFormData({
        product_name: productData.product_name || "",
        quantity: productData.quantity || "",
        sale_price: productData.sale_price || "",
        purchase_price: productData.purchase_price || "",
        description: productData.description || "",
        stock_status: productData.stock_status || "",
      });
    }
  }, [productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!productData || !productData.product_id) {
      console.error("Product ID is missing.");
      return;
    }

    try {
      await editProduct(productData.product_id, formData);
      onUpdate();
      handleClose();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Edit Product</Typography>
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
          <TextField
            select
            label="Stock Status"
            name="stock_status"
            value={formData.stock_status}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="In Stock">In Stock</MenuItem>
            <MenuItem value="Out of Stock">Out of Stock</MenuItem>
          </TextField>

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
              "&:hover": { backgroundColor: "primary.dark" },
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default function EditProductButton({ product, onUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <IconButton onClick={() => {
        if (!product || !product.product_id) {
          console.error("Product data is missing in EditProductButton:", product);
          return;
        }
        setIsModalOpen(true);
      }}>
        <EditIcon />
      </IconButton>
      {isModalOpen && (
        <EditProductModal
          open={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          productData={product}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}
