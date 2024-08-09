"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  styled,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useMenuContext } from "@/context";

const StyledAppBar = styled(AppBar)({
  backgroundColor: "white",
});

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  color: "black",
});

const NavButton = styled(Button)({
  color: "black",
  textTransform: "none",
  margin: "0 8px",
});

const LocationButton = styled(Button)({
  backgroundColor: "white",
  color: "black",
  borderRadius: "20px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
});

const OrderButton = styled(Button)({
  backgroundColor: "#f39c12",
  color: "white",
  "&:hover": {
    backgroundColor: "#e67e22",
  },
});

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count } = useMenuContext(); // Fetch count from context

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        LOGO
      </Typography>
      <Divider />
      <List>
        {["Menu", "About"].map((text) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button>
          <Link href="/createaccount" passHref>
            <Button
              sx={{ textTransform: "none", color: "black", width: "100%" }}
            >
              Sign Up
            </Button>
          </Link>
        </ListItem>
        <ListItem button>
          <Link href="/login" passHref>
            <Button
              sx={{ textTransform: "none", color: "black", width: "100%" }}
            >
              Log In
            </Button>
          </Link>
        </ListItem>
        <ListItem button>
          <Link href="/cart" passHref>
            <OrderButton fullWidth>Order Now</OrderButton>
          </Link>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="static">
        <StyledToolbar>
          <Typography
            sx={{
              color: "#333333", // Adjust the color to match your site design
              fontWeight: "bold",
            }}
          >
            PATTYKULCHA
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "left",
            }}
          >
            <Link href="/home" passHref>
              <NavButton>Menu</NavButton>
            </Link>
            <Link href="/about-us" passHref>
              <NavButton>About</NavButton>
            </Link>
          </Box>
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            <Link href="/checkout">
            <IconButton
              edge="end"
              color="inherit"
              aria-label="cart"
              sx={{ ml: 2 }}
            >
              <Badge
                badgeContent={count > 0 ? count : undefined}
                color="error"
                invisible={count === 0}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            </Link>
            <Link href="/createaccount" passHref>
              <NavButton>Sign Up</NavButton>
            </Link>
            <Typography sx={{ mx: 1 }}>|</Typography>
            <Link href="/login" passHref>
              <NavButton>Log In</NavButton>
            </Link>
            <Link href="/cart" passHref>
              <OrderButton variant="contained">Order Now</OrderButton>
            </Link>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ display: { xs: "flex", md: "none" } }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </StyledToolbar>
      </StyledAppBar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
