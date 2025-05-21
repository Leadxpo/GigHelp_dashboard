import axios from 'axios';

const API_URL = 'http://localhost:3001/dashboard/categories';
const token = localStorage.getItem("accessToken");
console.log("tokennnnn>",token)
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-all`, { headers });
    console.log("categories....>", response.data)
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
    formData.append('categoryName', categoryData.categoryName);
    formData.append('description', categoryData.description);
    formData.append('categoryImage', categoryData.categoryImage); // Assuming image upload

    const response = await axios.post(`${API_URL}/create`, formData, { 
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

export const editCategory = async (categoryId, updatedData) => {
  try {
    const response = await axios.put(
      `${API_URL}/update/${categoryId}`, // 👈 Pass categoryId in the URL
      updatedData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error.response?.data || error.message);
    throw error;
  }
};


// Delete a category
export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${categoryId}`, {
      headers,
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
