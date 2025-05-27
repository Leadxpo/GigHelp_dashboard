import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Typography,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const API_URL = "http://localhost:3001/dashboard/task/get-all-count";
const TRANSACTION_API = "http://localhost:3001/dashboard/transections/get-all";
const token = localStorage.getItem("accessToken");

const monthLabels = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const DashboardCards = () => {
  const [taskStats, setTaskStats] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState([]);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTaskStats(response.data.data.stats);
    } catch (error) {
      console.error("Error fetching task stats:", error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(TRANSACTION_API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const transactions = res.data.data || [];

      // Grouping amounts by month
      const monthlyTotals = {};

      transactions.forEach((tx) => {
        const createdDate = new Date(tx.createdAt);
        const monthIndex = createdDate.getMonth(); // 0 = Jan, 1 = Feb, ...
        const month = monthLabels[monthIndex];

        const amount = Number(tx.amount);
        if (!isNaN(amount)) {
          if (!monthlyTotals[month]) {
            monthlyTotals[month] = 0;
          }
          monthlyTotals[month] += amount;
        }
      });

      // Prepare chart data
      const chartData = monthLabels.map((month) => ({
        month,
        price: monthlyTotals[month] || 0,
      }));

      setData(chartData);
    } catch (error) {
      console.error("Transaction fetch error:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const stats = taskStats
    ? [
        { title: "Task Users", value: taskStats.taskUsersCount, color: "#00BFA5" },
        { title: "KYC Approved", value: taskStats.statusApproved, color: "#5C6BC0" },
        { title: "Pending's", value: taskStats.statusPending, color: "#D4AC0D" },
      ]
    : [];

  const additionalStats = taskStats
    ? [
        { title: "Tasks", value: taskStats.totalTasks, color: "#9C27B0" },
        { title: "Disputes", value: taskStats.totalDisputes, color: "#03A9F4" },
        { title: "Completed Tasks", value: taskStats.totalCompleted, color: "#4CAF50" },
        { title: "Disputes Last 24 hrs", value: taskStats.last24hDisputes, color: "#A67C52" },
      ]
    : [];

  return (
    <Box sx={{ p: 0, mt: 5 }}>
      {/* Stats Cards */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 200, damping: 10 }}>
              <Paper
                elevation={5}
                sx={{
                  backgroundColor: stat.color,
                  color: "white",
                  p: 3,
                  textAlign: "center",
                  borderRadius: 3,
                  minHeight: 120,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {stat.title}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                  {stat.value}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Additional Stats */}
      <Grid container spacing={4} mt={4}>
        {additionalStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 200, damping: 10 }}>
              <Paper
                elevation={4}
                sx={{
                  backgroundColor: stat.color,
                  color: "white",
                  p: 2,
                  textAlign: "center",
                  borderRadius: 3,
                  minHeight: 100,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {stat.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {stat.value}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Line Chart */}
      <Box sx={{ mt: 6, height: 400 }}>
        <Typography variant="h5" mb={2}>
          Monthly Transaction Amount
        </Typography>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Box>


      
    </Box>
  );
};

export default DashboardCards;
