"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
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
  Menu,
  MenuItem,
  Typography,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { KITCHEN_ID, useAuthContext, useMenuContext } from "@/context";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  fontSize: "16px",
  fontWeight: "600",
});

const Navbar: React.FC = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count } = useMenuContext();
  const { isLoggedIn, kitchenMetaData, metaData } = useAuthContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("instructions");
    localStorage.removeItem("kulcha");
    localStorage.removeItem("includedItems2");
    router.push("/login");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Link href='/home' passHref>
        <Image
          src='/images/logo.png'
          alt='logo'
          height={150}
          layout='fixed'
          width={170}
          priority
        />
      </Link>
      <Divider />
      <List>
        {isLoggedIn && (
          <>
            <Link href='/profile' passHref>
              <ListItem button onClick={handleLinkClick}>
                <ListItemText primary='My Profile' />
              </ListItem>
            </Link>
            <Link href='/my-orders' passHref>
              <ListItem button onClick={handleLinkClick}>
                <ListItemText primary='My Orders' />
              </ListItem>
            </Link>
          </>
        )}
        <Link href='/home' passHref>
          <ListItem button onClick={handleLinkClick}>
            <ListItemText primary='Menu' />
          </ListItem>
        </Link>
      </List>
      <Divider />
      <List>
        {!isLoggedIn ? (
          <>
            <ListItem button>
              <Button
                onClick={(e) => {
                  handleLinkClick();
                  router.push("/login");
                }}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#ECAB21",
                  color: "white",
                  paddingX: 4,
                  width: "100%",
                  paddingY: 1,
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#FFC107",
                    color: "white",
                  },
                }}>
                Log In
              </Button>
            </ListItem>
          </>
        ) : (
          <>
            {metaData?.role === "kitchen" &&
              metaData?.foodTruckId === KITCHEN_ID &&
              metaData?.isKitchen && (
                <ListItem button>
                  <Button
                    onClick={(e) => {
                      handleLinkClick();
                      router.push("/login");
                    }}
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#ECAB21",
                      color: "white",
                      paddingX: 4,
                      width: "100%",
                      paddingY: 1,
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "#FFC107",
                        color: "white",
                      },
                    }}>
                    Switch to kitchen
                  </Button>
                </ListItem>
              )}
            <ListItem button>
              <Button
                sx={{
                  textTransform: "none",
                  backgroundColor: "#ECAB21",
                  color: "white",
                  paddingX: 4,
                  width: "100%",
                  paddingY: 1,
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#FFC107",
                    color: "white",
                  },
                }}
                onClick={() => {
                  handleLinkClick();
                  handleLogout();
                }}>
                Logout
              </Button>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar position='static'>
        <StyledToolbar>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link href='/home' passHref>
              <Image
                src='/images/logo.png'
                alt='logo'
                height={150}
                layout='fixed'
                width={170}
                priority
              />
            </Link>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "left",
            }}>
            <Link href='/home' passHref>
              <NavButton>Menu</NavButton>
            </Link>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {kitchenMetaData &&
              (kitchenMetaData.isShopOpen ? (
                <>
                  <Chip
                    label='Online'
                    color='success'
                    variant='outlined'
                    sx={{ mr: 1 }}
                  />
                </>
              ) : (
                <>
                  <Chip
                    label='Offline'
                    color='warning'
                    variant='outlined'
                    sx={{ mr: 1 }}
                  />
                </>
              ))}
            {isLoggedIn && (
              <Link href='/checkout' passHref>
                <IconButton
                  edge='end'
                  color='inherit'
                  aria-label='cart'
                  sx={{ mr: 2 }}>
                  <Badge
                    badgeContent={count > 0 ? count : undefined}
                    color='error'
                    invisible={count === 0}>
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Link>
            )}
            <IconButton
              edge='start'
              color='inherit'
              aria-label='menu'
              sx={{ display: { xs: "flex", md: "none" } }}
              onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            {/* Desktop Links */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
              }}>
              {!isLoggedIn ? (
                <Link href='/login' passHref>
                  <NavButton>Log In</NavButton>
                </Link>
              ) : (
                <>
                  <IconButton onClick={handleMenuOpen} sx={{ color: "black" }}>
                    <AccountCircleIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      style: {
                        marginTop: "5px",
                        marginRight: "10px",
                      },
                    }}>
                    <MenuItem onClick={handleMenuClose}>
                      <Link href='/profile' passHref>
                        <Typography>My Profile</Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                      <Link href='/my-orders' passHref>
                        <Typography>My Orders</Typography>
                      </Link>
                    </MenuItem>
                    {(metaData?.role === "kitchen" &&
                      metaData?.foodTruckId === KITCHEN_ID &&
                      metaData?.isKitchen) ||
                      (true && (
                        <MenuItem onClick={() => router.push("/dashboard")}>
                          Switch to kitchen
                        </MenuItem>
                      ))}
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        handleLogout();
                      }}>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
              {!isLoggedIn && (
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  <Link href='/login' passHref>
                    <Button
                      variant='contained'
                      sx={{
                        backgroundColor: "#f39c12",
                        color: "white",
                        "&:hover": { backgroundColor: "#e67e22" },
                      }}>
                      Order Now
                    </Button>
                  </Link>
                </Box>
              )}
            </Box>
          </Box>
        </StyledToolbar>
      </StyledAppBar>
      <Drawer
        anchor='right'
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}>
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
