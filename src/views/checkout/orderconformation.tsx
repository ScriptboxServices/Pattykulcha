'use client';

import React from 'react';
import { Box, Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { useMenuContext } from '@/context'; // Adjust the path as necessary

const OrdersPage: React.FC = () => {
  const { carts, grandTotal } = useMenuContext();

  const name = 'Jane Smith';
  const address = '456 Oak St #3b, San Francisco, CA 94102, United States';
  const phone = '+1 (415) 555-1234';

  const orderSummary = [
    { date: '02 May 2023', orderNumber: '024-125478956', paymentMethod: 'Mastercard' },
  ];

  return (
    <Box maxWidth='xl' sx={{ backgroundColor: '#FFF5EE', minHeight: '90vh', padding: 2 }}>
      <Paper
        elevation={3}
        sx={{
          maxWidth: '1000px',
          margin: '0 auto',
          mt: 5,
          padding: 4,
          borderRadius: '16px',
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} mt={5}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Thank you for your order!
            </Typography>
            <Typography variant="body1" paragraph>
              Your order will be delivered shortly.
            </Typography>
            <Typography variant="h6" gutterBottom>
              Billing Address
            </Typography>
            <Typography variant="body1">Name: {name}</Typography>
            <Typography variant="body1">Address: {address}</Typography>
            <Typography variant="body1">Phone: {phone}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={1}
              sx={{
                padding: 4,
                borderRadius: '16px',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    {orderSummary.map((summary, index) => (
                      <TableRow key={index}>
                        <TableCell>{summary.date}</TableCell>
                        <TableCell>{summary.orderNumber}</TableCell>
                        <TableCell>{summary.paymentMethod}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {carts.length > 0 ? (
                carts.map((cartItem, index) => (
                  <Box key={index} sx={{ marginBottom: 3 }}>
                    
                    {cartItem.order.kulcha && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 3 }}>
                        <Box
                          component="img"
                          src={cartItem.order.kulcha.image}
                          alt={cartItem.order.kulcha.name}
                          sx={{ width: 60, height: 60, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="body1">{cartItem.order.kulcha.name}</Typography>
                        </Box>
                        <Typography variant="body1" sx={{ ml: 'auto' }}>
                          ${cartItem.order.kulcha.price.toFixed(2)}
                        </Typography>
                      </Box>
                    )}
                    {cartItem.order.additional &&
                      cartItem.order.additional.map((item :any, i : number) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {item.items[0].name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                            +${item.items[0].price.toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                ))
              ) : (
                <Typography variant="body1">No items in the cart.</Typography>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Typography variant="h6">Order Total</Typography>
                <Typography variant="h6">${grandTotal}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default OrdersPage;