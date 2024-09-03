"use client";

import React, { useState, ChangeEvent } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import CircularLodar from "@/components/CircularLodar";
import Link from "next/link";
import CancelIcon from "@mui/icons-material/Cancel";

// Define the types for order and additional items
interface AdditionalItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  location: string;
  phoneno: string;
  name: string;
  kulcha: {
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
  additional: { items: AdditionalItem[] }[];
}

const orders: Order[] = [
  {
    id: "ORD-1234",
    status: "Out For Delivery",
    location: "Ontario, Canada",
    phoneno: "1234567890",
    name: "Harman",
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
    phoneno: "1234567890",
    name: "Arshdeep",
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
    phoneno: "1234567890",
    name: "Adarsh",
    kulcha: {
      name: "Mix Kulcha",
      price: 12.99,
      quantity: 3,
      image: "/images/Img/5.jpg",
    },
    additional: [],
  },
];

const DriverOrders: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [invoiceImage, setInvoiceImage] = useState<string>("/images/image.png");
  const [myOrders, setMyOrders] = useState<Order[]>(orders);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  // Function to handle status change
  const handleStatusChange = (
    event: ChangeEvent<{ value: unknown }>,
    orderId: string
  ) => {
    const newStatus = event.target.value as string;
    setMyOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setEditingOrderId(null); // Switch back to displaying the chip
  };

  // Function to filter orders by status
  const handleFilterChange = (event: ChangeEvent<{ value: unknown }>) => {
    setFilterStatus(event.target.value as string);
  };

  const filteredOrders = myOrders.filter(
    (order) => filterStatus === "All" || order.status === filterStatus
  );

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
            sx={{
              color: "#333333",
              fontWeight: "bold",
              textAlign: "center",
              mb: 1.75,
            }}
          >
            Today Orders
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={handleFilterChange as any}
              label="Filter by Status"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Out For Delivery">Out For Delivery</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Canceled">Canceled</MenuItem>
            </Select>
          </FormControl>

          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
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
                {editingOrderId === order.id ? (
                  <FormControl
                    variant="outlined"
                    sx={{
                      position: "absolute",
                      top: 14,
                      right: 16,
                      minWidth: 120,
                      // Add responsive styling
                      "@media (max-width:600px)": {
                        minWidth: 80, // Reduce the width on small screens
                      },
                    }}
                  >
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      value={order.status}
                      sx={{
                        height:{xs:"30px"},
                        width:{xs:"125px"},
                      }}
                      onChange={(event) =>
                        handleStatusChange(
                          event as ChangeEvent<{ value: unknown }>,
                          order.id
                        )
                      }
                    >
                      <MenuItem value="Out For Delivery">
                        Out For Delivery
                      </MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                      <MenuItem value="Canceled">Canceled</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <Chip
                    label={order.status}
                    onClick={() => setEditingOrderId(order.id)}
                    sx={{
                      position: "absolute",
                      top: 14,
                      right: 16,
                      backgroundColor: getStatusColor(order.status),
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  />
                )}

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
                        ${order.kulcha.price.toFixed(2)} x
                        {order.kulcha.quantity}
                      </Typography>
                    </Box>
                  </Grid>
                  {order.additional?.length > 0 && (
                    <Grid item xs={12} sx={{ marginTop: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "bold", marginBottom: 0 }}
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

                <Typography
                  variant="body2"
                  fontWeight="bold"
                  textAlign="right"
                  sx={{ mt: -2 }}
                >
                  Total: $
                  {(
                    order.kulcha.price * order.kulcha.quantity +
                    order.additional.reduce(
                      (acc, add) =>
                        acc +
                        add.items.reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        ),
                      0
                    )
                  ).toFixed(2)}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="body2" color="textSecondary">
                    <b style={{ color: "black" }}>Customer Name:</b>{" "}
                    {order.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <b style={{ color: "black" }}>Phone Number:</b>{" "}
                    {order.phoneno}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <b style={{ color: "black" }}>Address:</b> {order.location}
                  </Typography>
                </Box>
                <Divider sx={{ marginY: 1 }} />
              </Paper>
            ))
          ) : (
            <Box
              sx={{
                padding: 4,
                textAlign: "center",
                alignItems: "center",
                height: "50vh",
                display: "flex",
              }}
            >
              <Paper
                sx={{
                  width: "100%",
                  padding: "24px",
                  backgroundColor: "#FFFFFF",
                  textAlign: "center",
                  margin: "0 auto",
                  maxWidth: "400px",
                  borderRadius: "12px",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  No orders yet
                </Typography>
                <Link href="/home">
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      backgroundColor: "#ECAB21",
                      color: "white",
                      borderRadius: 20,
                      paddingX: 4,
                      paddingY: 1,
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "#FFC107",
                        color: "white",
                      },
                    }}
                  >
                    ORDER NOW
                  </Button>
                </Link>
              </Paper>
            </Box>
          )}
        </Box>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <DialogTitle>Invoice</DialogTitle>
          <IconButton onClick={() => setOpen(false)}>
            <CancelIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <Box sx={{ textAlign: "center", overflow: "hidden" }}>
            <img
              src={invoiceImage}
              alt="Invoice"
              style={{ maxWidth: "85%", height: "490px", marginInline: "auto" }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => console.log("Download Invoice")}>
            Download invoice
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    "Out For Delivery": "#FFAB00",
    Delivered: "#4CAF50",
    Canceled: "#F44336",
    "New Order": "#FFAB00",
    Refunded: "#1E90FF",
  };
  return statusColors[status] || "#FFAB00";
};

export default DriverOrders;
