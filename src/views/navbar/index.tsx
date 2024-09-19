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
  const { isLoggedIn, kitchenMetaData, metaData, driverMetaData } =
    useAuthContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  console.log(metaData, kitchenMetaData, driverMetaData);

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
      <Link href="/home" passHref>
        <Image
          src="/images/logo.png"
          alt="logo"
          height={150}
          layout="fixed"
          width={170}
          priority
        />
      </Link>
      <Divider />
      <List>
        {isLoggedIn && (
          <>
            <Link href="/profile" passHref>
              <ListItem
                button
                onClick={handleLinkClick}
                sx={{
                  "&:hover": {
                    backgroundColor: "black",
                    color: "white",
                  },
                }}
              >
                <ListItemText primary="My Profile" />
              </ListItem>
            </Link>
            <Link href="/my-orders" passHref>
              <ListItem
                button
                onClick={handleLinkClick}
                sx={{
                  "&:hover": {
                    backgroundColor: "black",
                    color: "white",
                  },
                }}
              >
                <ListItemText primary="My Orders" />
              </ListItem>
            </Link>
          </>
        )}
        <Link href="/home" passHref>
          <ListItem
            button
            onClick={handleLinkClick}
            sx={{
              "&:hover": {
                backgroundColor: "black",
                color: "white",
              },
            }}
          >
            <ListItemText primary="Menu" />
          </ListItem>
        </Link>
        <Link href="/contact-us" passHref>
          <ListItem
            button
            onClick={handleLinkClick}
            sx={{
              "&:hover": {
                backgroundColor: "black",
                color: "white",
              },
            }}
          >
            <ListItemText primary="Contact Us" />
          </ListItem>
        </Link>
        {
              isLoggedIn &&       
                <Link href="/add-driver" passHref>
                  <ListItem
                    button
                    onClick={handleLinkClick}
                    sx={{
                      "&:hover": {
                        backgroundColor: "black",
                        color: "white",
                      },
                    }}
                  >
                    <ListItemText primary="Career" />
                  </ListItem>
                </Link>
              }
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
                }}
              >
                Log In
              </Button>
            </ListItem>
          </>
        ) : (
          <>
            {metaData?.role === "kitchen" &&
              metaData?.foodTruckId === kitchenMetaData?.id &&
              metaData?.isKitchen && (
                <ListItem button>
                  <Button
                    onClick={(e) => {
                      handleLinkClick();
                      router.push("/dashboard");
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
                    }}
                  >
                    Switch to kitchen
                  </Button>
                </ListItem>
              )}
            {metaData?.role === "driver" &&
              metaData?.driverId === driverMetaData?.id &&
              metaData?.isDriver && (
                <ListItem button>
                  <Button
                    onClick={(e) => {
                      handleLinkClick();
                      router.push("/driver-home");
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
                    }}
                  >
                    Switch to Driver
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
                }}
              >
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
      <StyledAppBar position="static">
        <StyledToolbar>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link href="/home" passHref>
              <Image
                src="/images/logo.png"
                alt="logo"
                height={150}
                layout="fixed"
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
            }}
          >
            <Link href="/home" passHref>
              <NavButton>Menu</NavButton>
            </Link>
            <Link href='/contact-us' passHref>
              <NavButton>Contact us</NavButton>
            </Link>
            {
              isLoggedIn &&
              <Link href='/add-driver' passHref>
                <NavButton>Career</NavButton>
              </Link>
            }
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {kitchenMetaData &&
              isLoggedIn &&
              (kitchenMetaData.isShopOpen ? (
                <>
                  <Chip
                    label="Online"
                    variant="outlined"
                    sx={{
                      mr: 1,
                      backgroundColor: "#4CAF50",
                      color: "white",
                      fontWeight: "600",
                    }}
                  />
                </>
              ) : (
                <>
                  <Chip
                    label="Offline"
                    color="warning"
                    variant="outlined"
                    sx={{
                      mr: 1,
                      backgroundColor: "red",
                      color: "white",
                      fontWeight: "600",
                    }}
                  />
                </>
              ))}
            {isLoggedIn && (
              <Link href="/checkout" passHref>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="cart"
                  sx={{ mr: 2 }}
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
            )}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ display: { xs: "flex", md: "none" } }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            {/* Desktop Links */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
              }}
            >
              {!isLoggedIn ? (
                <Link href="/login" passHref>
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
                    }}
                  >
                    <MenuItem
                      onClick={handleMenuClose}
                      sx={{
                        "&:hover": {
                          backgroundColor: "black",
                          color: "white",
                        },
                      }}
                    >
                      <Link href="/profile" passHref>
                        <Typography>My Profile</Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem
                      onClick={handleMenuClose}
                      sx={{
                        "&:hover": {
                          backgroundColor: "black",
                          color: "white",
                        },
                      }}
                    >
                      <Link href="/my-orders" passHref>
                        <Typography>My Orders</Typography>
                      </Link>
                    </MenuItem>
                    {metaData?.role === "kitchen" &&
                      metaData?.foodTruckId === kitchenMetaData?.id &&
                      metaData?.isKitchen && (
                        <MenuItem onClick={() => router.push("/dashboard")}>
                          Switch to Kitchen
                        </MenuItem>
                      )}
                    {metaData?.role === "driver" &&
                      metaData?.driverId === driverMetaData?.id &&
                      metaData?.isDriver && (
                        <MenuItem onClick={() => router.push("/driver-home")}>
                          Switch to Driver
                        </MenuItem>
                      )}
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        handleLogout();
                      }}
                      sx={{
                        "&:hover": {
                          backgroundColor: "black",
                          color: "white",
                        },
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
              {!isLoggedIn && (
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  <Link href="/login" passHref>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#f39c12",
                        color: "white",
                        "&:hover": { backgroundColor: "#e67e22" },
                      }}
                    >
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
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
