import axios from 'axios';

const API_URL = 'http://localhost:3001/web/product';
const token = localStorage.getItem("accessToken");

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

// Fetch all products
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-all-product`, { headers });
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Add a product
export const addProduct = async (productData) => {
  try {
    const formData = new FormData();
    formData.append('product_name', productData.product_name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('brand_id', productData.brand_id);
    formData.append('image', productData.image); // Assuming image upload

    const response = await axios.post(`${API_URL}/create-product`, formData, { 
      headers: {
        'Authorization': `Bearer ${token}` // Let axios set correct content type for FormData
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// Edit a product
export const editProduct = async (product_id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/update-product`, { product_id, ...updatedData }, { headers });
    console.log("Update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (product_id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-product-by-id`, {
      headers,
      data: { product_id }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Upload CSV
export const uploadProductCSV = async (csvFile) => {
  try {
    const formData = new FormData();
    formData.append("csv_file", csvFile);

    const response = await axios.post(`${API_URL}/bulk-upload-product`, formData, { 
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading product CSV:", error);
    throw error;
  }
};
