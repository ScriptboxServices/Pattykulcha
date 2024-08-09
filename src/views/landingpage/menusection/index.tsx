"use client";

import React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";

const menuItems = [
  {
    name: "Baked 4-Cheese Chicken Alfredo",
    image: "/images/landingpage/menu1.png",
  },
  {
    name: "Baked 4-Cheese Chicken Alfredo",
    image: "/images/landingpage/menu2.png",
  },
  {
    name: "Baked 4-Cheese Chicken Alfredo",
    image: "/images/landingpage/menu3.png",
  },
  {
    name: "Baked 4-Cheese Chicken Alfredo",
    image: "/images/landingpage/menu4.png",
  },
  {
    name: "Baked 4-Cheese Chicken Alfredo",
    image: "/images/landingpage/menu5.png",
  },
  {
    name: "Baked 4-Cheese Chicken Alfredo",
    image: "/images/landingpage/menu6.png",
  },
];

const MenuSection = () => {
  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#FFF8E1",
        position: "relative",
        paddingTop: 12,
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          marginBottom: 4,
          position: "absolute",
          top: "3%",
          left: "27%",
          transform: "translateX(-50%)",
        }}
      >
        <img
          src="/images/landingpage/image4.png"
          alt="Photo1"
          style={{ maxWidth: "100%", height: "140px" }}
        />
      </Box>

      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          marginBottom: 4,
          position: "absolute",
          bottom: "10%",
          left: "7%",
          transform: "translateX(-50%)",
        }}
      >
        <img
          src="/images/landingpage/image4.png"
          alt="Photo2"
          style={{ maxWidth: "100%", height: "140px" }}
        />
      </Box>

      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          marginBottom: 4,
          position: "absolute",
          top: "43%",
          left: "83%",
          zIndex: 1,
        }}
      >
        <img
          src="/images/landingpage/image6.png"
          alt="Photo3"
          style={{ maxWidth: "100%", height: "140px" }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Box sx={{ flexGrow: 1, textAlign: "center" }}>
          <Typography variant="h4" component="h2">
            OUR MENU
          </Typography>
        </Box>
        <Box>
          <Button variant="text" sx={{ color: "black" }}>
            View Full Menu
          </Button>
        </Box>
      </Box>

      <Container sx={{ marginTop: 5 }}>
        <Grid container spacing={7}>
          {menuItems.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{ paddingLeft: 2, paddingRight: 2 }}
            >
              <Card sx={{ maxWidth: 345, height: "100%", margin: "0 auto" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image}
                  alt={item.name}
                />
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{ textAlign: "center", fontWeight: 600 }}
                  >
                    {item.name}
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{
                      mt: 1,
                      color: "black",
                      borderColor: "black",
                      borderRadius: 10,
                      border: 2,
                      "&:hover": {
                        backgroundColor: "#ECAB21",
                        color: "white",
                        borderColor: "#ECAB21",
                      },
                    }}
                  >
                    Order Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          mt: 7,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            padding: { xs: 1, sm: 2 },
            borderRadius: 50,
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            width: { xs: "95%", sm: "80%" },
            maxWidth: "600px",
            marginBottom: 4,
            flexWrap: "nowrap",
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
          >
            <img
              src="/images/landingpage/image1.png"
              alt="Spicy"
              style={{ maxWidth: "82%", height: "17%", paddingRight: "4px" }}
            />
            <Typography
              className="css-1i9wwnn-MuiTypography-root"
              variant="body1"
              component="p"
              sx={{ fontWeight: 600 }}
            >
              Spicy
            </Typography>
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
          >
            <img
              src="/images/landingpage/image2.png"
              alt="Gluten Sensitive"
              style={{ maxWidth: "82%", height: "27%", paddingRight: "4px" }}
            />
            <Typography
              className="css-1i9wwnn-MuiTypography-root"
              variant="body1"
              component="p"
              sx={{ fontWeight: 600 }}
            >
              Gluten Sensitive
            </Typography>
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
          >
            <img
              src="/images/landingpage/image3.png"
              alt="Vegetarian"
              style={{ maxWidth: "82%", height: "27%", paddingRight: "4px" }}
            />
            <Typography
              className="css-1i9wwnn-MuiTypography-root"
              variant="body1"
              component="p"
              sx={{ fontWeight: 600 }}
            >
              Vegetarian
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 7 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#ECAB21",
            borderRadius: 10,
            color: "black",
            fontSize: 16,
            fontWeight: 600,
            paddingX: 5,
            paddingY: 2,
            "&:hover": {
              backgroundColor: "#FFC107",
            },
          }}
        >
          View Full Menu
        </Button>
      </Box>
    </Box>
  );
};

export default MenuSection;
