"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import MenuIcon from "@mui/icons-material/Menu";
import CustomPaginationActionsTable from "./orderlist";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

// Define the components for each tab
const Home = () => <Typography variant="h6">Home Component</Typography>;
const OrderDetail = () => <Typography variant="h6">Order Detail Component</Typography>;
const OrderList = () => <Typography variant="h6">Order List Component</Typography>;
const Profile = () => <Typography variant="h6">Profile Component</Typography>;
const Settings = () => <Typography variant="h6">Settings Component</Typography>;

export default function ResponsiveDrawer(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("Home");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerItems = [
    { text: "Home", icon: <HomeIcon />, component: <Home /> },
    { text: "Order Detail", icon: <AssignmentTurnedInIcon />, component: <OrderDetail /> },
    { text: "Order List", icon: <ListAltIcon />, component: <CustomPaginationActionsTable /> },
    { text: "Profile", icon: <PersonIcon />, component: <Profile /> },
    { text: "Settings", icon: <SettingsIcon />, component: <Settings /> },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {drawerItems.map((item, index) => (
          <ListItem disablePadding key={item.text}>
            <ListItemButton
              onClick={() => setActiveTab(item.text)}
              sx={{
                backgroundColor: activeTab === item.text ? "black" : "transparent",
                color: activeTab === item.text ? "white" : "inherit",
              }}
            >
              <ListItemIcon
                sx={{ color: activeTab === item.text ? "white" : "inherit" }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  const renderContent = () => {
    const activeItem = drawerItems.find((item) => item.text === activeTab);
    return activeItem?.component;
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
}
