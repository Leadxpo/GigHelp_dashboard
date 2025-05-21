import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  IconButton,
  Chip,
  Avatar,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const TaskDetails = () => {
  // Dummy Data (Replace with props or fetched data as needed)
  const [statuses, setStatuses] = useState(['pending', 'pending']);
  const [loading, setLoading] = useState(false);
  const bids = [
    { id: 1, amount: 500, date: '2024-05-01', status: 'Pending' },
    { id: 2, amount: 800, date: '2024-05-02', status: 'Accepted' },
  ];

  const handleStatusChange = (index, newStatus) => {
    const updated = [...statuses];
    updated[index] = newStatus;
    setStatuses(updated);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 2 }}>
     
   
   

      {/* User Info */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">User ID : 123456</Typography>
         <Button variant="contained" color="primary"  sx={{ textTransform: 'none', boxShadow: 2 }}>
            Asigned
          </Button>
      </Box>

      <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} display="flex" justifyContent="center" alignItems="center">
            <Avatar alt="User Profile" src="http://localhost:3001/storege/userdp/user.jpg" sx={{ width: 200, height: 200 }} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {[
                ['Name', 'John Doe'],
                ['Phone number', '1234567890'],
                ['Email', 'john@example.com'],
                ['Number of Task', '675'],
                ['Number of Beddings', '657'],
                ['Number of Works', '786'],
                ['Number of Disputes', '65'],
              ].map(([label, value], index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ backgroundColor: '#f0f0f0', borderRadius: 2, p: 2 }}>
                    <Typography variant="body1"><strong>{label}:</strong> {value}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Box mt={4} mb={3}>
        <Typography variant="h6" fontWeight="bold">Transaction Amount by owner : ₹5000</Typography>
      </Box>

    

      {/* Bids Table */}
      <Box mt={4}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1976d2', height: 60 }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>No.</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Bid ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Bid Amount</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Date Of Bids</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} align="center">Loading...</TableCell></TableRow>
              ) : bids.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center">No bids found</TableCell></TableRow>
              ) : (
                bids.map((row, idx) => (
                  <TableRow key={row.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>₹{row.amount}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};

export default TaskDetails;
