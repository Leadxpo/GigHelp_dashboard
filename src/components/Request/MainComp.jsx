import React, { useEffect, useState } from "react";
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
 Button,
  Paper,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3001/dashboard";
const token = localStorage.getItem("accessToken");

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [request, setRequest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [bidderName, setBidderName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');


if (selectedRow) {
  console.log("selectedRow", selectedRow);
}

  const navigate = useNavigate();

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setMenuRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRow(null);
  };

  const getTaskData = async () => {
    try {
      const response = await axios.get(`${API_URL}/task/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to fetch tasks");
    }
  };

  const getRequestData = async () => {
    try {
      const response = await axios.get(`${API_URL}/request/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequest(response.data.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError("Failed to fetch requests");
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getTaskData(), getRequestData()]);
      setLoading(false);
    };
    fetchData();
  }, [token]);




  const handleDeleteRequest = async (requestId) => {
  const confirm = window.confirm("Are you sure you want to delete this request?");
  if (!confirm) return;

  try {
    await axios.delete(`${API_URL}/request/delete/${requestId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getRequestData();
    handleMenuClose();
  } catch (err) {
    console.error("Error deleting request:", err);
    alert("Failed to delete the request.");
  }
};


  const summaryCards = [
    {
      label: "Total Requests",
      count: request.length,
      color: "#B983FF",
    },
    {
      label: "Tasks Available",
      count: tasks.length,
      color: "#00D100",
    },
    {
      label: "Completed Tasks",
      count: tasks.filter((t) => t.status === "Completed").length,
      color: "#03A9F4",
    },
    {
      label: "Pending Requests",
      count: request.filter((r) => r.status === "Pending").length,
      color: "#F9D923",
    },
  ];

  const kycColors = {
    Approved: "success",
    Pending: "warning",
    Dispute: "info",
  };



const handleSend = async () => {
  try {
    const response = await axios.post('http://localhost:3001/transections/create', {
      name: selectedRow?.requestName,
      amount: selectedRow?.bidDetails?.bidOfAmount,
      taskOwner: selectedRow?.taskOwnerId,
      userId: selectedRow?.taskOwnerId,
      taskUser: selectedRow?.bidDetails?.userId,
      categoryName: selectedRow?.bidDetails?.Categories,
      typeOfPayment: "Online", // or any valid string
      dateOfPayment: new Date().toISOString(), // optional, use current date
      status: "pending", // ✅ REQUIRED by your model
    });

    console.log("Transfer Payment Response:", response);

    if (response.status === 200 || response.status === 201) {
      setIsOpen(false);
      setSelectedRow(null);
    }
  } catch (err) {
    console.error('Transfer Payment Error:', err?.response?.data || err.message);
  }
};



const filteredRequests = request.filter((req) =>
  req.requestName?.toLowerCase().includes(searchQuery.toLowerCase())
);



// Define globally (not inside onClick)
const openModal = (row) => {
  setSelectedRow(row);  // store selected row
  setBidderName(row?.bidDetails?.userName || '');
  setAmount(row?.bidDetails?.bidOfAmount || '');
  setIsOpen(true);
};

const closeModal = () => {
  setIsOpen(false);
  setBidderName('');
  setAmount('');
  setSelectedRow(null); // Also reset selectedRow to avoid stale data
};

  return (
    <Box sx={{ p: 0, mt: 2 }}>
      {/* Summary Cards */}
      <Grid
        container
        spacing={2}
        sx={{ flexWrap: "nowrap", overflowX: "auto" }}
      >
        {summaryCards.map((card, idx) => (
          <Grid item xs={12} sm={3} md={3} key={idx}>
            <Card
              sx={{
                backgroundColor: card.color,
                color: "#fff",
                textAlign: "center",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {card.label}
                </Typography>
                <Typography variant="h4" fontWeight="bold" mt={1}>
                  {card.count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>



     <Box mt={3} mb={2}>
  <TextField
    fullWidth
    placeholder="Search by Request Name"
    variant="outlined"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton>
            <SearchIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
</Box>


      {/* Table */}
      {loading ? (
        <Typography>Loading data...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2", height: 60 }}>
              <TableRow>
                {[
                  "No.",
                  "Request Name",
                  "Request Date",
                  "Description",
                  "Amount",
                  "Task Id",
                  "BidId",
                  "Action",
                ].map((head, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      color: "#fff",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
           <TableBody>
  {filteredRequests.map((row, idx) => (
    <TableRow key={row.id}>
      <TableCell>{`0${idx + 1}`}</TableCell>
      <TableCell>{row.requestName}</TableCell>
      <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>{row.description}</TableCell>
      <TableCell>{row.amount}</TableCell>
      <TableCell>{row.taskId}</TableCell>
      <TableCell>{row.BidId}</TableCell>
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
      )}

<Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
>
  <MenuItem
    onClick={() => {
      openModal(menuRow); // Pass correct row here!
      handleMenuClose();
    }}
  >
    Send Money to Bidder
  </MenuItem>

  <MenuItem onClick={() => handleDeleteRequest(menuRow.requestId)}>
    Delete
  </MenuItem>
</Menu>



 {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Send Money to Bidder</h2>

            <label className="block mb-2 text-sm font-medium">Bidder Name</label>
            <input
              type="text"
              value={bidderName}
              onChange={(e) => setBidderName(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter bidder name"
            />

            <label className="block mb-2 text-sm font-medium">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter amount"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={handleSend}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}




    </Box>
  );
};

export default Dashboard;
