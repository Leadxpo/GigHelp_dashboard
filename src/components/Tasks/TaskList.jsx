import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Paper,
  Menu,
  MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const API_URL = "http://localhost:3001/dashboard";
const token = localStorage.getItem("accessToken");

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const navigate = useNavigate();

  // Fetch users
  const getUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
console.log("''''''''''''>",users)
  // Fetch tasks
  const getTaskData = async () => {
    try {
      const response = await axios.get(`${API_URL}/task/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Initial fetch
  useEffect(() => {
    getUserData();
    getTaskData();
  }, [token]);



useEffect(() => {
  if (users.length && tasks.length) {
    const merged = tasks.map(task => {
      const user = users.find(u => u.userId === parseInt(task.taskUserId));
      console.log("cccccccc>", user);

      return {
        ...task,
        userName: user?.userName || 'Unknown',
        phoneNumber: user?.phoneNumber || 'Unknown',
        email: user?.email || 'Unknown',
        profilePic: user?.profilePic || '',
        categoryName: task.Categories || 'N/A',
        subCategoryName: task.SubCategory || 'N/A',
        taskDate: task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A',
        kyc: user?.status || 'Pending',
      };
    });

    setCombinedData(merged);
    console.log("Merged Combined Data >", merged);
  }
}, [users, tasks]);



  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setMenuRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRow(null);
  };

  const totalTasks = combinedData.length;
const kycApprovedCount = combinedData.filter(row => row.kyc === "Approved").length;
const kycPendingCount = combinedData.filter(row => row.kyc === "Pending").length;

const summaryCards = [
  { label: 'Total Task', count: totalTasks, color: '#B983FF' },
  { label: 'KYC Approved', count: kycApprovedCount, color: '#00D100' },
  { label: "Pending's", count: kycPendingCount, color: '#F9D923' }
];


  const kycColors = {
    Approved: 'success',
    Pending: 'warning',
    Dispute: 'info'
  };



  return (
    <Box sx={{ p: 0, mt: 3 }}>
      {/* Summary Cards */}
      <Grid container spacing={2}>
        {summaryCards.map((card, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Card sx={{ backgroundColor: card.color, color: '#fff', textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">{card.label}</Typography>
                <Typography variant="h4" fontWeight="bold" mt={1}>{card.count}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search Bar */}
      <Box mt={3} mb={2}>
        <TextField
          fullWidth
          placeholder="Search"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#1976d2', height: 60 }}>
            <TableRow>
              <TableCell sx={{ color: '#fff' }}>No.</TableCell>
              <TableCell sx={{ color: '#fff' }}>User Name </TableCell>
              <TableCell sx={{ color: '#fff' }}>Category</TableCell>
              <TableCell sx={{ color: '#fff' }}>Sub Category</TableCell>
              <TableCell sx={{ color: '#fff' }}>Date</TableCell>
              <TableCell sx={{ color: '#fff' }}>KYC Status</TableCell>
              <TableCell sx={{ color: '#fff' }}>Action</TableCell>
            </TableRow>
          </TableHead>
         <TableBody>
  {combinedData.map((row, idx) => (
    <TableRow key={row.taskId || idx}>
      <TableCell>{`0${idx + 1}`}</TableCell>

      {/* Profile Picture + Username */}
      <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  <Avatar
    alt="Profile"
    src={row.profilePic ? `http://localhost:3001/storege/userdp/${row.profilePic}` : '/default-avatar.png'}
  />
  <Typography>{row.userName}</Typography>
</Box>

      </TableCell>

      {/* Category Name */}
      <TableCell>{row.categoryName}</TableCell>

      {/* SubCategory Name */}
      <TableCell>{row.subCategoryName}</TableCell>

      {/* Date */}
      <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>

      {/* Status */}
      <TableCell>
        <Chip label={row.status} color={kycColors[row.status] || "default"} />
      </TableCell>

      {/* Actions */}
      <TableCell>
        <IconButton onClick={(e) => handleMenuOpen(e, row)}>
          <MoreVertIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>

      {/* Row Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
       <MenuItem
  onClick={() => {
    navigate("/taskMoreDetails", {
      state: {
        taskDetails: menuRow, // this includes both task and user info
      },
    });
    handleMenuClose();
  }}
>
  More Details
</MenuItem>

        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default Dashboard;
