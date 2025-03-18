import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatBot from "../components/chatBoard/chatBoard";
import PageHeader from "../layout/PageHeader";
import { Chat } from "@mui/icons-material";
import { Box,  Grid, Paper, Typography, IconButton } from "@mui/material";

const DashboardPage = () => {
  const [counts, setCounts] = useState({
    brands: " ",
    orders: " ",
    customers: " ",
    employees: " ",
    areas: " ",
    products: " ",
  });

  const [chatOpen, setChatOpen] = useState(false);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const endpoints = {
          brands: "http://localhost:3001/web/brand/count-brand",
          customers: "http://localhost:3001/web/customer/count-customer",
          products: "http://localhost:3001/web/product/count-all-product",
          orders: "http://localhost:3001/web/order/count-all-orders",
          areas: "http://localhost:3001/web/area/count-area",
          employees: "http://localhost:3001/web/employee/count-employee",
        };

        const requests = Object.entries(endpoints).map(([key, url]) =>
          axios.get(url, { headers: { Authorization: `Bearer ${token}` } }).then(response => ({
            key,
            count: response.data.data,
          }))
        );

        const results = await Promise.all(requests);
        const updatedCounts = results.reduce((acc, { key, count }) => {
          acc[key] = count;
          return acc;
        }, {});

        setCounts((prevCounts) => ({
          ...prevCounts,
          ...updatedCounts,
        }));
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, [token]);

  return (
    <>
    <PageHeader title="Hello Supper Admin" />

    <Box sx={{ flexGrow: 1, p: 3, bgcolor: "#fff", minHeight: "100vh", mt:2 , borderRadius: 2,}}>
     
      <Grid container spacing={3}>
        {Object.entries(counts).map(([key, value]) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Floating Chat Icon */}
      <IconButton
        onClick={() => setChatOpen(!chatOpen)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          bgcolor: "primary.main",
          color: "white",
          p: 2,
          borderRadius: "50%",
          boxShadow: 3,
          '&:hover': { bgcolor: "primary.dark" },
        }}
      >
        <Chat fontSize="large" />
      </IconButton>

      {/* ChatBot Popup */}
      {chatOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 80,
            right: 20,
            width: 400,
            height: 400,
            bgcolor: "white",
            boxShadow: 3,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <ChatBot onClose={() => setChatOpen(false)} />
        </Box>
      )}
    </Box>
    </>
  );
};

export default DashboardPage;
