import React, { useState } from 'react';
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
} from '@mui/material';

const Dashboard = () => {
  const theme = useTheme();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const data = [
    {
      id: 1,
      date: '2025-05-01',
      taskOwner: 'Alice',
      taskUser: 'Bob',
      type: 'Online',
      payment: 500,
      status: 'Completed',
    },
    {
      id: 2,
      date: '2025-05-15',
      taskOwner: 'Charlie',
      taskUser: 'Dave',
      type: 'Cash',
      payment: 300,
      status: 'Pending',
    },
  ];


 const summaryCards = [
    { label: 'Disputes', count: 5765, color: '#B983FF' },
    { label: 'Disputes Last 24 Hrs', count: 754, color: '#00D100' },
    { label: 'Complete Tasks', count: 754, color: '#03A9F4' },       // green
    { label: "Pending's Disputes", count: 643, color: '#F9D923' }
  ];


  const filteredData = data.filter((row) => {
    const rowDate = new Date(row.date);
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
    <div style={{ padding: 0, mt:5
     }}>
      <Grid container spacing={2} sx={{ flexWrap: 'nowrap', overflowX: 'auto', mt:2}}>
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

     <Paper sx={{ p: 2, mb: 3, mt:3 }}>
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
      onClick={() => {}}
      style={{ height: '100%' }}
    >
      Search
    </Button>
  </Grid>
</Grid>

  {/* Table */}
  <TableContainer sx={{mt:2}}>
    <Table>
      <TableHead>
        <TableRow sx={{ backgroundColor: theme.palette.primary.main, height: 60 }}>
          <TableCell sx={{ color: '#fff' }}>S.No</TableCell>
          <TableCell sx={{ color: '#fff' }}>Date of Payment</TableCell>
          <TableCell sx={{ color: '#fff' }}>Task Owner</TableCell>
          <TableCell sx={{ color: '#fff' }}>Task User</TableCell>
          <TableCell sx={{ color: '#fff' }}>Type of Payment</TableCell>
          <TableCell sx={{ color: '#fff' }}>Payment</TableCell>
          <TableCell sx={{ color: '#fff' }}>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredData.map((row, index) => (
          <TableRow key={row.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{row.date}</TableCell>
            <TableCell>{row.taskOwner}</TableCell>
            <TableCell>{row.taskUser}</TableCell>
            <TableCell>{row.type}</TableCell>
            <TableCell>₹{row.payment}</TableCell>
            <TableCell>
              <Button variant="contained" size="small" onClick={() => handleOpen(row)}>
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
              <Typography><strong>Task Owner:</strong> {selectedRow.taskOwner}</Typography>
              <Typography><strong>Task User:</strong> {selectedRow.taskUser}</Typography>
              <Typography><strong>Payment Type:</strong> {selectedRow.type}</Typography>
              <Typography><strong>Amount:</strong> ₹{selectedRow.payment}</Typography>
              <Typography><strong>Status:</strong> {selectedRow.status}</Typography>
              <Typography><strong>Date:</strong> {selectedRow.date}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => alert("Downloading...")} color="primary" variant="contained">
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

const StatCard = ({ title, value, color }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Card sx={{ backgroundColor: color, color: '#fff' }}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
          {title}
        </Typography>
        <Typography variant="h6">{value}</Typography>
      </CardContent>
    </Card>
  </Grid>
);

export default Dashboard;
