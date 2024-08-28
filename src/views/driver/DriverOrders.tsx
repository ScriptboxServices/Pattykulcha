"use client"
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Avatar,
  Button,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LockIcon from "@mui/icons-material/Lock";
import CircularLodar from "@/components/CircularLodar";

// Sample data array for orders
const orders = [
  {
    id: "ORD-1234",
    status: "Out For Delivery",
    location: "Ontario, Canada",
    estimatedArrival: "30 min",
    destination: "Toronto, Canada",
    kulcha: {
      name: "Paneer Kulcha",
      price: 15.99,
      quantity: 2,
      image: "/images/Img/5.jpg",
    },
    additional: [
      { items: [{ name: "Imli Chutney", quantity: 1, price: 1.5 }] },
      { items: [{ name: "Channa", quantity: 2, price: 1.5 }] },
    ],
  },
  {
    id: "ORD-5678",
    status: "Delivered",
    location: "Los Angeles, USA",
    estimatedArrival: "15 Aug 2024",
    destination: "Santa Monica, California",
    kulcha: {
      name: "Aloo Kulcha",
      price: 12.99,
      quantity: 1,
      image: "/images/Img/5.jpg",
    },
    additional: [
      { items: [{ name: "Normal Butter", quantity: 1, price: 0.5 }] },
      { items: [{ name: "Hot Coffee", quantity: 1, price: 3.5 }] },
    ],
  },
  {
    id: "ORD-91011",
    status: "Pending",
    location: "Chicago, USA",
    estimatedArrival: "N/A",
    destination: "Downtown, Chicago",
    kulcha: {
      name: "Mix Kulcha",
      price: 12.99,
      quantity: 3,
      image: "/images/Img/5.jpg",
    },
    additional: [],
  },
];

const DriverOrders = () => {
  const [loading, setLoading] = useState(false);
  const [myOrders, setMyOrders] = useState(orders);

  const calculateGrandTotal = (order) => {
    const kulchaTotal = order.kulcha.price * order.kulcha.quantity;
    const additionalTotal = order.additional.reduce(
      (sum, item) => sum + item.items[0].price * item.items[0].quantity,
      0
    );
    return kulchaTotal + additionalTotal;
  };

  const updateOrderStatus = (orderId) => {
    setMyOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status:
                order.status === "Out For Delivery"
                  ? "Delivered"
                  : order.status === "Pending"
                  ? "Out For Delivery"
                  : order.status,
            }
          : order
      )
    );
  };

  return (
    <>
      <CircularLodar isLoading={loading} />
      <Box
        sx={{
          backgroundColor: "#fffaeb",
          minHeight: "100vh",
          padding: 4,
          display: "flex",
          justifyContent: "center",
          overflowY: "auto",
        }}
      >
        <Box sx={{ maxWidth: "600px", width: "100%" }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{ color: "#333333", fontWeight: "bold", textAlign: "center", mb: 1.75 }}
          >
            Orders for Delivery
          </Typography>
          {myOrders.map((order) => (
            <Paper
              key={order.id}
              sx={{
                padding: 2,
                borderRadius: 2,
                marginBottom: 3,
                position: "relative",
                boxShadow: 3,
                minHeight: "150px",
                width: "100%",
              }}
            >
              <OrderStatusChip status={order.status} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <LockIcon sx={{ marginRight: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {order.id}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: { xs: "flex-start", sm: "center" },
                  marginBottom: 2,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <LocationOnIcon sx={{ marginRight: 1, display: { xs: "none", sm: "block" } }} />
                <Typography variant="body2" sx={{ marginRight: 1 }}>
                  {order.location || "Location not set"}
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ marginX: 1 }} />
                <Typography variant="body2" sx={{ marginRight: 1 }}>
                  Estimated arrival: {order.estimatedArrival}
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ marginX: 1 }} />
                <Typography variant="body2">
                  {order.destination}
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                  <Avatar
                    variant="square"
                    src={order.kulcha.image}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      marginRight: 2,
                    }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {order.kulcha.name}
                    </Typography>
                    <Typography variant="body2">
                      ${order.kulcha.price} x{order.kulcha.quantity}
                    </Typography>
                  </Box>
                </Grid>
                {order.additional.length !== 0 && (
                  <Grid item xs={12} sx={{ marginTop: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", marginBottom: 1 }}
                    >
                      Additional Items:
                    </Typography>
                    {order.additional.map((item, itemIndex) => (
                      <Typography
                        key={itemIndex}
                        variant="body2"
                        sx={{ display: "inline", marginRight: 2 }}
                      >
                        {item.items[0].name} ({item.items[0].quantity})
                      </Typography>
                    ))}
                  </Grid>
                )}
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", marginBottom: 1 }}
                >
                  Billing Address:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Address: {order.location}
                </Typography>
              </Box>
              <Divider sx={{ marginY: 2 }} />
              <Typography variant="body2" fontWeight="bold" textAlign="right">
                Total: ${calculateGrandTotal(order).toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="warning"
                sx={{ position: "absolute", bottom: 16, left: 16 }}
                onClick={() => updateOrderStatus(order.id)}
              >
                Update Status
              </Button>
            </Paper>
          ))}
        </Box>
      </Box>
    </>
  );
};

// Custom Order Status Chip Component
const OrderStatusChip = ({ status }) => {
  const statusColors = {
    "Out For Delivery": "#FFAB00",
    Delivered: "#4CAF50",
    Pending: "#F44336",
  };

  return (
    <Chip
      label={status}
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        backgroundColor: statusColors[status],
        color: "#fff",
      }}
    />
  );
};

export default DriverOrders;
