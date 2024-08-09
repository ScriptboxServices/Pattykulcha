"use client";

import React, { useState } from 'react';
import Link from 'next/link';
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
  styled
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const StyledAppBar = styled(AppBar)({
  backgroundColor: 'white',
});

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  color: "black",
});

const NavButton = styled(Button)({
  color: 'black',
  textTransform: 'none',
  margin: '0 8px',
});

const LocationButton = styled(Button)({
  backgroundColor: 'white',
  color: 'black',
  borderRadius: '20px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
});

const OrderButton = styled(Button)({
  backgroundColor: '#f39c12',
  color: 'white',
  '&:hover': {
    backgroundColor: '#e67e22',
  },
});

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

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
        {['Menu', 'Rewards', 'Catering', 'Careers', 'About'].map((text) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button>
          <Link href="/createaccount" passHref>
            <Button sx={{ textTransform: 'none', color: 'black', width: '100%' }}>
              Sign Up
            </Button>
          </Link>
        </ListItem>
        <ListItem button>
          <Link href="/login" passHref>
            <Button sx={{ textTransform: 'none', color: 'black', width: '100%' }}>
              Log In
            </Button>
          </Link>
        </ListItem>
        <ListItem button>
          <LocationButton startIcon={<LocationOnIcon />}>
            Find A Location
          </LocationButton>
        </ListItem>
        <ListItem button>
          <OrderButton fullWidth>Order Now</OrderButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="static">
        <StyledToolbar>
          <Typography variant="h6" component="div">
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <NavButton>Menu</NavButton>
            <NavButton>Rewards</NavButton>
            <NavButton>Catering</NavButton>
            <NavButton>Careers</NavButton>
            <NavButton>About</NavButton>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <Link href="/createaccount" passHref>
              <NavButton>Sign Up</NavButton>
            </Link>
            <Typography sx={{ mx: 1 }}>|</Typography>
            <Link href="/login" passHref>
              <NavButton>Log In</NavButton>
            </Link>
            <LocationButton startIcon={<LocationOnIcon />} sx={{ mx: 1 }}>
              Find A Location
            </LocationButton>
            <OrderButton variant="contained">Order Now</OrderButton>
          </Box>
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="menu" 
            sx={{ display: { xs: 'flex', md: 'none' } }} 
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
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
