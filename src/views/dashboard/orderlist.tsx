"use client";

import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from '@mui/material/TableHead';
import { Typography } from '@mui/material';

function CustomPaginationActionsTable() {
  const theme = useTheme();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const rows = [
    {
      orderName: 'Amritsari Kulcha',
      addon: 'Add-ons: Coke, Extra Chutney',
      dateTime: '28/06/2024, 04:30 PM',
      address: '4417 Shaughnessy St,Port Coquitlam, BC',
      payment: 'Received',
    },
    {
      orderName: 'Paneer Kulcha',
      addon: 'Add-ons: Dollar Channa, Extra Chutney',
      dateTime: '28/06/2024, 06:30 PM',
      address: '4417 Shaughnessy St,Port Coquitlam, BC',
      payment: 'Received',
    },
    {
      orderName: 'Amritsari Kulcha',
      addon: 'Add-ons: Coke, Extra Chutney',
      dateTime: '28/06/2024, 04:30 PM',
      address: '4417 Shaughnessy St,Port Coquitlam, BC',
      payment: 'Received',
    },
    {
      orderName: 'Paneer Kulcha',
      addon: 'Add-ons: Dollar Channa, Extra Chutney',
      dateTime: '28/06/2024, 06:30 PM',
      address: '4417 Shaughnessy St,Port Coquitlam, BC',
      payment: 'Received',
    },
    {
      orderName: 'Amritsari Kulcha',
      addon: 'Add-ons: Coke, Extra Chutney',
      dateTime: '28/06/2024, 04:30 PM',
      address: '4417 Shaughnessy St,Port Coquitlam, BC',
      payment: 'Received',
    },
    {
      orderName: 'Paneer Kulcha',
      addon: 'Add-ons: Dollar Channa, Extra Chutney',
      dateTime: '28/06/2024, 06:30 PM',
      address: '4417 Shaughnessy St,Port Coquitlam, BC',
      payment: 'Received',
    },
    {
      orderName: 'Amritsari Kulcha',
      addon: 'Add-ons: Coke, Extra Chutney',
      dateTime: '28/06/2024, 04:30 PM',
      address: '4417 Shaughnessy St,Port Coquitlam, BC',
      payment: 'Received',
    },
  ];

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPage(0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPage((prevPage) => prevPage - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPage(Math.max(0, Math.ceil(rows.length / rowsPerPage) - 1));
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, pl: 2, pt: 2 }}>
        Order Details
      </Typography>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Order Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Add-on</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Date & Time</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Address</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Payment</TableCell>
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
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={5}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={() => (
                <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                  <IconButton
                    onClick={handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="first page"
                  >
                    {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                  </IconButton>
                  <IconButton
                    onClick={handleBackButtonClick}
                    disabled={page === 0}
                    aria-label="previous page"
                  >
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                  </IconButton>
                  <IconButton
                    onClick={handleNextButtonClick}
                    disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}
                    aria-label="next page"
                  >
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                  </IconButton>
                  <IconButton
                    onClick={handleLastPageButtonClick}
                    disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}
                    aria-label="last page"
                  >
                    {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
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
