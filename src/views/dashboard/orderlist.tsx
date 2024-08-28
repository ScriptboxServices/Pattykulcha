"use client";

import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import TableHead from "@mui/material/TableHead";
import { Typography, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

function CustomPaginationActionsTable() {
  const theme = useTheme();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([
    {
      orderName: "Amritsari Kulcha",
      addon: "Add-ons: Coke, Extra Chutney",
      dateTime: "28/06/2024, 04:30 PM",
      address: "4417 Shaughnessy St,Port Coquitlam, BC",
      payment: "Received",
      assignedTo: "John Doe",
    },
    {
      orderName: "Paneer Kulcha",
      addon: "Add-ons: Dollar Channa, Extra Chutney",
      dateTime: "28/06/2024, 06:30 PM",
      address: "4417 Shaughnessy St,Port Coquitlam, BC",
      payment: "Received",
      assignedTo: "Jane Smith",
    },
    {
      orderName: "Aloo Kulcha",
      addon: "Add-ons: Lassi, Extra Butter",
      dateTime: "28/06/2024, 07:00 PM",
      address: "1234 Maple St, Vancouver, BC",
      payment: "Received",
      assignedTo: "Mike Johnson",
    },
    {
      orderName: "Gobhi Kulcha",
      addon: "Add-ons: Raita, Extra Chutney",
      dateTime: "28/06/2024, 07:15 PM",
      address: "5678 Oak St, Burnaby, BC",
      payment: "Received",
      assignedTo: "Emily Davis",
    },
    {
      orderName: "Mix Veg Kulcha",
      addon: "Add-ons: Lassi, Extra Chutney",
      dateTime: "28/06/2024, 08:00 PM",
      address: "9101 Fraser St, Richmond, BC",
      payment: "Pending",
      assignedTo: "Chris Martin",
    },
    {
      orderName: "Paneer Kulcha",
      addon: "Add-ons: Dollar Channa, Coke",
      dateTime: "28/06/2024, 08:30 PM",
      address: "2234 King St, Surrey, BC",
      payment: "Received",
      assignedTo: "Sarah Lee",
    },
    {
      orderName: "Onion Kulcha",
      addon: "Add-ons: Raita, Extra Chutney",
      dateTime: "28/06/2024, 09:00 PM",
      address: "4321 Elm St, Langley, BC",
      payment: "Pending",
      assignedTo: "David Miller",
    },
    {
      orderName: "Cheese Kulcha",
      addon: "Add-ons: Lassi, Extra Butter",
      dateTime: "28/06/2024, 09:15 PM",
      address: "7890 Pine St, Coquitlam, BC",
      payment: "Received",
      assignedTo: "Sophia Brown",
    },
    {
      orderName: "Paneer Kulcha",
      addon: "Add-ons: Dollar Channa, Coke",
      dateTime: "28/06/2024, 09:30 PM",
      address: "9876 Cedar St, New Westminster, BC",
      payment: "Received",
      assignedTo: "Liam Wilson",
    },
    {
      orderName: "Aloo Kulcha",
      addon: "Add-ons: Raita, Extra Chutney",
      dateTime: "28/06/2024, 10:00 PM",
      address: "6543 Birch St, Delta, BC",
      payment: "Pending",
      assignedTo: "Olivia Johnson",
    },
  ]);

  const [editIndex, setEditIndex] = React.useState(null);
  const [driverList] = React.useState([
    "Ravi shastri",
    "Sachin tendulkar",
    "Ab De villiers",
    "David Miller",
    "Virat kohli",
    "Conor mcregor",
    "Sophia Brown",
    "Olivia Johnson",
    "Liam Wilson",
    "Sarah Lee",
    "John Doe",
    "Emily Davis",
    "Jane Smith",
  ]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleFirstPageButtonClick = (event: any) => {
    setPage(0);
  };

  const handleBackButtonClick = (event: any) => {
    setPage((prevPage) => prevPage - 1);
  };

  const handleNextButtonClick = (event: any) => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleLastPageButtonClick = (event: any) => {
    setPage(Math.max(0, Math.ceil(rows.length / rowsPerPage) - 1));
  };

  const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (index: number | React.SetStateAction<any>) => {
    setEditIndex(index);
  };

  const handleDriverChange = (index: string | number|any, event: SelectChangeEvent<any>) => {
    const newRows = [...rows];
    newRows[index].assignedTo = event.target.value;
    setRows(newRows);
    setEditIndex(null);
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: 2, padding: 4, minWidth: 900 }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, pl: 2, pt: 2 }}>
        Order Details
      </Typography>
      <Table sx={{ minWidth: "500px" }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "16px",
                paddingY: 2,
                backgroundColor: "#f5f5f5",
                borderBottom: "2px solid #dcdcdc",
              }}
            >
              Order Name
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "16px",
                paddingY: 2,
                backgroundColor: "#f5f5f5",
                borderBottom: "2px solid #dcdcdc",
              }}
            >
              Add-on
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "16px",
                paddingY: 2,
                backgroundColor: "#f5f5f5",
                borderBottom: "2px solid #dcdcdc",
              }}
            >
              Date & Time
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "16px",
                paddingY: 2,
                backgroundColor: "#f5f5f5",
                borderBottom: "2px solid #dcdcdc",
              }}
            >
              Address
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "16px",
                paddingY: 2,
                backgroundColor: "#f5f5f5",
                borderBottom: "2px solid #dcdcdc",
              }}
            >
              Payment
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "16px",
                paddingY: 2,
                backgroundColor: "#f5f5f5",
                borderBottom: "2px solid #dcdcdc",
              }}
            >
              Assigned To
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "16px",
                paddingY: 2,
                backgroundColor: "#f5f5f5",
                borderBottom: "2px solid #dcdcdc",
              }}
            >
              Edit
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row" sx={{ paddingY: 2 }}>
                {row.orderName}
              </TableCell>
              <TableCell sx={{ paddingY: 2 }}>{row.addon}</TableCell>
              <TableCell sx={{ paddingY: 2 }}>{row.dateTime}</TableCell>
              <TableCell sx={{ paddingY: 2 }}>{row.address}</TableCell>
              <TableCell sx={{ paddingY: 2 }}>{row.payment}</TableCell>
              <TableCell sx={{ paddingY: 2 }}>
                {editIndex === index ? (
                  <Select
                    value={row.assignedTo}
                    onChange={(event) => handleDriverChange(index, event)}
                  >
                    {driverList.map((driver) => (
                      <MenuItem key={driver} value={driver}>
                        {driver}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  row.assignedTo
                )}
              </TableCell>
              <TableCell sx={{ paddingY: 2 }}>
                <IconButton onClick={() => handleEditClick(index)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={7} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={7}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={() => (
                <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                  <IconButton
                    onClick={handleFirstPageButtonClick}
                    disabled={page == 0}
                    aria-label="first page"
                  >
                    {theme.direction == "rtl" ? (
                      <LastPageIcon />
                    ) : (
                      <FirstPageIcon />
                    )}
                  </IconButton>
                  <IconButton
                    onClick={handleBackButtonClick}
                    disabled={page == 0}
                    aria-label="previous page"
                  >
                    {theme.direction == "rtl" ? (
                      <KeyboardArrowRight />
                    ) : (
                      <KeyboardArrowLeft />
                    )}
                  </IconButton>
                  <IconButton
                    onClick={handleNextButtonClick}
                    disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}
                    aria-label="next page"
                  >
                    {theme.direction == "rtl" ? (
                      <KeyboardArrowLeft />
                    ) : (
                      <KeyboardArrowRight />
                    )}
                  </IconButton>
                  <IconButton
                    onClick={handleLastPageButtonClick}
                    disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}
                    aria-label="last page"
                  >
                    {theme.direction == "rtl" ? (
                      <FirstPageIcon />
                    ) : (
                      <LastPageIcon />
                    )}
                  </IconButton>
                </Box>
              )}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default CustomPaginationActionsTable;
