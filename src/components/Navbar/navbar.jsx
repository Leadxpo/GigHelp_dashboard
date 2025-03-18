import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Box
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import Logo from "../../Images/logo.jpg";

const Navbar = ({ toggleSidebar, setIsAuthenticated }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    setUserData(user);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("accessToken");
    setUserData(null);
    handleMenuClose();
    if (setIsAuthenticated) {
      setIsAuthenticated(false);
    }
    navigate("/login");
  };

  const handleProfileNavigate = () => {
    navigate("/profile");
    handleMenuClose();
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#ffff",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
      }}
    >
      <Toolbar>
        {/* Left Side: Menu Icon and Logo */}
        <IconButton edge="start" onClick={toggleSidebar} sx={{ mr: 2 }}>
          <MenuIcon sx={{ fontSize: "28px" }} />
        </IconButton>
        <img src={Logo} alt="Logo" style={{ width: "100px", height: "50px" }} />

        {/* Right Side: Profile */}
        <Box sx={{ marginLeft: "auto" }}>
          {userData ? (
            <>
              <Chip
                label={userData?.employee_name}
                avatar={
                  <Avatar
                    src={userData?.image ? `http://localhost:3001/storage/userdp/${userData.image}` : ""}
                    alt="Profile"
                    sx={{ width: 40, height: 40 }}
                  />
                }
                onClick={handleMenuOpen}
                variant="outlined"
                sx={{ cursor: "pointer", backgroundColor: "white" }}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Divider />
                <MenuItem onClick={handleProfileNavigate}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Avatar sx={{ bgcolor: "gray" }} />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
