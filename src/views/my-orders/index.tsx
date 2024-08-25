"use client";

import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Avatar,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LockIcon from "@mui/icons-material/Lock";
import { useAuthContext } from "@/context";
import { collection } from "firebase/firestore";
import { db } from "@/firebase";

// Sample data array for orders
const orders = [
  {
    id: "ORD-1234",
    status: "Out for Delivery",
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
    status: "Canceled",
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


const OrdersPage: React.FC = () => {

  const {user,metaData,kitchenMetaData} = useAuthContext()

  useEffect(() => {
  
    const colRef = collection(db,'orders',)


  },[user,kitchenMetaData])
  const calculateGrandTotal = (order: any) => {
    const kulchaTotal = order.kulcha.price * order.kulcha.quantity;
    const additionalTotal = order.additional.reduce(
      (sum: number, item: any) =>
        sum + item.items[0].price * item.items[0].quantity,
      0
    );
    return kulchaTotal + additionalTotal;
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fffaeb",
        minHeight: "100vh",
        padding: 4,
        display: "flex",
        justifyContent: "center",
        overflowY: "auto", // Make the container scrollable
      }}
    >
      <Box sx={{ maxWidth: "600px", width: "100%" }}>
        {" "}
        {/* Reduced the width */}
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Orders
        </Typography>
        {/* Render Order Cards */}
        {orders.map((order) => (
          <Paper
            key={order.id}
            sx={{
              padding: 2,
              borderRadius: 2,
              marginBottom: 3,
              position: "relative",
              boxShadow: 3,
              minHeight: "150px", // Set minimum height
              width: "100%", // Set width of the cards
            }}
          >
            <OrderStatusChip status={order.status} />
            <Box
              sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
            >
              <LockIcon sx={{ marginRight: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {order.id}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
            >
              <LocationOnIcon sx={{ marginRight: 1 }} />
              <Typography variant="body2" sx={{ marginRight: 1 }}>
                {order.location || "Location not set"}
              </Typography>
              <Divider orientation="vertical" flexItem sx={{ marginX: 1 }} />
              <Typography variant="body2" sx={{ marginRight: 1 }}>
                Estimated arrival: {order.estimatedArrival || "N/A"}
              </Typography>
              <Divider orientation="vertical" flexItem sx={{ marginX: 1 }} />
              <Typography variant="body2">
                {order.destination || "N/A"}
              </Typography>
            </Box>
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
              <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                <Avatar
                  variant="square"
                  src={order.kulcha.image || "/path-to-placeholder.jpg"}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    marginRight: 2,
                  }}
                />
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {order.kulcha.name || "Kulcha"}
                  </Typography>
                  <Typography variant="body2">
                    {order.kulcha.price} x{order.kulcha.quantity}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ marginTop: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", marginBottom: 1 }}
                >
                  Additional Items:
                </Typography>
                {order.additional.map((item: any, itemIndex: number) => (
                  <Typography
                    key={itemIndex}
                    variant="body2"
                    sx={{ display: "inline", marginRight: 2 }}
                  >
                    {item.items[0].name} ({item.items[0].quantity})
                  </Typography>
                ))}
              </Grid>
            </Grid>
            <Divider sx={{ marginY: 2 }} />
            <Typography variant="body2" fontWeight="bold" textAlign="right">
              Total: {calculateGrandTotal(order).toFixed(3)}{" "}
              {/* Total for this specific order with 3 decimal places */}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

// Custom Order Status Chip Component
const OrderStatusChip: React.FC<{ status: string }> = ({ status }) => {
  const statusColors = {
    "Out for Delivery": "#FFAB00",
    Delivered: "#4CAF50",
    Canceled: "#F44336",
  };

  return (
    <Chip
      label={status}
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        backgroundColor:
          statusColors[status as "Out for Delivery" | "Delivered" | "Canceled"],
        color: "#fff",
      }}
    />
  );
};

export default OrdersPage;
