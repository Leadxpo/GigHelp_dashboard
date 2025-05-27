import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Chip,
  Paper,
  Stack,
  Card,
  Button
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tables from "../../components/Users/MoreDetailsTables";
import { useLocation } from "react-router-dom";
import axios from "axios";


const API_URL = "http://localhost:3001/dashboard";
const token = localStorage.getItem("accessToken");


const UserDetails = () => {
  const location = useLocation();
  const { userDetails } = location?.state || {};
  const userId = userDetails?.userId;

  const [statuses, setStatuses] = useState(
    Array.isArray(userDetails?.identityProof)
      ? userDetails.identityProof.map(() => "")
      : []
  );

  const [descriptions, setDescriptions] = useState(
    Array.isArray(userDetails?.identityProof)
      ? userDetails.identityProof.map(() => "")
      : []
  );

  let identityProofs = [];

  if (Array.isArray(userDetails?.identityProof)) {
    identityProofs = userDetails.identityProof;
  } else if (typeof userDetails?.identityProof === "string") {
    try {
      identityProofs = JSON.parse(userDetails.identityProof || "[]");
    } catch (error) {
      console.error("Invalid JSON in identityProof:", error);
    }
  }

  const handleStatusChange = (index, status) => {
    const newStatuses = [...statuses];
    newStatuses[index] = status;
    setStatuses(newStatuses);
  };

  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
  };

  const handleSubmit = async () => {
  try {
    const response = await axios.put(
      `http://localhost:3001/dashboard/users/user-update/${userId}`,
      {
        status: statuses,
        remarks: descriptions,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("User status and remarks updated successfully!");
    console.log("Update response:", response.data);
  } catch (error) {
    console.error("Error updating user details:", error);
    alert("Failed to update user details.");
  }
};

  return (
    <Box p={0}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="bold">
            User ID: {userDetails.userId}
          </Typography>
          <Chip label="Approved" color="success" sx={{ fontWeight: "bold", fontSize: "16px" }} />
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4} display="flex" justifyContent="center" alignItems="center">
            {userDetails?.profilePic && (
              <Avatar
                alt="User Profile"
                src={`http://localhost:3001/storege/userdp/${userDetails.profilePic}`}
                sx={{ width: 200, height: 200 }}
              />
            )}
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {[
                ["Name", userDetails.userName],
                ["Phone number", userDetails.phoneNumber],
                ["Email", userDetails.email],
                ["Number of Task", "675"],
                ["Number of Beddings", "657"],
                ["Number of Works", "786"],
                ["Number of Disputes", "65"],
              ].map(([label, value], index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ backgroundColor: "#f0f0f0", borderRadius: 2, p: 2 }}>
                    <Typography variant="body1">
                      <strong>{label} :</strong> {value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Typography variant="h6" fontWeight="bold" mb={2} mt={2}>
          Skills
        </Typography>

        {Array.isArray(userDetails.skills) && userDetails.skills.length > 0 ? (
          userDetails.skills.map((skill, index) => (
            <Paper
              key={index}
              elevation={1}
              sx={{
                borderRadius: 3,
                padding: 3,
                mb: 2,
                border: "1px solid #ccc",
              }}
            >
              <Stack spacing={2}>
                {[
                  `Skill Name : ${skill.work}`,
                  `Title : ${skill.title}`,
                  `Experience : ${skill.experience}`,
                ].map((text, idx) => (
                  <Box
                    key={idx}
                    sx={{ backgroundColor: "#eaeaea", borderRadius: 2, padding: 1.5 }}
                  >
                    <Typography variant="body1" fontWeight={500}>
                      {text}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No skills added.
          </Typography>
        )}

        <Typography variant="h6" gutterBottom fontWeight="bold">
          KYC Documents
        </Typography>

        {identityProofs.map((item, index) => (
          <Paper
            key={index}
            elevation={1}
            sx={{
              borderRadius: 3,
              padding: 3,
              border: "1px solid #ccc",
              mt: 3,
            }}
          >
            <Box display="flex" alignItems="stretch" gap={2}>
              <Card
                sx={{
                  width: 250,
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 1,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Box position="absolute" top={8} left={8}>
                  <Chip
                    icon={<CheckCircleIcon sx={{ color: "white" }} />}
                    label=""
                    sx={{
                      bgcolor: "green",
                      height: 28,
                      width: 28,
                      borderRadius: "50%",
                    }}
                  />
                </Box>

                <Box mt={4}>
                  <img
                    src={`http://localhost:3001/storege/userdp/${item}`}
                    alt="KYC Document"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Card>

              <Card
                sx={{
                  flex: 1,
                  borderRadius: 3,
                  boxShadow: 3,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Status
                  </Typography>
                  <select
                    value={statuses[index]}
                    onChange={(e) => handleStatusChange(index, e.target.value)}
                    style={{
                      padding: "10px",
                      width: "100%",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <option value="">Select Status</option>
                    <option value="Declined">Declined</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Description
                  </Typography>
                  <textarea
                    rows={4}
                    placeholder="Enter description"
                    value={descriptions[index]}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      backgroundColor: "#f5f5f5",
                      resize: "none",
                    }}
                  />
                </Box>
              </Card>
            </Box>
          </Paper>
        ))}

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            sx={{ borderRadius: 2 }}
          >
            Submit
          </Button>
        </Box>

        <Box mt={4}>
          <Tables userDetails={userDetails} />
        </Box>
      </Paper>
    </Box>
  );
};

export default UserDetails;
