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
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

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

  useEffect(() => {
    getUserData();
    getTaskData();
  }, []);

  useEffect(() => {
    if (users.length && tasks.length) {
      const merged = tasks.map(task => {
        const user = users.find(u => u.userId === parseInt(task.taskUserId));
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

  // Define custom card colors
  const statusColors = {
    Dispute: '#B983FF',
    Completed: '#03A9F4',
    Pending: '#F9D923',
    Rejected: '#FF5252',
    Verified: '#4CAF50',
  };

  // Count based on task status
  const taskStatusCounts = combinedData.reduce((acc, task) => {
    const status = task.status;
    if (status) acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Count based on user status for verified
  const verifiedCount = users.filter(u => u.status?.toLowerCase() === 'verified').length;

  // Build summary cards
  const summaryCards = [
    {
      label: 'Disputes',
      count: taskStatusCounts['Dispute'] || 0,
      color: statusColors['Dispute']
    },
    {
      label: 'Completed Tasks',
      count: taskStatusCounts['Completed'] || 0,
      color: statusColors['Completed']
    },
    {
      label: 'Pending Tasks',
      count: taskStatusCounts['Pending'] || 0,
      color: statusColors['Pending']
    },
    {
      label: 'Rejected Tasks',
      count: taskStatusCounts['Rejected'] || 0,
      color: statusColors['Rejected']
    },
    {
      label: 'Verified Users',
      count: verifiedCount,
      color: statusColors['Verified']
    }
  ];

  const kycColors = {
    Approved: 'success',
    Verified: 'success',
    Pending: 'warning',
    Dispute: 'info',
    Rejected: 'error'
  };

  return (
    <Box sx={{ p: 0, mt: 2 }}>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
        {summaryCards.map((card, idx) => (
          <Grid item xs={12} sm={3} md={3} key={idx}>
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
              {['No.', 'Client', 'Category', 'Sub Category', 'Date', 'KYC Status', 'Action'].map((head, index) => (
                <TableCell
                  key={index}
                  sx={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {combinedData
              .filter(row => row.status?.toLowerCase() === 'dispute')
              .map((row, idx) => (
                <TableRow key={row.id}>
                  <TableCell>{`0${idx + 1}`}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        alt="Profile"
                        src={row.profilePic ? `http://localhost:3001/storege/userdp/${row.profilePic}` : '/default-avatar.png'}
                      />
                      <Typography>{row.userName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{row.categoryName || 'N/A'}</TableCell>
                  <TableCell>{row.subCategoryName || 'N/A'}</TableCell>
                  <TableCell>{row.taskDate}</TableCell>
                  <TableCell>
                    <Chip label={row.kyc} color={kycColors[row.kyc] || 'default'} />
                  </TableCell>
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

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            navigate("/disputeMoreDetails", { state: { taskDetails: menuRow } });
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
