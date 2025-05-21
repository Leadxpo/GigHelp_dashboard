import axios from 'axios';

const API_URL = 'http://localhost:3001/dashboard/subcategories';
const token = localStorage.getItem("accessToken");

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

// Fetch all subcategories
export const fetchSubcategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-all`, { headers });
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
};

export const addSubcategory = async (subcategoryData) => {
  try {
    const formData = new FormData();
    formData.append('SubCategoryName', subcategoryData.SubCategoryName);
    formData.append('description', subcategoryData.description);
    formData.append('categoryId', subcategoryData.categoryId);
    
    if (subcategoryData.image) {
      formData.append('image', subcategoryData.image);
    }

    const response = await axios.post(`${API_URL}/create-subcategory`, formData, { 
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error adding subcategory:", error);
    throw error;
  }
};

export const editSubcategory = async (SubCategoryId, updatedFormData) => {
  try {
    const response = await axios.put(
      `${API_URL}/update/${SubCategoryId}`,
      updatedFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token}`,

        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating subcategory:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a category
export const deleteSubcategory = async (SubCategoryId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${SubCategoryId}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
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
