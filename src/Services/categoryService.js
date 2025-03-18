import axios from 'axios';

const API_URL = 'http://localhost:3001/web/category';
const token = localStorage.getItem("accessToken");

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-all-category`, { headers });
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Add a category
export const addCategory = async (categoryData) => {
  try {
    const formData = new FormData();
    formData.append('category_name', categoryData.category_name);
    formData.append('description', categoryData.description);
    formData.append('parent_id', categoryData.parent_id);
    formData.append('image', categoryData.image); // Assuming image upload

    const response = await axios.post(`${API_URL}/create-category`, formData, { 
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// Edit a category
export const editCategory = async (category_id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/update-category`, { category_id, ...updatedData }, { headers });
    console.log("Update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (category_id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-category-by-id`, {
      headers,
      data: { category_id }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// Upload CSV
export const uploadCategoryCSV = async (csvFile) => {
  try {
    const formData = new FormData();
    formData.append("csv_file", csvFile);

    const response = await axios.post(`${API_URL}/bulk-upload-category`, formData, { 
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading category CSV:", error);
    throw error;
  }
};
