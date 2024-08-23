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
