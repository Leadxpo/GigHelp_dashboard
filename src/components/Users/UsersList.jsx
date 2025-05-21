import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Grid,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3001/dashboard/users";
const token = localStorage.getItem("accessToken");

if(token){
  console.log("vvvvvvvvvvvv>",token)
}

const statusColors = {
  Approved: "success",
  Pending: "warning",
  Dispute: "info",
};

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedId, setSelectedId] = React.useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

 // Fetch users
const getUserData = async () => {
  try {
    const response = await axios.get(`${API_URL}/all-users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
console.log("mmmmmmmm>",response.data.data)
    setUsers(response.data.data); // Set data in state
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

useEffect(() => {
  getUserData();
}, [token]);

  return (
    <Box mt={3}>
      {/* Top Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: "#a084e8", color: "white", textAlign: "center" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Task Users</Typography>
              <Typography variant="h3" fontWeight="bold">{users.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: "#32CD32", color: "white", textAlign: "center" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>KYC Approved</Typography>
              <Typography variant="h3" fontWeight="bold">
                {users.filter((user) => user.status === "Approved").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: "#FFD700", color: "white", textAlign: "center" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Pending's</Typography>
              <Typography variant="h3" fontWeight="bold">
                {users.filter((user) => user.status === "Pending").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

   <TextField
  fullWidth
  placeholder="Search by User ID"
  variant="outlined"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  sx={{ mb: 3 }}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>
    ),
  }}
/>


      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2", height: 60 }}>
            <TableRow>
              {["No.", "Client ID", "Task", "Work", "Disputes", "KYC Status", "Action"].map((heading, i) => (
                <TableCell
                  key={i}
                  sx={{ color: "white", fontWeight: "bold", fontSize: "16px" }}
                >
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
      <TableBody>
  {users
    .filter((user) =>
      user.userId?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((row, index) => (
      <TableRow key={row.userId || index}>
        <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>
        <TableCell>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar src={`http://localhost:3001/storege/userdp/${row.profilePic}`} />
            {row.userId || row.id}
          </Box>
        </TableCell>
        <TableCell>{row.task || "-"}</TableCell>
        <TableCell>{row.work || "-"}</TableCell>
        <TableCell>{row.disputes || "-"}</TableCell>
        <TableCell>
          <Chip label={row.status} color={statusColors[row.status] || "default"} />
        </TableCell>
        <TableCell>
          <IconButton onClick={(e) => handleMenuClick(e, row.userId)}>
            <MoreVertIcon />
          </IconButton>
          {selectedId === row.userId && (
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => { navigate("/moreDetails",{state:{userDetails:row}}); handleMenuClose(); }}>
                More Details
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
            </Menu>
          )}
        </TableCell>
      </TableRow>
    ))}
</TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
};

export default Dashboard;
