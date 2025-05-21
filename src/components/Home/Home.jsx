import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
// import HomeLogo from "../Images/logo.jpg";
import LanguageIcon from "@mui/icons-material/Language";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Typography, ToggleButtonGroup, ToggleButton, Box, Grid, Paper,Link,IconButton } from "@mui/material";
import axios from "axios";


const API_URL = "http://localhost:3001/dashboard/task/get-all-count";
const token = localStorage.getItem("accessToken");




const DashboardCards = () => {
  const [timeframe, setTimeframe] = React.useState("1Y");
 const [taskStats, setTaskStats] = useState(null);

useEffect(() => {
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

    fetchStatus();
  }, []);



  const stats = taskStats
    ? [
        { title: "Task Users", value: taskStats.taskUsersCount, color: "#00BFA5" },
        { title: "KYC Approved", value: taskStats.statusApproved, color: "#5C6BC0" },
        { title: "Pending's", value: taskStats.statusPending, color: "#D4AC0D" },
      ]
    : [];

  const srinu = taskStats
    ? [
        { title: "Tasks", value: taskStats.totalTasks, color: "#9C27B0" },
        { title: "Disputes", value: taskStats.totalDisputes, color: "#03A9F4" },
        { title: "Completed Tasks", value: taskStats.totalCompleted, color: "#4CAF50" },
        { title: "Disputes Last 24 hrs", value: taskStats.last24hDisputes, color: "#A67C52" },
      ]
    : [];




  // Sample Bitcoin data
  const data = [
    { month: "Jan", price: 4200 },
    { month: "Feb", price: 5500 },
    { month: "Mar", price: 5100 },
    { month: "Apr", price: 6200 },
    { month: "May", price: 7000 },
    { month: "Jun", price: 8500 },
    { month: "Jul", price: 9200 },
    { month: "Aug", price: 7500 },
  ];

  // Custom Dot Component
  const CustomDot = (props) => {
    const { cx, cy, index } = props;
    return index === 4 ? (
      <circle cx={cx} cy={cy} r={6} stroke="blue" strokeWidth={3} fill="white" />
    ) : null;
  };

  return (
    <Box sx={{ p: 0 ,mt:5}}>
      {/* Stats Cards */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <Paper
                elevation={5}
                sx={{
                  backgroundColor: stat.color,
                  color: "white",
                  p: 3,
                  textAlign: "center",
                  borderRadius: 3,
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
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


{/* Stats Cards */}
<Grid container spacing={4}>
  {srinu.map((stat, index) => (
    <Grid item xs={12} sm={6} md={3} mt={5} key={index}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        <Paper
          elevation={5}
          sx={{
            backgroundColor: stat.color,
            color: "white",
            p: 3,
            textAlign: "center",
            borderRadius: 3,
            boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
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





<Box sx={{ width: "100%", textAlign: "center", p: 2, mt:10 }}>
  {/* Horizontal Flex Container */}
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
    {/* Bitcoin Text (Left) */}
    <Typography variant="h5" fontWeight="bold">
      Bitcoin
    </Typography>

    {/* Toggle Button Group (Right) */}
    <ToggleButtonGroup
      value={timeframe}
      exclusive
      onChange={(e, newTimeframe) => setTimeframe(newTimeframe)}
    >
      {["1H", "1D", "7D", "1M", "3M", "6M", "1Y"].map((label) => (
        <ToggleButton key={label} value={label} sx={{ textTransform: "none" }}>
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  </Box>

  {/* Horizontal Line */}
  <Box sx={{ borderBottom: "2px solid #ccc", mb: 2 }} />

  {/* Line Chart */}
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <XAxis dataKey="month" stroke="#aaa" />
      <YAxis stroke="#aaa" domain={[4000, 10000]} tickFormatter={(val) => `$${val}`} />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="price"
        stroke="blue"
        strokeWidth={2}
        dot={<CustomDot />}
      />
    </LineChart>
  </ResponsiveContainer>
</Box>



    </Box>
  );
};

export default DashboardCards;
