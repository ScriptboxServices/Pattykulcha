'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Grid,
  Box,
  Collapse,
  IconButton,
} from '@mui/material';
import { Person, Phone, Home, ShoppingCart, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useMenuContext } from '@/context';

interface Order {
  id: string;
  items: Array<{ name: string; price: number }>;
  total: number;
  date: string;
  delivered: boolean;
}

const ProfilePage: React.FC = () => {
  const { total } = useMenuContext();

  // Dummy profile data
  const dummyProfile = {
    name: 'John Doe',
    phone: '123-456-7890',
    address: '123 Main St, City, Country',
  };

  // Dummy order data
  const dummyOrders: Order[] = [
    {
      id: '001',
      items: [
        { name: 'Amritsari Kulcha', price: 8.0 },
        { name: 'Coke', price: 3.0 },
      ],
      total: 11.0,
      date: '2023-08-01',
      delivered: true,
    },
    {
      id: '002',
      items: [
        { name: 'Masala Tea', price: 3.5 },
        { name: 'Salted Lassi', price: 5.5 },
      ],
      total: 9.0,
      date: '2023-08-05',
      delivered: false,
    },
  ];

  const [name, setName] = useState(dummyProfile.name);
  const [phone, setPhone] = useState(dummyProfile.phone);
  const [address, setAddress] = useState(dummyProfile.address);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    const parsedOrders = storedOrders ? JSON.parse(storedOrders) : dummyOrders;

    setOrders(parsedOrders);

    // Expand non-delivered orders by default
    const nonDeliveredOrderIds = parsedOrders
      .filter((order: Order) => !order.delivered)
      .map((order: Order) => order.id);
    
    setExpandedOrderIds(nonDeliveredOrderIds);
  }, []);

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleAddressSave = () => {
    alert('Address updated successfully!');
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4, pb: 4, background: '#FAF3E0' }}>
      <Grid container spacing={4} maxWidth="md">
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
                  <Person fontSize="large" />
                </Avatar>
                <Typography variant="h5" component="h2" gutterBottom>
                  User Profile
                </Typography>
              </Box>
              <List>
                <ListItem>
                  <Person />
                  <ListItemText primary="Name" secondary={name} sx={{ ml: 2 }} />
                </ListItem>
                <ListItem>
                  <Phone />
                  <ListItemText primary="Phone" secondary={phone} sx={{ ml: 2 }} />
                </ListItem>
                <ListItem>
                  <Home />
                  <ListItemText primary="Address" sx={{ ml: 2 }} />
                </ListItem>
              </List>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={address}
                onChange={handleAddressChange}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Button variant="contained" onClick={handleAddressSave}>
                Update Address
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" component="h3" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ShoppingCart sx={{ mr: 1 }} />
            My Orders
          </Typography>
          <Grid container spacing={2}>
            {orders.map((order) => (
              <Grid item xs={12} key={order.id}>
                <Card
                  sx={{
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    transform: expandedOrderIds.includes(order.id) ? 'scale(1.03)' : 'none',
                    boxShadow: expandedOrderIds.includes(order.id)
                      ? '0 8px 30px rgba(0, 0, 0, 0.2)'
                      : 'none',
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleOrderExpand(order.id)}
                    >
                      <Typography variant="body1" component="div" color="text.primary">
                        Order #{order.id}
                      </Typography>
                      <IconButton>
                        {expandedOrderIds.includes(order.id) ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>
                    <Collapse in={expandedOrderIds.includes(order.id)} timeout="auto" unmountOnExit>
                      <Typography variant="body2" component="div" color="text.secondary">
                        Date: {order.date}
                      </Typography>
                      <List>
                        {order.items.map((item) => (
                          <ListItem key={item.name} sx={{ paddingLeft: 0 }}>
                            <ListItemText
                              primary={item.name}
                              secondary={`$${item.price.toFixed(2)}`}
                              sx={{ display: 'block' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                      <Typography variant="body2" component="div" color="text.primary">
                        Total: ${order.total.toFixed(2)}
                      </Typography>
                      {!order.delivered && (
                        <Typography
                          variant="body2"
                          component="div"
                          color="error"
                          sx={{ fontWeight: 'bold', mt: 1 }}
                        >
                          Not Delivered
                        </Typography>
                      )}
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {orders.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  No orders found.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;