import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  useTheme,
} from "@mui/material";

import axios from "axios";

const token = localStorage.getItem("accessToken");
const API_URL = "http://localhost:3001/dashboard";

const Dashboard = () => {
  const theme = useTheme();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [data, setData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const getUserData = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("User fetch error:", err);
    }
  };

  const getTaskData = async () => {
    try {
      const res = await axios.get(`${API_URL}/task/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.data || []);
    } catch (err) {
      console.error("Task fetch error:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      let url = `${API_URL}/transections/get-all`;
      if (fromDate || toDate) {
        const params = [];
        if (fromDate) params.push(`from=${fromDate}`);
        if (toDate) params.push(`to=${toDate}`);
        url += `?${params.join("&")}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data.data || []);
    } catch (error) {
      console.error("Transaction fetch error:", error);
    }
  };

  useEffect(() => {
    getUserData();
    getTaskData();
    fetchTransactions();
  }, []);

  // Corrected userName fetcher
  const getUserName = (userId) => {
    if (!userId) return "Unknown";
    const user = users.find((u) => String(u.userId) === String(userId));
    return user ? user.userName : "Unknown";
  };

  // Task summary counts
  const completeTasks = tasks.filter((t) => t.status === "complete").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const allDisputes = tasks.filter((t) => t.status === "disputes").length;
  const last24HrsDisputes = tasks.filter((t) => {
    const created = new Date(t.createdAt);
    const now = new Date();
    const diff = (now - created) / (1000 * 60 * 60);
    return diff <= 24 && t.status === "Disputes";
  }).length;

  const summaryCards = [
    { label: "Disputes", count: allDisputes, color: "#B983FF" },
    {
      label: "Disputes Last 24 Hrs",
      count: last24HrsDisputes,
      color: "#00D100",
    },
    { label: "Complete Tasks", count: completeTasks, color: "#03A9F4" },
    { label: "Pending's Disputes", count: pendingTasks, color: "#F9D923" },
  ];

  // Filter by date
  const filteredData = data.filter((row) => {
    const rowDate = new Date(row.date || row.createdAt);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    return (!from || rowDate >= from) && (!to || rowDate <= to);
  });

  const handleOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  return (
    <div style={{ padding: 0 }}>
      <Grid
        container
        spacing={2}
        sx={{ flexWrap: "nowrap", overflowX: "auto", mt: 2 }}
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

      <Paper sx={{ p: 2, mb: 3, mt: 3 }}>
        {/* Filters */}
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          mb={2}
        >
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={fetchTransactions}
               sx={{ color: "#fff",  fontSize: "16px", fontWeight: "bold" }}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        {/* Table */}
        <TableContainer sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow
                sx={{ backgroundColor: theme.palette.primary.main, height: 60 }}
              >
                <TableCell
                  sx={{ color: "#fff",  fontSize: "16px", fontWeight: "bold" }}
                >
                  S.No
                </TableCell>
                <TableCell
                  sx={{ color: "#fff",  fontSize: "16px", fontWeight: "bold" }}
                >
                  Date of Payment
                </TableCell>
                <TableCell
                  sx={{ color: "#fff",  fontSize: "16px", fontWeight: "bold" }}
                >
                  Task Owner
                </TableCell>
                <TableCell
                  sx={{ color: "#fff",  fontSize: "16px", fontWeight: "bold" }}
                >
                  Task User
                </TableCell>
                <TableCell
                  sx={{ color: "#fff",  fontSize: "16px", fontWeight: "bold" }}
                >
                  Type of Payment
                </TableCell>
                <TableCell
                  sx={{ color: "#fff",  fontSize: "16px", fontWeight: "bold" }}
                >
                  Payment
                </TableCell>
                <TableCell
                  sx={{ color: "#fff",  fontSize: "16px", fontWeight: "bold" }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{ color: "#fff",  fontSize: "16px", fontWeight: "bold" }}
                >
                  Receipts
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow key={row.id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {new Date(row.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getUserName(row.taskOwner)}</TableCell>
                  <TableCell>{getUserName(row.taskUser)}</TableCell>
                  <TableCell>{row.typeOfPayment}</TableCell>
                  <TableCell>₹{row.amount}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleOpen(row)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Task Payment Details</DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <>
              <Typography>
                <strong>Task Owner:</strong>{" "}
                {getUserName(selectedRow.taskOwner)}
              </Typography>
              <Typography>
                <strong>Task User:</strong> {getUserName(selectedRow.taskUser)}
              </Typography>
              <Typography>
                <strong>Payment Type:</strong> {selectedRow.type}
              </Typography>
              <Typography>
                <strong>Amount:</strong> ₹{selectedRow.amount}
              </Typography>
              <Typography>
                <strong>Status:</strong> {selectedRow.status}
              </Typography>
              <Typography>
                <strong>Date:</strong>{" "}
                {new Date(selectedRow.createdAt).toLocaleString()}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => alert("Downloading...")}
            color="primary"
            variant="contained"
          >
            Download
          </Button>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
