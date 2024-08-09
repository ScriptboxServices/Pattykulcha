'use client'

import React, { useState } from 'react';
import { Box, Typography, Paper, IconButton, Button, Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import { Remove, Add } from '@mui/icons-material';
import Image from 'next/image';

interface OrderItemProps {
  id: number;
  itemName: string;
  sideItems: string;
  price: number;
  calories: number;
  quantity: number;
}

const OrderHome: React.FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItemProps[]>([
    {
      id: 1,
      itemName: 'Amritsari Kulcha',
      sideItems: 'Chana, Imli Pyaz Chatni, Normal Butter, Amul Butter Drink',
      price: 8.00,
      calories: 640,
      quantity: 1,
    },
    {
      id: 2,
      itemName: 'Amritsari Kulcha',
      sideItems: 'Chana, Imli Pyaz Chatni, Normal Butter, Amul Butter Drink',
      price: 8.00,
      calories: 640,
      quantity: 1,
    },
    // Add more items if needed
  ]);

  const handleIncrease = (id: number) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id: number) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleEdit = (id: number) => {
    console.log(`Edit clicked for item ${id}`);
  };

  const handleRemove = (id: number) => {
    setOrderItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '10vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAF3E0',
        flexDirection: 'column',
        p: 4,
      }}
    >
      <Container maxWidth="xl">
        {orderItems.map((item) => (
          <Paper
            key={item.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 4,
              backgroundColor: '#FAF3E0',
              width: '100%',
              boxShadow: 'none',
              mb: 2,
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: isSmallScreen ? '100%' : 'auto', mb: isSmallScreen ? 2 : 0 }}>
              <Image src="/images/checkout/checkout2.png" alt={item.itemName} width={120} height={120} />
            </Box>
            <Box sx={{ ml: isSmallScreen ? 0 : 3, flex: 1, width: isSmallScreen ? '100%' : 'auto' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
                {item.itemName}
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563' }}>
                Side items {item.sideItems}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: isSmallScreen ? 'space-between' : 'flex-start', width: '100%' }}>
                <Button onClick={() => handleEdit(item.id)} sx={{ textTransform: 'none', color: '#9CA3AF', fontWeight: 'bold' }}>
                  Edit
                </Button>
                <Button onClick={() => handleRemove(item.id)} sx={{ textTransform: 'none', color: '#9CA3AF', fontWeight: 'bold' }}>
                  Remove
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', ml: isSmallScreen ? 0 : 2, mt: isSmallScreen ? 2 : 0, width: isSmallScreen ? '100%' : 'auto', justifyContent: isSmallScreen ? 'space-between' : 'flex-start' }}>
              <Typography variant="body1" sx={{ color: '#1F2937', fontWeight: 'bold', mr: 1 }}>
                +${item.price.toFixed(2)} | {item.calories} cal
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => handleDecrease(item.id)} sx={{ color: '#D1D5DB' }}>
                  <Remove />
                </IconButton>
                <Typography variant="body1" sx={{ mx: 1, color: '#1F2937', fontWeight: 'bold' }}>
                  {item.quantity}
                </Typography>
                <IconButton onClick={() => handleIncrease(item.id)} sx={{ color: '#1F2937' }}>
                  <Add />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <Typography variant="h6" sx={{ mt: 4, fontWeight: 'bold', color: '#1F2937' }}>
            Total: ${calculateTotal()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default OrderHome;
