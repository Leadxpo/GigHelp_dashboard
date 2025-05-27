import React, { useState, useEffect } from 'react';
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
  Modal,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useLocation } from 'react-router-dom';
import axios from "axios";


const API_URL = "http://localhost:3001/dashboard/task/task-summary-by-user";
const token = localStorage.getItem("accessToken");




const TaskDetails = () => {

  const [taskCount, setTaskCount] = useState(false);
const [taskBids, setTaskBids] = useState([]);
;


  const location = useLocation();
  const { taskDetails } = location.state || {};
  const [loading, setLoading] = useState(false);

  // const bids = taskDetails?.bids || [];
console.log("dispute Details>",taskDetails)

useEffect(() => {
  const fetchStatus = async () => {
    const userId = taskDetails?.userId;

    if (!userId) {
      console.error("taskDetails.userId is missing");
      return;
    }

    try {
      const response = await axios.get(API_URL, {
        params: { userId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTaskCount(response.data.data);
    } catch (error) {
      console.error("Error fetching task stats:", error);
    }
  };

  fetchStatus();
}, [taskDetails]);



useEffect(() => {
  const fetchBids = async () => {
    const taskId = taskDetails?.taskId;

    if (!taskId) {
      console.error("taskDetails.taskId is missing");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/dashboard/Bids/get-all-bids-by-task`, {
        params: { taskId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTaskBids(response.data.data);
    } catch (error) {
      console.error("Error fetching task stats:", error);
    }
  };

  fetchBids();
}, [taskDetails]);


  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" gap={2}>
          <Button variant="contained" color="primary" >Asigned</Button>
       <Box></Box>
        </Box>
      </Box>

  

      {/* User Info */}
      <Typography variant="h6" fontWeight="bold">User ID : {taskDetails?.userId || 'N/A'}</Typography>
      <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mt: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} display="flex" justifyContent="center">
            <Avatar alt="User Profile" src={taskDetails?.profilePic ? `http://localhost:3001/storege/userdp/${taskDetails.profilePic}` : ''} sx={{ width: 200, height: 200 }} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {[
                ['Name', taskDetails?.userName],
                ['Phone number', taskDetails?.phoneNumber],
                ['Email', taskDetails?.email],
                ['Number of Task', taskCount?.totalTasks],
                ['Number of Biddings', taskCount?.totalBids],
                ['Number of Works', taskCount?.completedTasks],
                ['Number of Disputes', taskCount?.disputeTasks],
              ].map(([label, value], index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ backgroundColor: '#f0f0f0', borderRadius: 2, p: 2 }}>
                    <Typography variant="body1"><strong>{label}:</strong> {value || 'N/A'}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Box mt={4} mb={3}>
        <Typography variant="h6" fontWeight="bold">Transaction Amount by Owner: ₹{taskDetails?.transaction_amount || 'N/A'}</Typography>
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
              ) : taskBids.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center">No taskBids found</TableCell></TableRow>
              ) : (
                taskBids.map((row, idx) => (
                  <TableRow key={row.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{row.BidId}</TableCell>
                    <TableCell>₹{row.bidOfAmount}</TableCell>
                    <TableCell>{row.targetedPostIn}</TableCell>
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
