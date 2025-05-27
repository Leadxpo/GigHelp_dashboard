import React, { useState, useEffect } from "react";
import Searchbar from "../../layout/searchComponent";
import AddSystemUserModal from "../../components/SystemUser/AddSystemUserModel";
import EditSystemUserButton from "../../components/SystemUser/EditSystemUserModel";
import axios from "axios";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import * as XLSX from "xlsx";

const API_URL = "http://localhost:3001/dashboard/systemuser";
const token = localStorage.getItem("accessToken");

const columns = [
  { id: "sno", label: "S.No", minWidth: 100 },
  { id: "profilePic", label: "Image", minWidth: 100 },
  { id: "userName", label: "Name", minWidth: 200 },
  { id: "phoneNumber", label: "Phone Number", minWidth: 150 },
  { id: "email", label: "Email", minWidth: 200 },
  { id: "role", label: "Role", minWidth: 100 },
  { id: "address", label: "Address", minWidth: 150 },
  { id: "action", label: "Action", minWidth: 100 },
];

function SystemUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSystemUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setUsers(data);
      setFilteredUsers(data);
      return data;
    } catch (error) {
      console.error("Error fetching system users:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchSystemUsers().then((data) => {
      setUsers(data);
      setFilteredUsers(data);
    });
    fetchSystemUsers()
  }, []);

  const deleteSystemUser = async (userId) => {

    console.log("============>",userId)
    try {
      await axios.delete(`${API_URL}/delete/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error deleting system user:", error);
      throw error;
    }
  };

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.userName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await deleteSystemUser(userId);
      const updated = users.filter((user) => user.userId !== userId);
      setUsers(updated);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "System Users");
    XLSX.writeFile(workbook, "SystemUsers.xlsx");
  };

  return (
    <Box>
      <Paper sx={{ width: "100%", mt: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 3,
          }}
        >
          <Searchbar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Box sx={{ display: "flex" }}>
            <IconButton>
              <AddSystemUserModal
                open={isModalOpen}
                handleClose={() => setIsModalOpen(false)}
                onUserAdded={(newUser) =>
                  setUsers((prevUsers) => [...prevUsers, newUser])
                }
              />
            </IconButton>

            <IconButton title="Download Excel" onClick={handleDownloadExcel}>
              <SimCardDownloadIcon />
            </IconButton>
          </Box>
        </Box>

        <TableContainer sx={{ maxHeight: 840 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.main", height: 60 }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "white",
                      paddingLeft: column.id === "sno" ? 3 : 2,
                      height: "60px",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover key={row.id}>
                    {columns.map((column) => {
                      const value =
                        column.id === "sno"
                          ? index + 1 + page * rowsPerPage
                          : row[column.id];

                      return (
                        <TableCell
                          key={column.id}
                          sx={
                            column.id === "sno"
                              ? {
                                  paddingLeft: 3,
                                  paddingTop: 1,
                                  paddingBottom: 1,
                                }
                              : {}
                          }
                        >
                          {column.id === "action" ? (
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <IconButton>
                                <EditSystemUserButton
                                  user={row}
                                  onUpdate={() =>
                                    fetchSystemUsers().then((data) => {
                                      setUsers(data);
                                      setFilteredUsers(data);
                                    })
                                  }
                                />
                              </IconButton>
                              <IconButton onClick={() => handleDelete(row.userId)}>
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          ) : column.id === "profilePic" ? (
                            <Avatar
                              alt={row.userName}
                             src={`http://localhost:3001/storege/userdp/${row.profilePic}`} 
                              sx={{ width: 40, height: 40 }}
                            />
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(+event.target.value);
            setPage(0);
          }}
        />
      </Paper>
    </Box>
  );
}

export default SystemUsers;
