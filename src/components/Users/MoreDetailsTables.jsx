import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';

const API_URL = "http://localhost:3001/dashboard/";
const token = localStorage.getItem("accessToken");

const TaskTabs = ({userDetails}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [works, setWorks] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log(userDetails,"user details")

  // Get userId (you can also get it from route params if needed)
  const userId = userDetails.userId; // or get it from URL/location if you want

  useEffect(() => {
    if (!userId) return;

   const fetchData = async () => {
  setLoading(true);
  try {
    if (tabIndex === 0) {
      // Fetch tasks
      const res = await axios.get(`${API_URL}task/get-all-userId`, {
        params: { userId: userDetails.userId },
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Tasks >", res.data.data);
      setTasks(res.data.data || []);
    } else if (tabIndex === 1) {
      // Fetch works
      const res = await axios.get(`${API_URL}task/get-all-userId-work`, {
        params: { userId: userDetails.userId },
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Works >", res.data.data);
      setWorks(res.data.data || []);
    } else if (tabIndex === 2) {
      // Fetch bids
      const res = await axios.get(`http://localhost:3001/dashboard/Bids/get-all-bids-by-user`, {
        params: { userId: userDetails.userId },
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Bids >", res.data.data);
      setBids(res.data.data || []);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setLoading(false);
  }
};


    fetchData();
  }, [tabIndex, userId]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

const statusChip = (status) => {
  const statusMap = {
    Running: {
      label: 'running',
      color: 'warning'
    },
    Pending: {
      label: 'Pending',
      custom: true,
      sx: {
        border: '1px solid orange',
        color: 'orange'
      }
    },
    Dispute: {
      label: 'Dispute',
      color: 'primary'
    },
    Completed: {
      label: 'Completed',
      color: 'success'
    }
  };

  const chipInfo = statusMap[status] || { label: status, color: 'default' };

  if (chipInfo.custom) {
    return (
      <Chip label={chipInfo.label} variant="outlined" sx={chipInfo.sx} />
    );
  }

  return (
    <Chip label={chipInfo.label} color={chipInfo.color} variant="outlined" />
  );
};


  return (
    <Box sx={{ width: '100%', typography: 'body1', p: 2 }}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="tabs"
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Tab label="Task" sx={{ fontWeight: 'bold', flex: 1, mx: 1 }} />
        <Tab label="Works" sx={{ fontWeight: 'bold', flex: 1, mx: 1 }} />
        <Tab label="Bids" sx={{ fontWeight: 'bold', flex: 1, mx: 1 }} />
      </Tabs>

      {/* Task Table */}
      {tabIndex === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1976d2', height: 60 }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>No.</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Task ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Task</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Category</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Sub Category</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Transection Given To</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Transection Hand</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={9} align="center">Loading...</TableCell></TableRow>
              ) : tasks.length === 0 ? (
                <TableRow><TableCell colSpan={9} align="center">No tasks found</TableCell></TableRow>
              ) : (
                tasks.map((row, idx) => (
                  <TableRow key={row.id || idx}>
                    <TableCell><u>{idx + 1}</u></TableCell>
                    <TableCell>{row.taskId}</TableCell>
                    <TableCell>{row.task || row.taskName || '-'}</TableCell>
                    <TableCell>{row.Categories || '-'}</TableCell>
                    <TableCell>{row.SubCategory || '-'}</TableCell>
                    <TableCell>{row.givenTo || '-'}</TableCell>
                    <TableCell>{row.hand || '-'}</TableCell>
                    <TableCell>{statusChip(row.status)}</TableCell>
                    <TableCell>
                      <IconButton><MoreVertIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Works Table */}
      {tabIndex === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1976d2', height: 60 }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>No.</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Work ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Work</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Category</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Sub Category</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Transection Given To</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Transection Hand</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={9} align="center">Loading...</TableCell></TableRow>
              ) : works.length === 0 ? (
                <TableRow><TableCell colSpan={9} align="center">No works found</TableCell></TableRow>
              ) : (
                works.map((row, idx) => (
                  <TableRow key={row.id || idx}>
                    <TableCell><u>{idx + 1}</u></TableCell>
                    <TableCell>{row.taskId}</TableCell>
                    <TableCell>{row.task || row.workName || '-'}</TableCell>
                    <TableCell>{row.Categories || '-'}</TableCell>
                    <TableCell>{row.SubCategory || '-'}</TableCell>
                    <TableCell>{row.givenTo || '-'}</TableCell>
                    <TableCell>{row.hand || '-'}</TableCell>
                    <TableCell>{statusChip(row.status) }</TableCell>
                    <TableCell>
                      <IconButton><MoreVertIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Bids Table */}
      {tabIndex === 2 && (
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
                  <TableRow key={row.id || idx}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{row.BidId}</TableCell>
                    <TableCell>{row.bidOfAmount || '-'}</TableCell>
                   <TableCell>{row.createdAt ? new Date(row.createdAt).toISOString().split('T')[0] : '-'}</TableCell>
                    <TableCell>{statusChip(row.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TaskTabs;
