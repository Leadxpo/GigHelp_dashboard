import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Card, Avatar } from "@mui/material";

// Notification card component
const NotificationCard = ({ title, message, image, viewMore }) => (
  <Card
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      p: 2,
      mb: 2,
      boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
      borderRadius: 2,
      border: "1px solid #ccc",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar src={image} sx={{ width: 56, height: 56, mr: 2 }} />
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {message}
          {viewMore && (
            <Typography
              component="span"
              color="primary"
              sx={{ ml: 1, cursor: "pointer", fontWeight: "bold" }}
            >
              View More...
            </Typography>
          )}
        </Typography>
      </Box>
    </Box>
  </Card>
);

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get("http://localhost:3001/notification/get-all", {
          headers,
        });

        setNotifications(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching all notifications:", error);
      }
    };

    fetchNotifications();
  }, [token]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
        All Notifications
      </Typography>

      {notifications.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          No notifications found.
        </Typography>
      ) : (
        notifications.map((notification) => (
          <NotificationCard
            key={notification.notificationId}
            title={notification.title}
            message={notification.message}
            image={notification.image || "https://via.placeholder.com/56"}
            viewMore={notification.message?.length > 100}
          />
        ))
      )}
    </Box>
  );
};

export default NotificationsPage;
