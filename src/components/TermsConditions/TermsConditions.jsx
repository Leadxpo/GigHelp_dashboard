import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Input, Paper } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from '@mui/icons-material/Delete';


const API_URL = "http://localhost:3001/dashboard/t&C"; // Base API endpoint

const token = localStorage.getItem("accessToken");

const TermsAndConditionsUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFileId, setUploadedFileId] = useState(null);
  const [paragraph, setParagraph] = useState(""); // 👈 for description

  useEffect(() => {
    // Fetch latest terms and conditions
    fetch(`${API_URL}/get-all`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          const latest = data.data[data.data.length - 1]; // get latest uploaded
          setParagraph(latest.description || "");
        }
      })
      .catch((err) => console.error("Error fetching paragraph:", err));
  }, [uploadedFileId]); // Refetch when a new file is uploaded

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid PDF file.");
      setSelectedFile(null);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile || !token) {
      alert("Please upload a PDF file and ensure you are logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("termsFile", selectedFile);

    fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("File uploaded successfully!");
          setUploadedFileId(data.data.id); // Triggers refetch of paragraph
        } else {
          alert("Upload failed.");
        }
      })
      .catch((error) => {
        console.error("Upload failed:", error);
      });
  };
console.log("paragraph-=-=-=-=-=-",paragraph.id)

  const id = paragraph.id
const handleDelete = (id) => {
  if (!window.confirm("Are you sure you want to delete this PDF?")) return;
  fetch(`${API_URL}/delete/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("PDF deleted successfully.");
        setUploadedFileId(null);
        setSelectedFile(null);
        setParagraph("");
      } else {
        alert("Failed to delete PDF.");
      }
    })
    .catch((err) => console.error("Delete error:", err));
};




  return (
    <>
      {/* Upload Section */}
     <Paper
  elevation={3}
  sx={{ p: 3, borderRadius: 2, mt: 4, maxWidth: 1100, mx: "auto" }}
>
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
      Upload PDF
    </Typography>

    {/* Delete icon on right */}
    {/* {uploadedFileId && ( */}
      <DeleteIcon
        sx={{ color: 'error.main', cursor: 'pointer' }}
        onClick={() => handleDelete(uploadedFileId)}
      />
    {/* )} */}
  </Box>

  <Box display="flex" alignItems="center" gap={2} mt={2}>
    <Input
      type="file"
      inputProps={{ accept: "application/pdf" }}
      onChange={handleFileChange}
    />
    {selectedFile && <PictureAsPdfIcon color="error" fontSize="large" />}
    {/* {selectedFile && <Typography>{selectedFile.name}</Typography>} */}
  </Box>

  <Box mt={3}>
    <Button variant="contained" color="primary" onClick={handleSubmit}>
      Upload PDF
    </Button>
  </Box>
</Paper>


      {/* Paragraph Display Section */}
      {paragraph && (
        <Paper elevation={2} sx={{ p: 3, mt: 4, maxWidth: 1100, mx: "auto" }}>
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Terms and Conditions
          </Typography>

          <Typography sx={{ whiteSpace: "pre-line" }}>{paragraph}</Typography>
        </Paper>
      )}
    </>
  );
};

export default TermsAndConditionsUpload;
