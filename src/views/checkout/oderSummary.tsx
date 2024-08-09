'use client'

import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useMenuContext } from '@/context';

const AddCouponComponent: React.FC = () => {
  const router = useRouter();
  const {
    includedItems,
    quantities,
  } = useMenuContext();

  const calculateTotal = () => {
    return includedItems.reduce((total, item) => {
      const itemPrice = item.items[0].price; // Assuming each item has a price stored in items array
      return total + itemPrice * (quantities[item.id] || 1);
    }, 0).toFixed(2);
  };


  const handleProceedToPayment = () => {
    router.push('/payment');
  };

  const details = [
    { label: 'Sub total', value: '$15.5' },
    { label: 'Tax', value: '$1.25' },
    { label: 'Total', value: `${calculateTotal()}` },
  ];

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
      bgcolor="#FAF3E0"
      width="100%"
      padding={2}
    >
      <Paper elevation={3} style={{ padding: '24px', width: '100%', maxWidth: '900px', margin: '0' }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="h6" style={{ fontWeight: 600 }}>Add Coupon</Typography>
          {details.map((item, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent="space-between"
              width="100%"
            >
              <Typography variant="body1" color="textSecondary">{item.label}</Typography>
              <Typography variant="body1" color="textSecondary">{item.value}</Typography>
            </Box>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleProceedToPayment}
            style={{ marginTop: '16px', alignSelf: 'flex-end' }}
          >
            Proceed to Payment
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddCouponComponent;
