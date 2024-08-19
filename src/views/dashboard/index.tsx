"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import CustomPaginationActionsTable from "./orderlist";
import PaymentDetailsTable from "./paymentdetails";
import Image from 'next/image';
import ViewOrders from "./ViewOrders";
import DashboardProfile from "./Profile";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

const Home = () => <Typography variant="h6">Home Component</Typography>;

const Settings = () => <Typography variant="h6">Settings Component</Typography>;

export default function ResponsiveDrawer(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("Home");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerItems = [
    { text: "Home", icon: '/images/dashboard/home.png', component: <Home /> },
    {
      text: "Order Detail",
      icon: '/images/dashboard/orderdetail.png',
      component:<ViewOrders />,
    },
    {
      text: "Order List",
      icon: '/images/dashboard/orderlist.png',
      component: <CustomPaginationActionsTable />,
    },
    {
      text: "Payment details",
      icon: '/images/dashboard/payment_details.png',
      component: <PaymentDetailsTable />,
    },
    { text: "Profile", icon: '/images/dashboard/profile.png', component: <DashboardProfile /> },
    { text: "Settings", icon: '/images/dashboard/setting.png', component: <Settings /> },
  ];

  const drawer = (
    <div>
      <List>
        {drawerItems.map((item, index) => (
          <ListItem disablePadding key={item.text} sx={{ marginTop: 4 }}>
            <ListItemButton
              onClick={() => setActiveTab(item.text)}
              sx={{
                backgroundColor: activeTab == item.text ? "black" : "transparent",
                color: activeTab == item.text ? "white" : "inherit",
                "&:hover": {
                  backgroundColor: activeTab == item.text ? "black" : "transparent", // Prevent hover background change
                  color: activeTab == item.text ? "white" : "inherit", // Prevent hover text color change
                },
              }}
            >
              <ListItemIcon
                sx={{
                  backgroundColor: activeTab == item.text ? "white" : "white",
                  minWidth: "auto",
                  color: activeTab == item.text ? "white" : "inherit",
                  borderRadius: '20%',
                  padding: '4px',
                  marginRight: '12px', // This adds space between the image and text
                }}
              >
                <Image src={item.icon} alt={`${item.text} icon`} width={24} height={24} />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const renderContent = () => {
    const activeItem = drawerItems.find((item) => item.text == activeTab);
    return activeItem?.component;
  };

  return (
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
              bgcolor: "white", // Sidebar background color for mobile view
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
              bgcolor: "white", // Sidebar background color for permanent drawer
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
          paddingRight: 0, // Remove or minimize the right padding
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}
