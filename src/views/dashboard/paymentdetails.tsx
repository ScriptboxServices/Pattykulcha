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

// Define the row type
interface Row {
  orderName: string;
  orderId: string;
  date: string;
  tax: string;
  discount: string;
}

function PaymentDetailsTable() {
  const theme = useTheme();
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);

  const rows: Row[] = [
    { orderName: 'Amritsari Kulcha', orderId: '#351', date: '28/06/2024, 04:30 PM', tax: '$3.5', discount: '$2.5' },
    { orderName: 'Paneer Kulcha', orderId: '#352', date: '28/06/2024, 06:30 PM', tax: '$3.5', discount: '$2.5' },
    { orderName: 'Amritsari Kulcha', orderId: '#353', date: '28/06/2024, 04:30 PM', tax: '$1.5', discount: '$2.5' },
    { orderName: 'Paneer Kulcha', orderId: '#354', date: '28/06/2024, 06:30 PM', tax: '$3.5', discount: '$2.5' },
    { orderName: 'Amritsari Kulcha', orderId: '#355', date: '28/06/2024, 04:30 PM', tax: '$2.5', discount: '$2.5' },
    { orderName: 'Paneer Kulcha', orderId: '#356', date: '28/06/2024, 06:30 PM', tax: '$4.5', discount: '$2.5' },
    { orderName: 'Amritsari Kulcha', orderId: '#357', date: '28/06/2024, 04:30 PM', tax: '$3.5', discount: '$2.5' }
  ];

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer  sx={{ borderRadius: 2, bgcolor: "white",padding:4 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, pl: 2, pt: 2 }}>
        Payment Details
      </Typography>
      <Table sx={{ minWidth: 500,border:"1px solid #e0e0e0",borderRadius:13 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', paddingY: 2, backgroundColor: '#f5f5f5', borderBottom: '2px solid #dcdcdc' }}>Order Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', paddingY: 2, backgroundColor: '#f5f5f5', borderBottom: '2px solid #dcdcdc' }}>Order ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', paddingY: 2, backgroundColor: '#f5f5f5', borderBottom: '2px solid #dcdcdc' }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', paddingY: 2, backgroundColor: '#f5f5f5', borderBottom: '2px solid #dcdcdc' }}>Tax</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', paddingY: 2, backgroundColor: '#f5f5f5', borderBottom: '2px solid #dcdcdc' }}>Discount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row, index) => (
            <TableRow key={index} sx={{ borderBottom: '1px solid #e0e0e0' }}>
              <TableCell component="th" scope="row" sx={{ paddingY: 2 }}>
                {row.orderName}
              </TableCell>
              <TableCell sx={{ paddingY: 2 }}>{row.orderId}</TableCell>
              <TableCell sx={{ paddingY: 2 }}>{row.date}</TableCell>
              <TableCell sx={{ paddingY: 2 }}>{row.tax}</TableCell>
              <TableCell sx={{ paddingY: 2 }}>{row.discount}</TableCell>
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
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={() => (
                <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                  <IconButton
                    onClick={handleFirstPageButtonClick}
                    disabled={page == 0}
                    aria-label="first page"
                  >
                    {theme.direction == 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                  </IconButton>
                  <IconButton
                    onClick={handleBackButtonClick}
                    disabled={page == 0}
                    aria-label="previous page"
                  >
                    {theme.direction == 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                  </IconButton>
                  <IconButton
                    onClick={handleNextButtonClick}
                    disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}
                    aria-label="next page"
                  >
                    {theme.direction == 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                  </IconButton>
                  <IconButton
                    onClick={handleLastPageButtonClick}
                    disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}
                    aria-label="last page"
                  >
                    {theme.direction == 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
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

export default PaymentDetailsTable;
