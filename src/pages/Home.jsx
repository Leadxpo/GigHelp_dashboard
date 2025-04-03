import React from "react";
import { motion } from "framer-motion";
import HomeLogo from "../Images/logo.jpg";
import LanguageIcon from "@mui/icons-material/Language";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Typography, ToggleButtonGroup, ToggleButton, Box, Grid, Paper,Link,IconButton } from "@mui/material";

const stats = [
  { title: "Task Users", value: 5765, color: "#00BFA5" },
  { title: "KYC Approved", value: 754, color: "#5C6BC0" },
  { title: "Pending's", value: 32, color: "#D4AC0D" },
 
];

const srinu = [
  
  { title: "Tasks", value: 6754, color: "#9C27B0" },
  { title: "Disputes", value: 655, color: "#03A9F4" },
  { title: "Completed Tasks", value: 4455, color: "#4CAF50" },
  { title: "Disputes Lost 24 hrs", value: 956, color: "#A67C52" },
];

const DashboardCards = () => {
  const [timeframe, setTimeframe] = React.useState("1Y");

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
    <Box sx={{ p: 3 }}>
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


      <Box sx={{ backgroundColor: "#f8f9fa", p: 4, mt: 5 }}>
  <Grid container spacing={4}>
    {/* Left Section */}
    <Grid item xs={12} md={2}>
    <img 
      src={HomeLogo} 
      alt="Logo" 
      style={{ width: "100px",  height: "auto", borderRadius: "10px" }} 
    />
      <Box display="flex" alignItems="center" mt={2}>
        <IconButton color="primary">
          <LanguageIcon />
        </IconButton>
        <Typography fontWeight="bold">India / English</Typography>
      </Box>
      <Box display="flex" alignItems="center" fontWeight="bold" mt={2}>
        <IconButton color="primary">
          <HelpOutlineIcon />
        </IconButton>
        <Typography fontWeight="bold">Help & Support</Typography>
      </Box>
      <Box display="flex" alignItems="center" fontWeight="bold" mt={2}>
        <IconButton color="primary">
          <AccessibilityNewIcon />
        </IconButton>
        <Typography fontWeight="bold">Accessibility</Typography>
      </Box>
    </Grid>

    {/* Categories Section */}
    <Grid item xs={12} md={2}>
      <Typography variant="h6" color="primary" fontWeight="bold">Categories</Typography>
      {['Projects', 'Contests', 'Freelancers', 'Enterprise', 'AI Development', 'Membership','Preperred','Frelancer','Program','Project'].map((item) => (
        <Typography key={item} mt={2} fontWeight="bold">
          <Link href="#" color="inherit" underline="hover">{item}</Link>
        </Typography>
      ))}
    </Grid>

    {/* About Section */}
    <Grid item xs={12} md={2}>
      <Typography variant="h6" color="primary" fontWeight="bold">About</Typography>
      {['About us', 'How it Works', 'Security', 'Investor', 'Sitemap', 'Stories'].map((item) => (
        <Typography key={item} mt={2} fontWeight="bold">
          <Link href="#" color="inherit" underline="hover">{item}</Link>
        </Typography>
      ))}
    </Grid>

    {/* Terms Section */}
    <Grid item xs={12} md={2}>
      <Typography variant="h6" color="primary" fontWeight="bold">Terms</Typography>
      {['Privacy Policy', 'Terms and Conditions', 'Copyright Policy', 'Code of Conduct', 'Fees and Charges'].map((item) => (
        <Typography key={item} mt={2} fontWeight="bold">
          <Link href="#" color="inherit" underline="hover">{item}</Link>
        </Typography>
      ))}
    </Grid>

    {/* Partners Section */}
    <Grid item xs={12} md={2}>
      <Typography variant="h6" color="primary" fontWeight="bold">Partners</Typography>
      {['Escrow.com', 'Load Shift', 'Warrior Forum'].map((item) => (
        <Typography key={item} mt={2}fontWeight="bold">
          <Link href="#" color="inherit" underline="hover">{item}</Link>
        </Typography>
      ))}
    </Grid>

    {/* Apps Section beside Partners Section */}
    <Grid item xs={12} md={2}>
      <Typography variant="h6" color="primary" fontWeight="bold" align="center">Apps</Typography>
      <Box mt={2}>
        <img src="https://static.vecteezy.com/system/resources/thumbnails/016/290/534/small_2x/google-play-apple-store-logo-icon-button-free-vector.jpg" alt="App Store" width="250" />
      </Box>
      {/* <Box mt={2}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/256px-Google_Play_Store_badge_EN.svg.png" alt="Google Play" width="150" />
      </Box> */}
    </Grid>
  </Grid>
</Box>


    <Box sx={{ backgroundColor: "#1783c7", py: 4, px: 2 ,mt:1}}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={4} textAlign="center">
          <Typography variant="h4" fontWeight="bold" color="white">
            78,598,389
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="white">
            Registered Users
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} textAlign="center">
          <Typography variant="h4" fontWeight="bold" color="white">
            24,412,271
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="white">
            Total Jobs Posted
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} textAlign="center">
          <Typography variant="h6" fontWeight="bold" color="white">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been.
          </Typography>
        </Grid>
      </Grid>
    </Box>







    </Box>
  );
};

export default DashboardCards;
