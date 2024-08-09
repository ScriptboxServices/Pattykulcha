import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const AddCouponComponent: React.FC = () => {
  const details = [
    { label: 'Sub total', value: '$15.5' },
    { label: 'Tax', value: '$1.25' },
    { label: 'Total', value: '$17' },
  ];

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
      bgcolor="#FAF3E0"
      width="100%"
      padding={2} // Add padding to reduce outer spacing
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
        </Box>
      </Paper>
    </Box>
  );
};

export default AddCouponComponent;
