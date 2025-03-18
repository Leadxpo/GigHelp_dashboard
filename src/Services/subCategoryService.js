import axios from 'axios';

const API_URL = 'http://localhost:3001/web/subcategory';
const token = localStorage.getItem("accessToken");

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

// Fetch all subcategories
export const fetchSubcategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-all-subcategory`, { headers });
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
};

// Add a subcategory
export const addSubcategory = async (subcategoryData) => {
  try {
    const formData = new FormData();
    formData.append('subcategory_name', subcategoryData.subcategory_name);
    formData.append('description', subcategoryData.description);
    formData.append('category_id', subcategoryData.category_id);
    formData.append('image', subcategoryData.image); // Assuming image upload

    const response = await axios.post(`${API_URL}/create-subcategory`, formData, { 
      headers: {
        'Authorization': `Bearer ${token}` // Let axios set correct content type for FormData
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error adding subcategory:", error);
    throw error;
  }
};

// Edit a subcategory
export const editSubcategory = async (subcategory_id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/update-subcategory`, { subcategory_id, ...updatedData }, { headers });
    console.log("Update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating subcategory:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a subcategory
export const deleteSubcategory = async (subcategory_id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-subcategory-by-id`, {
      headers,
      data: { subcategory_id }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    throw error;
  }
};

// Upload CSV
export const uploadSubcategoryCSV = async (csvFile) => {
  try {
    const formData = new FormData();
    formData.append("csv_file", csvFile);

    const response = await axios.post(`${API_URL}/bulk-upload-subcategory`, formData, { 
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading subcategory CSV:", error);
    throw error;
  }
};
