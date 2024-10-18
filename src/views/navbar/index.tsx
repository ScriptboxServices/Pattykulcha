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
  DialogContent,
  Dialog,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { KITCHEN_ID, useAuthContext, useMenuContext } from "@/context";
import { auth, db } from "@/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import WorkIcon from '@mui/icons-material/Work';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import KitchenIcon from '@mui/icons-material/Kitchen';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';

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

  const handleLogout = async () => {
    try {
      if (metaData.role === "driver") {
        await updateDoc(doc(db, "driverlocation", driverMetaData?.id), {
          isOnline: false,
        });
      }
      await auth.signOut();
      localStorage.removeItem("instructions");
      localStorage.removeItem("kulcha");
      localStorage.removeItem("includedItems2");
      localStorage.removeItem("otherKulchas");
      router.push("/login");
    } catch (err) {
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

  const [locError, setLocError] = useState(false);

  const switchToDriverPortal = async () => {
    handleLinkClick();
    if (navigator.geolocation && driverMetaData) {
      const result = await navigator.permissions.query({ name: "geolocation" });
      if (result.state === "granted") {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const docRef = doc(db, "driverlocation", driverMetaData?.id);
            await setDoc(docRef, {
              driverId: driverMetaData.id,
              isOnline: false,
              name: driverMetaData.name,
              latlng: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            });
            router.push("/driver-home");
          },
          (err) => {
            console.log(err);
            setLocError(true);
          },
          {
            enableHighAccuracy: true,
            timeout: Infinity,
            maximumAge: 0,
          }
        );
      }

      if (result.state === "prompt") {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const docRef = doc(db, "driverlocation", driverMetaData?.id);
            await setDoc(docRef, {
              driverId: driverMetaData.id,
              isOnline: false,
              name: driverMetaData.name,
              latlng: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            });
            router.push("/driver-home");
          },
          (err) => {
            console.log(err);
            setLocError(true);
          },
          {
            enableHighAccuracy: false,
            timeout: Infinity,
            maximumAge: 0,
          }
        );
      }

      if (result.state === "denied") {
        setLocError(true);
      }
    }
  };

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: 250,
        textAlign: "center",
        paddingTop: "0rem",
      }}
    >
      <List>
      <ListItem>
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
        </ListItem>
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
                <PersonIcon sx={{ marginRight: 1 }} />
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
                 <ShoppingCartIcon sx={{ marginRight: 1 }} />
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
             <HomeIcon sx={{ marginRight: 1 }} />
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
            <ContactMailIcon sx={{ marginRight: 1 }} />
            <ListItemText primary="Contact Us" />
          </ListItem>
        </Link>
        {isLoggedIn && (
          <Link href="/careers" passHref>
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
              <WorkIcon sx={{ marginRight: 1 }} />
              <ListItemText primary="Career" />
            </ListItem>
          </Link>
        )}
      </List>
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
                <LoginIcon sx={{ marginRight: 1 }} />
                Log In
              </Button>
            </ListItem>
          </>
        ) : (
          <>
            <Box sx={{ padding: "1rem" }}>
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
                        paddingX: 2,
                        width: "100%",
                        paddingY: 1,
                        fontWeight: "bold",
                        "&:hover": {
                          backgroundColor: "#FFC107",
                          color: "white",
                        },
                      }}
                    >
                      <KitchenIcon sx={{ marginRight: 1 }} />
                      Switch to kitchen
                    </Button>
                  </ListItem>
                )}
              {metaData?.role === "driver" &&
                metaData?.driverId === driverMetaData?.id &&
                metaData?.isDriver && (
                  <ListItem button>
                    <Button
                      onClick={switchToDriverPortal}
                      sx={{
                        textTransform: "none",
                        backgroundColor: "#ECAB21",
                        color: "white",
                        paddingX: 2,
                        width: "100%",
                        paddingY: 1,
                        fontWeight: "bold",
                        "&:hover": {
                          backgroundColor: "#FFC107",
                          color: "white",
                        },
                      }}
                    >
                      <DeliveryDiningIcon sx={{ marginRight: 1 }} />
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
                    paddingX: 2,
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
                  <LogoutIcon sx={{ marginRight: 1 }} />
                  Logout
                </Button>
              </ListItem>
            </Box>
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
            <Link href="/contact-us" passHref>
              <NavButton>Contact us</NavButton>
            </Link>
            {isLoggedIn && (
              <Link href="/careers" passHref>
                <NavButton>Career</NavButton>
              </Link>
            )}
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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column", // Stack Chip and Typography vertically
                    alignItems: "center", // Center align horizontally
                    justifyContent: "center", // Center align vertically
                  }}
                >
                  <Chip
                    label="Offline"
                    color="warning"
                    variant="outlined"
                    sx={{
                      backgroundColor: "red",
                      color: "white",
                      fontWeight: "600",
                      // mb: 0.5, // Add margin below the Chip to separate it from the text
                    }}
                  />
                  {/* <Typography
                    sx={{
                      color: "#4CAF50",
                      border: "none",
                      fontWeight: "600",
                      fontSize: "10px",
                    }}
                  >
                    Open at 8 AM
                  </Typography> */}
                </Box>
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
      <Dialog
        open={locError}
        onClose={() => setLocError(false)}
        maxWidth="xs"
        fullWidth
        sx={{ zIndex: "999" }}
        PaperProps={{
          sx: { borderRadius: "10px" },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
            }}
          >
            <WarningIcon sx={{ fontSize: "46px" }} />
            <Typography
              variant="body1"
              color="textPrimary"
              align="center"
              sx={{ fontSize: "18px", mt: 2 }}
            >
              PLEASE ALLOW YOUR LOCATION.
              <ol>
                <li>Go to your browser settings.</li>
                <li>
                  Find the &rdquo;Privacy&rdquo; or &rdquo;Location&rdquo;
                  settings.
                </li>
                <li>Allow location access for this site.</li>
              </ol>
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
