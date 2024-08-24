"use client";

import React, { useEffect, useRef, useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";
import CustomPaginationActionsTable from "./orderlist";
import PaymentDetailsTable from "./paymentdetails";
import Image from "next/image";
import ViewOrders from "./ViewOrders";
import DashboardProfile from "./Profile";
import { useAuthContext } from "@/context";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { styled } from "@mui/material/styles";
import CircularLodar from "@/components/CircularLodar";
import KanbanBoard from "../kanban";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

const Home = () => <Typography variant='h6'>Home</Typography>;

// const Settings = () => <Typography variant='h6'>Settings Component</Typography>;

export default function ResponsiveDrawer(props: Props) {
  const { window } = props;
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Order Detail");
  const { user, kitchenMetaData } = useAuthContext();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const colRef = collection(db, "orders");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const audio = new Audio("/mp3/message.mp3");
          audio.play();
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onlineOfflineHandler = async (e:any) => {
    try{
      setLoading(true)
      const docRef = doc(db,'foodtrucks',kitchenMetaData?.id)
      await updateDoc(docRef,{
        isShopOpen : e.target.checked
      })
      setLoading(false)
    }catch(err){
      console.log(err);
      setLoading(false)
      return err
    }
  }

  const drawerItems = [
    // { text: "Home", icon: "/images/dashboard/home.png", component: <Home /> },
    {
      text: "Order Detail",
      icon: "/images/dashboard/orderdetail.png",
      component: <KanbanBoard />,
    },
    {
      text: "Order List",
      icon: "/images/dashboard/orderlist.png",
      component: <CustomPaginationActionsTable />,
    },
    {
      text: "Payment details",
      icon: "/images/dashboard/payment_details.png",
      component: <PaymentDetailsTable />,
    },
    {
      text: "Profile",
      icon: "/images/dashboard/profile.png",
      component: <DashboardProfile />,
    },
  ];

  const drawer = (
    <div>
      <List>
        {drawerItems.map((item, index) => (
          <ListItem disablePadding key={item.text} sx={{ marginTop: 4 }}>
            <ListItemButton
              onClick={() => setActiveTab(item.text)}
              sx={{
                backgroundColor:
                  activeTab == item.text ? "black" : "transparent",
                color: activeTab == item.text ? "white" : "inherit",
                "&:hover": {
                  backgroundColor:
                    activeTab == item.text ? "black" : "transparent", // Prevent hover background change
                  color: activeTab == item.text ? "white" : "inherit", // Prevent hover text color change
                },
              }}>
              <ListItemIcon
                sx={{
                  backgroundColor: activeTab == item.text ? "white" : "white",
                  minWidth: "auto",
                  color: activeTab == item.text ? "white" : "inherit",
                  borderRadius: "20%",
                  padding: "4px",
                  marginRight: "12px", // This adds space between the image and text
                }}>
                <Image
                  src={item.icon}
                  alt={`${item.text} icon`}
                  width={24}
                  height={24}
                />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window != undefined ? () => window().document.body : undefined;

  const renderContent = () => {
    const activeItem = drawerItems.find((item) => item.text == activeTab);
    return activeItem?.component;
  };

  return (
    <>
      <CircularLodar isLoading={loading} />    
      <Box sx={{ display: "flex", bgcolor: "white", height: "100vh" }}>
        <Box
          component='nav'
          sx={{
            width: { sm: drawerWidth },
            flexShrink: { sm: 0 },
            bgcolor: "white",
          }}
          aria-label='sidebar options'>
          <Drawer
            container={container}
            variant='temporary'
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                bgcolor: "white", // Sidebar background color for mobile view
              },
            }}>
            {drawer}
          </Drawer>
          <Drawer
            variant='permanent'
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                borderRight: "1px solid black",
                bgcolor: "white", // Sidebar background color for permanent drawer
              },
            }}
            open>
            {drawer}
          </Drawer>
        </Box>
        <Box
          component='main'
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            bgcolor: "white",
            pr: 0, // Remove or minimize the right padding
          }}>
          {renderContent()}
          <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: kitchenMetaData?.isShopOpen ? "#e0f7fa" : "#ffebee",
            padding: "8px 16px",
            borderRadius: "25px",
            width:'220px',
            boxShadow: 1,
            position:'absolute',
            right:20,
            top:20
          }}
        >
          <FormControlLabel
            control={
              <Switch
              value={kitchenMetaData?.isShopOpen}
              checked={kitchenMetaData?.isShopOpen}
              onChange={onlineOfflineHandler}
                color="primary"
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: kitchenMetaData?.isShopOpen ? "#4caf50" : "#f44336",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: kitchenMetaData?.isShopOpen ? "#4caf50" : "#f44336",
                  },
                }}
              />
            }
            label={
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: kitchenMetaData?.isShopOpen ? "#388e3c" : "#d32f2f",
                  fontSize: "1rem",
                }}
              >
                {kitchenMetaData?.isShopOpen ? "We are online" : "We are offline"}
              </Typography>
            }
            sx={{ margin: 0 }}
          />
        </Box>
        </Box>
      </Box>
    </>
  );
}
