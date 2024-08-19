import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  TextField,
  Avatar,
  Divider,
  Chip,
  IconButton,
} from "@mui/material";
import { Visibility } from "@mui/icons-material"; // Importing the eye icon

const orders = [
  {
    orderId: "#351",
    date: "05 Feb 2023, 08:28 PM",
    items: [
      {
        name: "Amritsari Kulcha",
        price: "$5.30",
        addons: "Add-ons: Coke, Extra Chutney",
        quantity: 1,
      },
      { name: "Mushroom kulcha", price: "$5.30", addons: "", quantity: 1 },
    ],
    status: "Pending",
  },
  {
    orderId: "#352",
    date: "05 Feb 2023, 08:28 PM",
    items: [
      {
        name: "Aloo Cheese Kulcha",
        price: "$5.30",
        addons: "Add-ons: Extra Chutney",
        quantity: 1,
      },
      { name: "Gobi kulcha", price: "$5.30", addons: "", quantity: 1 },
    ],
    status: "Delivered",
  },
  {
    orderId: "#353",
    date: "05 Feb 2023, 08:28 PM",
    items: [
      {
        name: "Aloo Kulcha",
        price: "$7.30",
        addons: "Add-ons: Caffe Latte, Amul Butter",
        quantity: 1,
      },
    ],
    status: "Pending",
  },
  {
    orderId: "#354",
    date: "05 Feb 2023, 08:28 PM",
    items: [
      {
        name: "Paneer Kulcha",
        price: "$7.30",
        addons: "Add-ons: Tea, Amul Butter",
        quantity: 1,
      },
    ],
    status: "Pending",
  },
  {
    orderId: "#355",
    date: "05 Feb 2023, 08:28 PM",
    items: [
      {
        name: "Patty Kulcha",
        price: "$5.30",
        addons: "Add-ons: Extra Chutney",
        quantity: 1,
      },
      {
        name: "Mix kulcha",
        price: "$6.30",
        addons: "Add-ons: Dollar Channa, Extra Chutney",
        quantity: 1,
      },
    ],
    status: "Delivered",
  },
  {
    orderId: "#356",
    date: "05 Feb 2023, 08:28 PM",
    items: [
      {
        name: "Corn Kulcha",
        price: "$5.30",
        addons: "Add-ons: Lassi, Extra Chutney",
        quantity: 1,
      },
      {
        name: "Mix kulcha",
        price: "$5.30",
        addons: "Add-ons: Dollar Channa",
        quantity: 1,
      },
    ],
    status: "Delivered",
  },
];

const ViewOrders = () => {
  return (
    <Box sx={{ padding: 5, height: "auto", bgcolor: "white" }}>
      {/* Search and Title */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Order List
        </Typography>
        <TextField
          label="Search"
          variant="outlined"
          sx={{
            width: "40%",
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px", // Rounded corners for the input box
              backgroundColor: "#fff", // Light background color
              "&:hover fieldset": {
                borderColor: "#4CAF50", // Green border on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "#4CAF50", // Green border when focused
              },
            },
            "& .MuiInputLabel-root": {
              color: "#888", // Label color
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#4CAF50", // Label color when focused
            },
            "& .MuiOutlinedInput-input": {
              padding: "10px 40px",
              paddingLeft:"70px" // Extra padding inside the input box
            },
          }}
        />
      </Box>

      {/* Status Filters */}
      <Box sx={{ display: "flex", justifyContent: "start", mb: 3 }}>
        <Chip label="#346" variant="outlined" color="success" sx={{ mx: 1 }} />
        <Chip label="#347" variant="outlined" color="error" sx={{ mx: 1 }} />
        <Chip label="#348" variant="outlined" color="success" sx={{ mx: 1 }} />
        {/* Add more status chips as needed */}
      </Box>

      {/* Orders Grid */}
      <Grid container spacing={3}>
        {orders.map((order, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={index}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Card
              sx={{
                width: 380,
                minHeight: 280,
                borderRadius: 2,
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 2,
              }}
            >
              <CardContent sx={{ padding: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      Order {order.orderId}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {order.date}
                    </Typography>
                  </Box>
                  {/* View More Details Icon */}
                  <IconButton size="small">
                    <Visibility />
                  </IconButton>
                </Box>

                {order.items.map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{ display: "flex", alignItems: "center", mt: 2 }}
                  >
                    <Avatar
                      src={"/images/landingpage/menu1.png"}
                      sx={{ width: 50, height: 50, mr: 2 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1">{item.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.addons}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="body1">{item.price}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Qty: {item.quantity}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
              <Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    px: 2,
                    pb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    X{order.items.length} Items
                  </Typography>
                  <Chip
                    label={order.status}
                    color={order.status == "Delivered" ? "success" : "warning"}
                    sx={{ borderRadius: "50px", textTransform: "none" }}
                  />
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ViewOrders;
