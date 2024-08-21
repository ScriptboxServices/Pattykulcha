import React, { useEffect, useState } from "react";
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

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import NewOrders from "@/components/NewOrders";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuthContext } from "@/context";
import { db } from "@/firebase";
import OutForDelivery from "@/components/OutForDelivery";
import DeliveredOrder from "@/components/DeliveredOrder";

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

  const {user} = useAuthContext()
 
  const [value,setValue] = useState(1)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
      <Box sx={{ width: '100%',mb:4}}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          aria-label="secondary tabs example"
        >
          <Tab value={1} label="Today's New Orders" />
          <Tab value={2} label="Out for Delivery" />
          <Tab value={3} label="Delivered Orders" />
        </Tabs>
      </Box>

      {
        value === 1 && <NewOrders />
      }
      {
        value === 2 && <OutForDelivery />
      }
      {
        value === 3 && <DeliveredOrder />
      }
    </Box>
  );
};

export default ViewOrders;
