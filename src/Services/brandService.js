import axios from 'axios';

const API_URL = 'http://localhost:3001/web/brand';
const token = localStorage.getItem("accessToken");

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

// Fetch all brands
export const fetchBrands = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-all-brand`, { headers });
    const data = response.data.data || [];
    
    // Store brand IDs in localStorage
    localStorage.setItem('brand_id', JSON.stringify(data.map(brand => brand.brand_id)));

    return data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

// Add a brand
export const addBrand = async (brandData) => {
  try {
    const formData = new FormData();
    formData.append('brand_name', brandData.brand_name);
    formData.append('description', brandData.description);

    const response = await axios.post(`${API_URL}/create-brand`, formData, { 
      headers: {
        'Authorization': `Bearer ${token}` // Let axios set correct content type for FormData
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error adding brand:", error);
    throw error;
  }
};

// Edit a brand
export const editBrand = async (brand_id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/update-brand`, { brand_id, ...updatedData }, { headers });
    console.log("Update response:", response.data); // Debugging API response
    return response.data;
  } catch (error) {
    console.error("Error updating brand:", error.response?.data || error.message);
    throw error;
  }
};


export const deleteBrand = async (brand_id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-brand-by-id`, {
      headers,
      data: { brand_id }  
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting brand:", error);
    throw error;
  }
};

// Upload CSV

export const uploadCSV = async (csvFile) => {
  try {
    const formData = new FormData();
    formData.append("csv_file", csvFile);

    const response = await axios.post(`${API_URL}/bulk-upload-brand`, formData, { 
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading CSV:", error);
    throw error;
  }
};
