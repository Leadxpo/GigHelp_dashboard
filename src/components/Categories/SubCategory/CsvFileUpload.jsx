import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Modal,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadSubcategoryCSV } from "../../../Services/subCategoryService"; // Import the API function

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function SubCategoryBulkUploadModal({ open, handleClose }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a CSV file.");
      return;
    }

    try {
      await uploadSubcategoryCSV(selectedFile);
      alert("SubCategory CSV file uploaded successfully!");
      handleClose();
    } catch (error) {
      console.error("Error uploading SubCategory CSV:", error);
      alert("Failed to upload CSV.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {/* Close Button at Top Right */}
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" sx={{ textAlign: "left", mb: 2 }}>
          Upload SubCategory CSV File
        </Typography>
        <input type="file" accept=".csv" onChange={handleFileChange} style={{ display: "block", marginBottom: 20 }} />

        {/* Upload Button at Bottom Left */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleUpload}
            sx={{ backgroundColor: "primary.main", color: "white" }}
          >
            Upload
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default function SubCategoryBulkUploadButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <IconButton onClick={() => setIsModalOpen(true)}>
        <CloudUploadIcon fontSize="small" />
      </IconButton>
      {isModalOpen && (
        <SubCategoryBulkUploadModal open={isModalOpen} handleClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
