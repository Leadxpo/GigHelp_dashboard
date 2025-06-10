import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Stack,
  Typography,
  TextField,
  Paper,
} from "@mui/material";
import {
  Edit,
  Email,
  LocationOn,
  Person,
  Phone,
  Lock,
  VerifiedUser,
} from "@mui/icons-material";

const ProfilePage = () => {
  const [userData, setUserData] = useState(
    () => JSON.parse(localStorage.getItem("userData")) || {}
  );
  const fileInputRef = useRef(null);

  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    userName: userData?.userName || "",
    email: userData?.email || "",
    phoneNumber: userData?.phoneNumber || "",
    address: userData?.address || "",
    role: userData?.role || "",
    password: "",
  });

  const handleEditToggle = () => {
    setIsEditing(true);
    setUpdateSuccess(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setUserData((prev) => ({
        ...prev,
        profilePic: previewUrl,
      }));
    }
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const formData = new FormData();
      formData.append("userName", profileData.userName);
      formData.append("email", profileData.email);
      formData.append("phoneNumber", profileData.phoneNumber);
      formData.append("address", profileData.address);
      formData.append("role", profileData.role);

      if (profileData.password) {
        formData.append("password", profileData.password);
      }

      if (selectedImageFile) {
        formData.append("profilePic", selectedImageFile);
      }

      const res = await axios.put(
        `http://localhost:3001/user/user-update/${userData.userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data.data));
      setUserData(res.data.data);
      setIsEditing(false);
      setUpdateSuccess(true);
      alert("Profile updated successfully");
      window.location.reload();
    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
      alert("Failed to update profile");
    }
  };

  return (
    <Paper elevation={3} sx={{ m: 0, p: 4 }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
          Profile Details
        </Typography>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <Grid container spacing={4}>
          <Grid item>
            <Avatar
              src={
                selectedImageFile
                  ? URL.createObjectURL(selectedImageFile)
                  : userData?.profilePic?.startsWith("blob:")
                  ? userData.profilePic
                  : userData?.profilePic
                  ? `http://localhost:3001/storege/userdp/${userData.profilePic}`
                  : ""
              }
              sx={{
                width: 150,
                height: 150,
                border: "4px solid #1B88CA",
                boxShadow: 4,
              }}
            />
          </Grid>
          <Grid item>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              {userData?.userName || "Your Name"}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={handleChangePhotoClick}>
                Change Photo
              </Button>
            </Stack>

            {isEditing && (
              <Box mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateProfile}
                >
                  Update
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>

        <Card sx={{ mt: 5, p: 3, borderRadius: 3, boxShadow: 3, maxWidth: 1500, mx: "auto" }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h6" fontWeight="bold">
                Profile Details
              </Typography>
              <IconButton onClick={handleEditToggle}>
                <Edit />
              </IconButton>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={2}>
                  <Person sx={{ color: "#1B88CA" }} />
                  {isEditing ? (
                    <TextField
                      size="small"
                      value={profileData.userName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, userName: e.target.value })
                      }
                    />
                  ) : (
                    <Typography>{profileData.userName}</Typography>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={2}>
                  <Email sx={{ color: "#1B88CA" }} />
                  {isEditing ? (
                    <TextField
                      size="small"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                    />
                  ) : (
                    <Typography>{profileData.email}</Typography>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={2}>
                  <Phone sx={{ color: "#1B88CA" }} />
                  {isEditing ? (
                    <TextField
                      size="small"
                      value={profileData.phoneNumber}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phoneNumber: e.target.value })
                      }
                    />
                  ) : (
                    <Typography>{profileData?.phoneNumber}</Typography>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={2}>
                  <LocationOn sx={{ color: "#1B88CA" }} />
                  {isEditing ? (
                    <TextField
                      size="small"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({ ...profileData, address: e.target.value })
                      }
                    />
                  ) : (
                    <Typography>{profileData?.address}</Typography>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={2}>
                  <VerifiedUser sx={{ color: "#1B88CA" }} />
                  {isEditing ? (
                    <TextField
                      size="small"
                      value={profileData?.role}
                      onChange={(e) =>
                        setProfileData({ ...profileData, role: e.target.value })
                      }
                    />
                  ) : (
                    <Typography>{profileData?.role}</Typography>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={2}>
                  <Lock sx={{ color: "#1B88CA" }} />
                  {isEditing ? (
                    <TextField
                      size="small"
                      type="password"
                      value={profileData.password}
                      onChange={(e) =>
                        setProfileData({ ...profileData, password: e.target.value })
                      }
                      placeholder="Enter new password"
                    />
                  ) : (
                    <Typography sx={{ fontStyle: "italic", color: "gray" }}>
                      ********
                    </Typography>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Paper>
  );
};

export default ProfilePage;
