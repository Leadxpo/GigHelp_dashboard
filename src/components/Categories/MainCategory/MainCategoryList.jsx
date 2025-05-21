import React, { useState, useEffect } from "react";
import Searchbar from "../../../layout/searchComponent";
import AddCategoryModal from "../../../components/Categories/MainCategory/AddCategoryModel";
import EditCategoryButton from "../../../components/Categories/MainCategory/EditCategoryModel";
import BulkUploadCsv from "../../../components/Categories/MainCategory/BulkuploadcsvFile";
import {
  fetchCategories,
  deleteCategory,
} from "../../../Services/categoryService";

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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Avatar } from "@mui/material";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import * as XLSX from "xlsx";

const API_URL = "http://localhost:3001/dashboard/categories";

const columns = [
  { id: "sno", label: "S.No", minWidth: 100 },
  { id: "categoryImage", label: " Image", minWidth: 100 },
  { id: "categoryName", label: "Category Name", minWidth: 200 },
  { id: "description", label: "Description", minWidth: 200 },
  { id: "action", label: "Action", minWidth: 50 },
];

function Categories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCategories().then((data) => {
      setCategories(data);
      setFilteredCategories(data);
    });
  }, []);

  useEffect(() => {
    const filteredData = categories.filter((category) =>
      category.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filteredData);
  }, [searchQuery, categories]);

const handleDelete = async (categoryId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this category?");
  if (!confirmDelete) return;
  try {
    await deleteCategory(categoryId);
    setCategories(
      categories.filter((category) => category.categoryId !== categoryId)
    );
  } catch (error) {
    console.error("Failed to delete category:", error);
  }
};

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(categories);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Category List");
    XLSX.writeFile(workbook, "Category_List.xlsx");
  };

  return (
    <>
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
                <AddCategoryModal
                  open={isModalOpen}
                  handleClose={() => setIsModalOpen(false)}
                  onCategoryAdded={(newCategory) =>
                    setCategories((prevCategories) => [
                      ...prevCategories,
                      newCategory,
                    ])
                  }
                />
              </IconButton>
              <IconButton
                title="Upload CSV"
                onClick={() => setCsvModalOpen(true)}
              >
                <BulkUploadCsv
                  open={csvModalOpen}
                  handleClose={() => setCsvModalOpen(false)}
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
                {filteredCategories
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover key={row.category_id}>
                      {columns.map((column) => {
                        const value =
                          column.id === "sno"
                            ? index + 1 + page * rowsPerPage
                            : column.id === "categoryImage"
                            ? row.categoryImage
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
                                  <EditCategoryButton
                                    category={row}
                                    onUpdate={() =>
                                      fetchCategories().then(setCategories)
                                    }
                                  />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleDelete(row.categoryId)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            ) : column.id === "categoryImage" ? (
                              <Avatar
                                alt={row.categoryName}
                                src={`${API_URL}/storage/userdp/${value}`}
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
            count={filteredCategories.length}
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
    </>
  );
}

export default Categories;
