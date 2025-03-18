import React, { useState, useEffect } from "react";
import Searchbar from "../../layout/searchComponent";
import AddProductModel from "../../components/Products/AddProductModel";
import EditProductButton from "../../components/Products/EditProductModel";
import BulkUploadCsv from "../../components/Products/csvFileUpload";
import { fetchProducts, deleteProduct } from "../../Services/productService";

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

const API_URL = 'http://localhost:3001/web/product';

const columns = [
  { id: "sno", label: "S.No", minWidth: 50 },
  { id: "product_name", label: "Verified", minWidth: 100 },
  { id: "brand_name", label: "Task ID", minWidth: 100 },
  { id: "price", label: "Task", minWidth: 100 },
  { id: "product_image", label: "Category", minWidth: 100 },
  { id: "product_image", label: "Sub Category", minWidth: 100 },
  { id: "product_image", label: "Transections Given To", minWidth: 100 },
  { id: "product_image", label: "Status", minWidth: 100 },
  { id: "action", label: "Action", minWidth: 50 },
];

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setFilteredProducts(data);
    });
  }, []);

  useEffect(() => {
    const filteredData = products.filter((product) =>
      product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filteredData);
  }, [searchQuery, products]);

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter((product) => product.product_id !== productId));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Product List");
    XLSX.writeFile(workbook, "Product_List.xlsx");
  };

  return (
    <Box>
      <Paper sx={{ width: "100%", mt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 3 }}>
          <Searchbar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <Box sx={{ display: "flex" }}>
            <IconButton>
              <AddProductModel 
                open={isModalOpen} 
                handleClose={() => setIsModalOpen(false)} 
                onProductAdded={(newProduct) => setProducts((prev) => [...prev, newProduct])} 
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
              {filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow hover key={row.product_id}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.id === "action" ? (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton>
                            <EditProductButton product={row} onUpdate={() => fetchProducts().then(setProducts)} />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(row.product_id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ) : column.id === "sno" ? (
                        index + 1
                      ) : column.id === "product_image" ? (
                        <img
                          src={`${API_URL}/storage/product_images/${row.product_image}`}
                          alt={row.product_name}
                          className="h-10 w-15 object-cover"
                        />
                      ) : column.id === "brand_name" ? (
                        row.brand ? row.brand.brand_name : "N/A"
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
          count={filteredProducts.length}
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

export default ProductList;
