import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";

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
  const [isOnline, setIsOnline] = useState(true);

  const handleToggleChange = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setIsOnline(event.target.checked);
  };

  return (
    <Box sx={{ padding: 5, height: "auto", bgcolor: "white" }}>
      {/* Search and Title */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Order List
        </Typography>
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
