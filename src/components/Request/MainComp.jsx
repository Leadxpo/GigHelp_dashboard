import React from 'react';
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
  MenuItem,
  MoreVert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuRow, setMenuRow] = React.useState(null);
    const navigate = useNavigate();
  

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setMenuRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRow(null);
  };

  const summaryCards = [
    { label: 'Disputes', count: 5765, color: '#B983FF' },
    { label: 'Disputes Last 24 Hrs', count: 754, color: '#00D100' },
    { label: 'Complete Tasks', count: 754, color: '#03A9F4' },       // green
    { label: "Pending's Disputes", count: 643, color: '#F9D923' }
  ];

  const users = [
    { id: 1, clientId: '23434564', task: 'Digital Marketing', work: 'Marketing', dispute: 'Praveen', kyc: 'Approved' },
    { id: 2, clientId: '23434564', task: 'Digital Marketing', work: 'Marketing', dispute: 'Praveen', kyc: 'Pending' },
    { id: 3, clientId: '23434564', task: 'Digital Marketing', work: 'Marketing', dispute: 'Praveen', kyc: 'Dispute' }
  ];

  const kycColors = {
    Approved: 'success',
    Pending: 'warning',
    Dispute: 'info'
  };

  return (
    <Box sx={{ p: 0 ,mt:2 }}>
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
         <TableHead sx={{ backgroundColor: '#0D6EFD', height: 60 }}>
  <TableRow>
    {['No.', 'Client ID', 'Task', 'Work', 'Disputes', 'KYC Status', 'Action'].map((head, index) => (
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
            {users.map((row, idx) => (
              <TableRow key={row.id}>
                <TableCell>{`0${idx + 1}`}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar alt="Profile" src="https://randomuser.me/api/portraits/women/81.jpg" />
                    <Typography>{row.clientId}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{row.task}</TableCell>
                <TableCell>{row.work}</TableCell>
                <TableCell>{row.dispute}</TableCell>
                <TableCell>
                  <Chip label={row.kyc} color={kycColors[row.kyc]} />
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
<Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
>
  <MenuItem
    onClick={() => {
      // Ensure you have useNavigate from react-router-dom
      navigate("/requestMoreDetails", { state: { userDetails: menuRow } });
      handleMenuClose();
    }}
  >
    Fore Details
  </MenuItem>
  <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
</Menu>

    </Box>
  );
};

export default Dashboard;
