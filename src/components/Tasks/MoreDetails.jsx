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
  const [identityProofs, setIdentityProofs] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [taskCount, setTaskCount] = useState(false);
const [taskBids, setTaskBids] = useState([]);
;


  const [selectedFile, setSelectedFile] = useState(null);
  const location = useLocation();
  const { taskDetails } = location.state || {};
  const [loading, setLoading] = useState(false);

  // const bids = taskDetails?.bids || [];

  useEffect(() => {
    if (Array.isArray(taskDetails?.document)) {
      setIdentityProofs(taskDetails.document);
      setStatuses(taskDetails.document.map(() => null));
    } else if (typeof taskDetails?.document === 'string') {
      try {
        const parsedDocs = JSON.parse(taskDetails.document || '[]');
        setIdentityProofs(parsedDocs);
        setStatuses(parsedDocs.map(() => null));
      } catch (error) {
        console.error('Invalid JSON in taskDetails.document:', error);
      }
    }
  }, [taskDetails]);

  const handleStatusChange = (index, status) => {
    const newStatuses = [...statuses];
    newStatuses[index] = status;
    setStatuses(newStatuses);
  };

  const handlePreview = (file) => {
    setSelectedFile(file);
    setModalOpen(true);
  };

  const handleDownload = () => {
    const url = `http://localhost:3001/storege/userdp/${selectedFile}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', selectedFile);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  const isImage = (filename) => {
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(getFileExtension(filename));
  };

  const isPdf = (filename) => {
    return getFileExtension(filename) === 'pdf';
  };

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
        <Typography variant="h6" fontWeight="bold">Task Data</Typography>
        <Box display="flex" gap={2}>
          <Button variant="contained" color="primary" startIcon={<EditIcon />}>Edit User</Button>
          <Button variant="contained" sx={{ backgroundColor: '#FF7A00', color: '#fff' }}>
            {taskDetails?.status || 'Pending'}
          </Button>
        </Box>
      </Box>

      {/* Task Fields */}
      <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          {[
            ['Task Title', taskDetails?.Categories],
            ['Task Description', taskDetails?.description],
            ['Task Posted On', taskDetails?.taskDate],
            ['Task Category', taskDetails?.Categories],
            ['Task Sub Category', taskDetails?.SubCategory]
          ].map(([label, value], idx) => (
            <Grid item xs={12} key={idx}>
              <Box sx={{ backgroundColor: '#eaeaea', p: 2, borderRadius: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" fontWeight={500}>{label}: {value || 'N/A'}</Typography>
                {idx >= 3 && <IconButton><EditIcon /></IconButton>}
              </Box>
            </Grid>
          ))}
        </Grid>
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

      {/* Task Documents */}
      <Typography variant="h6" gutterBottom fontWeight="bold">Task Documents</Typography>
      {identityProofs.map((item, index) => (
        <Paper key={index} elevation={1} sx={{ borderRadius: 3, padding: 3, border: '1px solid #ccc', mt: 3 }}>
          <Box display="flex" gap={2}>
            <Card sx={{ width: 250, p: 2, borderRadius: 3, textAlign: 'center', cursor: 'pointer' }} onClick={() => handlePreview(item)}>
              <Chip icon={<CheckCircleIcon sx={{ color: 'white' }} />} sx={{ bgcolor: 'green', height: 28, width: 28, position: 'absolute', top: 8, left: 8 }} />
              {isImage(item) ? (
                <img src={`http://localhost:3001/storege/userdp/${item}`} alt="KYC Document" style={{ width: '100%', borderRadius: '8px' }} />
              ) : isPdf(item) ? (
                <PictureAsPdfIcon sx={{ fontSize: 80, color: '#e53935', mt: 4 }} />
              ) : (
                <InsertDriveFileIcon sx={{ fontSize: 80, color: '#757575', mt: 4 }} />
              )}
              <Typography mt={2}>{item}</Typography>
            </Card>

            <Card sx={{ flex: 1, borderRadius: 3, boxShadow: 3, p: 2 }}>
              <Box display="flex" gap={1} mb={2}>
                <Button variant={statuses[index] === 'accepted' ? 'contained' : 'outlined'} color="success" onClick={() => handleStatusChange(index, 'accepted')}>Accept</Button>
                <Button variant={statuses[index] === 'rejected' ? 'contained' : 'outlined'} color="error" onClick={() => handleStatusChange(index, 'rejected')}>Reject</Button>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Description</Typography>
                <Box mt={1} sx={{ height: 60, bgcolor: '#f5f5f5', borderRadius: 1 }} />
              </Box>
            </Card>
          </Box>
        </Paper>
      ))}

      {/* Modal for preview */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
        }}>
          {selectedFile && isImage(selectedFile) && (
            <img src={`http://localhost:3001/storege/userdp/${selectedFile}`} alt="Preview" style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
          )}
          {selectedFile && isPdf(selectedFile) && (
            <iframe src={`http://localhost:3001/storege/userdp/${selectedFile}`} width="100%" height="500px" title="PDF Preview"></iframe>
          )}
          <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={handleDownload} variant="contained" color="primary">Download</Button>
            <Button onClick={() => setModalOpen(false)} variant="outlined">Close</Button>
          </Box>
        </Box>
      </Modal>

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
