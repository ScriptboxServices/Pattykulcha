"use client";

import React, { useEffect, useRef, useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Button,
  IconButton,
  Slider,
  styled,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import CustomPaginationActionsTable from "./orderlist";
import PaymentDetailsTable from "./paymentdetails";
import Image from "next/image";
import DashboardProfile from "./Profile";
import { useAuthContext } from "@/context";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import CircularLodar from "@/components/CircularLodar";
import KanbanBoard from "../kanban";
import MakeOrder from "./CreateOrder";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ContactUsection from "./ContactUsSection";
import DriversMap from "./DriverLocation";
import PastOrders from "./PastOrders";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

const IncreaseDistanceSlider = styled(Slider)({
  color: "#52af77",
  padding: 0,
  height: 12,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 25,
    width: 25,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#52af77",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&::before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

export default function ResponsiveDrawer(props: Props) {
  const { window:WindowProp } = props;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, kitchenProfile } = useAuthContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [distance, setDistance] = useState(kitchenProfile?.orderRange || 0);
  const [activeTab, setActiveTab] = useState("Order Detail");
  const [menuExpanded, setMenuExpanded] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleMenu = () => {
    setMenuExpanded(!menuExpanded);
  };
  console.log("object");
  useEffect(() => {
    // if (kitchenProfile?.userId !== user?.uid) {
    //   return router.push('/home')
    // }
  }, [user, kitchenProfile]);

  const isFirstLoad = useRef(true);
  const isFirstLoadComplaint = useRef(true);
  useEffect(() => {
    const orderRef = collection(db, "orders");
    const contactref = collection(db,"contactus")
    const unsubscribeOrder = onSnapshot(orderRef, (snapshot) => {
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

    const unsubscribeContact = onSnapshot(contactref, (snapshot) => {
      if (isFirstLoadComplaint.current) {
        isFirstLoadComplaint.current = false;
        return;
      }
      snapshot.docChanges().forEach((change) => {
        console.log(change.doc.data(),"Abhishek");
        if(change.type === 'added'){
          if (typeof window !== "undefined" && window.speechSynthesis) {
            const message = `You have received a new complaint from ${change.doc.data().customer?.name}`;
            const utterance = new SpeechSynthesisUtterance(message);
            const voices = speechSynthesis.getVoices();
            utterance.voice = voices[6];
            speechSynthesis.speak(utterance);
          }
        }
      })
    })

    return () => {
      unsubscribeOrder();
      unsubscribeContact()
    };
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("instructions");
      localStorage.removeItem("kulcha");
      localStorage.removeItem("includedItems2");
      localStorage.removeItem("otherKulchas");
      router.push("/login");
    } catch (err) {
      console.log(err);
      router.push("/login");
    }
  };

  const onlineOfflineHandler = async (e: any) => {
    try {
      setLoading(true);
      const docRef = doc(db, "foodtrucks", kitchenProfile?.id);
      await updateDoc(docRef, {
        isShopOpen: e.target.checked,
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const drawerItems = [
    {
      text: "Order Detail",
      icon: "/images/dashboard/orderdetail.png",
      component: <KanbanBoard />,
    },
    {
      text: "Contact Us",
      icon: "/images/dashboard/Contactus.svg",
      component: <ContactUsection />,
    },
    // {
    //   text: "Order List",
    //   icon: "/images/dashboard/orderlist.png",
    //   component: <CustomPaginationActionsTable />,
    // },
    // {
    //   text: "Payment details",
    //   icon: "/images/dashboard/payment_details.png",
    //   component: <PaymentDetailsTable />,
    // },
    // {
    //   text: "Profile",
    //   icon: "/images/dashboard/profile.png",
    //   component: <DashboardProfile />,
    // },
    {
      text: "Driver's location",
      icon: "/images/dashboard/DriverLocation.svg",
      component: <DriversMap/>,
    },
    {
      text: "Make Order",
      icon: "/images/dashboard/Makeorder.svg",
      component: <MakeOrder />,
    },
    {
      text: "User search",
      icon: "/images/dashboard/UserSearch.svg",
      component: <PastOrders/>,
    },
  ];

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {menuExpanded && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
          }}
        >
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
          <IconButton onClick={toggleMenu}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
      )}
      <List>
        {drawerItems.map((item, index) => (
          <ListItem disablePadding key={item.text} sx={{ marginTop: 2 }}>
            <ListItemButton
              onClick={() => setActiveTab(item.text)}
              sx={{
                justifyContent: "center",
                backgroundColor:
                  activeTab === item.text ? "#ECAB21" : "transparent",
                color: activeTab === item.text ? "white" : "inherit",
                "&:hover": {
                  backgroundColor:
                    activeTab === item.text ? "#FFC107" : "transparent",
                  color: activeTab === item.text ? "white" : "inherit",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  backgroundColor: activeTab === item.text ? "white" : "white",
                  minWidth: "auto",
                  color: activeTab === item.text ? "white" : "inherit",
                  borderRadius: "20%",
                  padding: "4px",
                  marginRight: menuExpanded ? "12px" : "0",
                }}
              >
                <Image
                  src={item.icon}
                  alt={`${item.text} icon`}
                  width={24}
                  height={24}
                />
              </ListItemIcon>
              {menuExpanded && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          startIcon={!menuExpanded ? <PersonIcon /> : null}
          onClick={() => router.push("/home")}
          sx={{
            width: menuExpanded ? "178px" : "50px",
            minWidth: menuExpanded ? "178px" : "50px",
            justifyContent: menuExpanded ? "center" : "center",
            backgroundColor: "#ECAB21",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius:"15px",
            "&:hover": {
              backgroundColor: "#FFC107",
              color: "white",
            },
            paddingLeft: menuExpanded ? "16px" : 0,
            paddingRight: menuExpanded ? "16px" : 0,
          }}
        >
          {menuExpanded && "Switch to customer"}
        </Button>
        <Button
          type="submit"
          variant="contained"
          startIcon={!menuExpanded ? <LogoutIcon /> : null}
          onClick={handleLogout}
          sx={{
            width: menuExpanded ? "178px" : "50px",
            minWidth: menuExpanded ? "178px" : "50px",
            justifyContent: menuExpanded ? "center" : "center",
            backgroundColor: "#ECAB21",
            color: "white",
            mb: 4,
            mt: 2,
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius:"15px",
            "&:hover": {
              backgroundColor: "#FFC107",
              color: "white",
            },
            paddingLeft: menuExpanded ? "16px" : 0,
            paddingRight: menuExpanded ? "16px" : 0,
          }}
        >
          {menuExpanded && "Logout"}
        </Button>
      </Box>
    </Box>
  );

  const container =
    WindowProp !== undefined ? () => WindowProp?.().document.body : undefined;

  const renderContent = () => {
    const activeItem = drawerItems.find((item) => item.text === activeTab);
    return activeItem?.component;
  };

  const distanceHandler = async (e: any) => {
    try {
      setLoading(true);
      const docRef = doc(db, "foodtrucks", kitchenProfile?.id);
      await updateDoc(docRef, {
        orderRange: distance,
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const marks = [
    {
      value: 0,
      label: "0 Km",
    },
    {
      value: 20,
      label: "20 Km",
    },
    {
      value: 50,
      label: "50 Km",
    },
    {
      value: 100,
      label: "100 Km",
    },
  ];

  return (
    <>
      <CircularLodar isLoading={loading} />
      <Box sx={{ display: "flex", bgcolor: "white", height: "100vh" }}>
        <Box
          component="nav"
          sx={{
            width: menuExpanded ? { sm: drawerWidth } : { sm: 80 },
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
                width: menuExpanded ? drawerWidth : 80,
                borderRight: "1px solid black",
                bgcolor: "white",
              },
            }}
            open
          >
            {!menuExpanded && (
              <Box sx={{ padding: "8px", mt: 2, textAlign: "center" }}>
                <IconButton onClick={toggleMenu}>
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            width: { sm: `calc(100% - ${menuExpanded ? drawerWidth : 80}px)` },
            bgcolor: "white",
            pr: 0,
          }}
        >
          {renderContent()}
          <Box
            sx={{
              position: "absolute",
              right: 20,
              top: 45,
              display: "flex",
              gap: "2rem",
              alignItems: "end",
            }}
          >
            <Box sx={{ width: "220px" }}>
              <IncreaseDistanceSlider
                onChange={(e: any) => setDistance(Number(e.target.value))}
                onMouseUp={distanceHandler}
                key={kitchenProfile?.orderRange}
                valueLabelDisplay="on"
                aria-label="distance slider"
                defaultValue={Number(kitchenProfile?.orderRange)}
                marks={marks}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: kitchenProfile?.isShopOpen
                  ? "#e0f7fa"
                  : "#ffebee",
                padding: "8px 16px",
                borderRadius: "25px",
                width: "160px",
                boxShadow: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    value={kitchenProfile?.isShopOpen}
                    checked={kitchenProfile?.isShopOpen}
                    onChange={onlineOfflineHandler}
                    color="primary"
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: kitchenProfile?.isShopOpen
                          ? "#4caf50"
                          : "#f44336",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: kitchenProfile?.isShopOpen
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
                      color: kitchenProfile?.isShopOpen
                        ? "#388e3c"
                        : "#d32f2f",
                      fontSize: "1rem",
                    }}
                  >
                    {kitchenProfile?.isShopOpen ? "Online" : "Offline"}
                  </Typography>
                }
                sx={{ margin: 0 }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
