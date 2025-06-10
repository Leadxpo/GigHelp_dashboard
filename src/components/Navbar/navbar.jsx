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
  Box,
  Badge,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import Logo from "../../Images/logo.jpg";
import axios from "axios";

const Navbar = ({ toggleSidebar, setIsAuthenticated }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    setUserData(user);

    if (user?.userId) {
      const fetchUnreadCount = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:3001/notification/user/${user.userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const allNotifications = response.data?.data || [];
          const unread = allNotifications.filter((n) => !n.isRead).length;

          setUnreadCount(unread);
        } catch (error) {
          console.error("Failed to fetch notification count:", error);
        }
      };

      fetchUnreadCount();
    }
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

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
      }}
    >
      <Toolbar>
        {/* Left Side: Menu Icon and Logo */}
        <IconButton edge="start" onClick={toggleSidebar} sx={{ mr: 2 }}>
          <MenuIcon sx={{ fontSize: "28px", color: "black" }} />
        </IconButton>
        <img
          src={Logo}
          alt="Logo"
          style={{ width: "100px", height: "50px", marginRight: "20px" }}
        />

        {/* Right Side: Notification & Profile */}
        <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={() => handleNavigation("/notification")}
            sx={{ color: "black" }}
          >
            <Badge badgeContent={unreadCount || 0} color="error">
              <NotificationsIcon sx={{ fontSize: "2rem" }} />
            </Badge>
          </IconButton>

          <Chip
            label={userData?.userName || "Guest"}
            avatar={
              <Avatar
                src={
                  userData?.profilePic
                    ? `http://localhost:3001/storege/userdp/${userData.profilePic}`
                    : ""
                }
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
            {userData && (
              <MenuItem onClick={handleProfileNavigate}>Profile</MenuItem>
            )}
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
