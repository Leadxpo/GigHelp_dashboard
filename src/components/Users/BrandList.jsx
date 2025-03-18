import React, { useState, useEffect } from "react";
import Searchbar from "../../layout/searchComponent";
import AddModel from "./addBrandModel";
import EditBrandButton  from "./editBrandModel";
import BulkUploadCsv from "./csvfileUpload";
import { fetchBrands, deleteBrand } from "../../Services/brandService";

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
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import * as XLSX from "xlsx";

const API_URL = 'http://localhost:3001/web/brand';


const columns = [
  { id: "sno", label: "S.No", minWidth: 100 },
  { id: "brand_name", label: "Client Id", minWidth: 100 },
  { id: "description", label: "Task", minWidth: 100 },
  { id: "brand_image", label: "Work", minWidth: 100 },
  { id: "brand_image", label: "Disputes", minWidth: 100 },
  { id: "brand_image", label: "KYC Status", minWidth: 100 },

  { id: "action", label: "Action", minWidth: 50 },
];

function Brands() {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  

  useEffect(() => {
    fetchBrands().then((data) => {
      setBrands(data);
      setFilteredBrands(data);
    });
  }, []);

  // Filter brands based on search input
  useEffect(() => {
    const filteredData = brands.filter((brand) =>
      brand.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBrands(filteredData);
  }, [searchQuery, brands]);

  const handleDelete = async (brandId) => {
    try {
      await deleteBrand(brandId);
      setBrands(brands.filter((brand) => brand.brand_id !== brandId));
    } catch (error) {
      console.error("Failed to delete brand:", error);
    }
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(brands);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Brand List");
    XLSX.writeFile(workbook, "Brand_List.xlsx");
  };

  return (
    <>
      <Box>
        <Paper sx={{ width: "100%", mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 3 }}>
          <Searchbar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <Box sx={{ display: "flex" }}>
              <IconButton>
                <AddModel 
                  open={isModalOpen} 
                  handleClose={() => setIsModalOpen(false)} 
                  onBrandAdded={(newBrand) => setBrands((prevBrands) => [...prevBrands, newBrand])} 
                />
              </IconButton>

              <IconButton title="Upload CSV" onClick={() => setCsvModalOpen(true)}>
                <BulkUploadCsv open={csvModalOpen} handleClose={() => setCsvModalOpen(false)} />
              </IconButton>

              <IconButton title="Download Excel" onClick={handleDownloadExcel}>
                <SimCardDownloadIcon />
              </IconButton>
            </Box>
          </Box>

          <TableContainer sx={{ maxHeight: 840 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} style={{ fontWeight: "bold" }}>{column.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
  {filteredBrands.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
    <TableRow hover key={row.id}>
      {columns.map((column) => (
        <TableCell key={column.id}>
          {column.id === "action" ? (
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton>
                <EditBrandButton brand={row} onUpdate={() => fetchBrands().then(setBrands)} />
              </IconButton>
              <IconButton onClick={() => handleDelete(row.brand_id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ) : column.id === "sno" ? (
            index + 1
          ) : column.id === "brand_image" ? (
            <img
              src={`${API_URL}/storage/userdp/${row.brand_image}`}
              alt={row.brand_name}
              className="h-10 w-15 object-cover"
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
            count={filteredBrands.length}
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

export default Brands;
