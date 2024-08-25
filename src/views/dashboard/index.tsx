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
  Button
} from "@mui/material";
import CustomPaginationActionsTable from "./orderlist";
import PaymentDetailsTable from "./paymentdetails";
import Image from "next/image";
import ViewOrders from "./ViewOrders";
import DashboardProfile from "./Profile";
import { useAuthContext } from "@/context";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { styled } from "@mui/material/styles";
import CircularLodar from "@/components/CircularLodar";
import KanbanBoard from "../kanban";
import MakeOrder from "./CreateOrder";
import Link from "next/link";
import { useRouter } from "next/navigation";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

const Home = () => <Typography variant="h6">Home</Typography>;

export default function ResponsiveDrawer(props: Props) {
  const { window } = props;
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Order Detail");
  const { user, kitchenMetaData } = useAuthContext();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if(kitchenMetaData?.userId !== user?.uid){
      return router.push('/home')
    }
  },[user,kitchenMetaData])

  const isFirstLoad = useRef(true);
  useEffect(() => {
    const colRef = collection(db, "orders");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        return;
      }
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

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("instructions");
    localStorage.removeItem("kulcha");
    localStorage.removeItem("includedItems2");
    router.push("/login");
  };

  const onlineOfflineHandler = async (e: any) => {
    try {
      setLoading(true);
      const docRef = doc(db, "foodtrucks", kitchenMetaData?.id);
      await updateDoc(docRef, {
        isShopOpen: e.target.checked,
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      return err;
    }
  };

  const drawerItems = [
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
    {
      text: "Make Order",
      icon: "/images/dashboard/profile.png",
      component: <MakeOrder />,
    },
  ];

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <List>
        <Link href="/home" passHref>
          <Image
            src="/images/logo.png"
            alt="logo"
            height={150}
            layout="fixed"
            width={170}
            priority
            style={{
              marginInline: "auto",
            }}
          />
        </Link>
        {drawerItems.map((item, index) => (
          <ListItem disablePadding key={item.text} sx={{ marginTop: 2 }}>
            <ListItemButton
              onClick={() => setActiveTab(item.text)}
              sx={{
                backgroundColor:
                  activeTab == item.text ? "black" : "transparent",
                color: activeTab == item.text ? "white" : "inherit",
                "&:hover": {
                  backgroundColor:
                    activeTab == item.text ? "black" : "transparent",
                  color: activeTab == item.text ? "white" : "inherit",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  backgroundColor: activeTab == item.text ? "white" : "white",
                  minWidth: "auto",
                  color: activeTab == item.text ? "white" : "inherit",
                  borderRadius: "20%",
                  padding: "4px",
                  marginRight: "12px",
                }}
              >
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
      <Box sx={{ flexGrow: 1 }} />{" "}
      {/* Filler space to push the button to the bottom */}
      
      <Box sx={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center'}}>

        <Button
          type="submit"
          variant="contained"
          onClick={() => router.push('/home')}
          sx={{
            width:'178px',
            backgroundColor: "#ECAB21",
            color: "white",
            fontSize:"12px",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#FFC107",
              color: "white",
            },
          }}
        >
          Switch to customer
        </Button>
        <Button
          type="submit"
          variant="contained"
          onClick={handleLogout}
          sx={{
            width:'178px',
            backgroundColor: "#ECAB21",
            color: "white",
            mb:4,
            mt:2,
            fontSize:"12px",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#FFC107",
              color: "white",
            },
          }}
        >
          Logout
        </Button>
      </Box>
      
    </Box>
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
          component="nav"
          sx={{
            width: { sm: drawerWidth },
            flexShrink: { sm: 0 },
            bgcolor: "white",
          }}
          aria-label="sidebar options"
        >
          <Drawer
            container={container}
            variant="temporary"
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
                bgcolor: "white",
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                borderRight: "1px solid black",
                bgcolor: "white",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            bgcolor: "white",
            pr: 0,
          }}
        >
          {renderContent()}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: kitchenMetaData?.isShopOpen
                ? "#e0f7fa"
                : "#ffebee",
              padding: "8px 16px",
              borderRadius: "25px",
              width: "220px",
              boxShadow: 1,
              position: "absolute",
              right: 20,
              top: 20,
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
                      color: kitchenMetaData?.isShopOpen
                        ? "#4caf50"
                        : "#f44336",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: kitchenMetaData?.isShopOpen
                        ? "#4caf50"
                        : "#f44336",
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
                  {kitchenMetaData?.isShopOpen
                    ? "We are online"
                    : "We are offline"}
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
