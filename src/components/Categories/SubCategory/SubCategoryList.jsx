import React, { useState, useEffect } from "react";
import Searchbar from "../../../layout/searchComponent";
import AddSubCategoryModal from "../../../components/Categories/SubCategory/AddSubCategoryModel";
import EditSubCategoryButton from "../../../components/Categories/SubCategory/EditSubCategoryModel";
import BulkUploadCsv from "../../../components/Categories/SubCategory/CsvFileUpload";
import {
  fetchSubcategories,
  deleteSubcategory,
} from "../../../Services/subCategoryService";
import { fetchCategories } from "../../../Services/categoryService";

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

const API_URL = "http://localhost:3001/dashboard/subcategories";

// ✅ Updated id keys to match actual data keys
const columns = [
  { id: "sno", label: "S.No", minWidth: 50 },
  { id: "subCategoryImage", label: "Image", minWidth: 100 },
  { id: "categoryName", label: "Category Name", minWidth: 100 },
  { id: "SubCategoryName", label: "Sub Category Name", minWidth: 200 },
  { id: "description", label: "Description", minWidth: 200 },
  { id: "action", label: "Action", minWidth: 50 },
];

function SubCategories() {
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subCategoryData = await fetchSubcategories();
        const categoryData = await fetchCategories();
        const subCategoriesWithCategoryNames = await subCategoryData.map(
          (sub) => ({
            ...sub,
            categoryName:
              categoryData.find(
                (cat) => cat.categoryId === Number(sub.categoryId)
              )?.categoryName || "N/A",
          })
        );

        setSubCategories(subCategoriesWithCategoryNames);
        setFilteredSubCategories(subCategoriesWithCategoryNames);
      } catch (error) {
        console.error("Error fetching subcategories or categories:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = subCategories.filter((subCategory) => {
      if (!subCategory?.SubCategoryName) {
        console.warn("Missing SubCategoryName in:", subCategory);
      }
      return (subCategory?.SubCategoryName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    });
    setFilteredSubCategories(filteredData);
  }, [searchQuery, subCategories]);

  const handleDelete = async (subCategoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;
    console.log("Deleting subCategoryId:", subCategoryId);
    try {
      await deleteSubcategory(subCategoryId);
      setSubCategories(
        subCategories.filter((sub) => sub.subCategoryId !== subCategoryId)
      );
    } catch (error) {
      console.error("Failed to delete subcategory:", error);
    }
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(subCategories);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SubCategory List");
    XLSX.writeFile(workbook, "SubCategory_List.xlsx");
  };

  console.log("::::...", filteredSubCategories);

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
              <AddSubCategoryModal
                open={isModalOpen}
                handleClose={() => setIsModalOpen(false)}
                onSubCategoryAdded={(newSubCategory) =>
                  setSubCategories((prev) => [...prev, newSubCategory])
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
              {filteredSubCategories
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover key={row.subCategoryId}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        sx={column.id === "sno" ? { paddingLeft: 3 } : {}}
                      >
                        {column.id === "action" ? (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton>
                              <EditSubCategoryButton
                                subCategory={row}
                                onUpdate={() =>
                                  fetchSubcategories().then((subData) => {
                                    fetchCategories().then((catData) => {
                                      const updated = subData.map((sub) => ({
                                        ...sub,
                                        categoryName:
                                          catData.find(
                                            (cat) =>
                                              cat.categoryId === sub.categoryId
                                          )?.categoryName || "N/A",
                                      }));
                                      setSubCategories(updated);
                                      setFilteredSubCategories(updated);
                                    });
                                  })
                                }
                              />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                console.log(
                                  "row.subCategoryId",
                                  row.subCategoryId
                                );
                                handleDelete(row.SubCategoryId);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        ) : column.id === "sno" ? (
                          index + 1 + page * rowsPerPage
                        ) : column.id === "subCategoryImage" ? (
                          <Avatar
                            src={`${API_URL}/storage/userdp/${row.subCategoryImage}`}
                            alt={row.SubCategoryName}
                            sx={{ width: 40, height: 40 }}
                          />
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={filteredSubCategories.length}
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

export default SubCategories;
