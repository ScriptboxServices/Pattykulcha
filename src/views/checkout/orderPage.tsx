'use client'

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Container, 
  Link,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const OrderPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState('pickup');

  const handleOptionChange = (event: React.MouseEvent<HTMLElement>, newOption: string) => {
    setSelectedOption(newOption);
  };

  return (
    <Box
      sx={{
        backgroundImage: `url('/images/checkout/checkout1.png')`, 
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper 
          sx={{ 
            p: 4, 
            backgroundColor: 'white',
            borderRadius: 4,
            boxShadow: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center'
          }}
        >
          <Box sx={{ width: { xs: '100%', md: '50%' }, mb: { xs: 4, md: 0 } }}>
            <Link href="#" underline="none" sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ArrowBackIcon sx={{ fontSize: 20, color: '#162548' }} />
              <Typography variant="body1" sx={{ ml: 1, fontWeight: 600, color: '#162548' }}>
                Back To Menu
              </Typography>
            </Link>
            
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: '#162548', mb: 3 }}>
              YOUR<br />ORDER
            </Typography>

            <ToggleButtonGroup
              value={selectedOption}
              exclusive
              onChange={handleOptionChange}
              sx={{ 
                mb: 3,
                '& .MuiToggleButton-root': {
                  borderRadius: 50,
                  px: 3,
                  py: 1,
                  border: 'none',
                  '&.Mui-selected': {
                    backgroundColor: '#F59E0B',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#F59E0B',
                    }
                  }
                }
              }}
            >
              <ToggleButton value="pickup">
                <StorefrontIcon sx={{ mr: 1 }} />
                Pick up
              </ToggleButton>
              <ToggleButton value="delivery">
                <LocalShippingIcon sx={{ mr: 1 }} />
                Delivery
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            {selectedOption === 'pickup' && (
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    From: Lorem ipsum dolor sit amet, consec...
                    <EditIcon sx={{ color: '#6B7280' }} />
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    Pick Up Type: Quick Pick Up
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Pick Up Time: 12 To 15 Minutes
                    <EditIcon sx={{ color: '#6B7280' }} />
                  </Typography>
                </Box>
              </Box>
            )}

            {selectedOption === 'delivery' && (
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Address: 123 Delivery St, Apt 4B
                    <EditIcon sx={{ color: '#6B7280' }} />
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    Delivery Time: 30 To 45 Minutes
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Special Instructions: Leave at the door.
                    <EditIcon sx={{ color: '#6B7280' }} />
                  </Typography>
                </Box>
              </Box>
            )}

            <Link href="#" underline="none">
              <Typography variant="body1" sx={{ color: '#162548', fontWeight: 600 }}>
                Make It A Group Order
              </Typography>
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default OrderPage;
