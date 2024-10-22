"use client";

import { useAuthContext } from "@/context";
import {
  Box,
  Typography,
  Link,
  Button,
  Chip,
  Divider,
  Grid,
} from "@mui/material";
import React, { useState } from "react";
import Image from "next/image";

const KitchenLocations = () => {
  const [selectedOption, setSelectedOption] = useState("delivery");

  const handleButtonClick = (option: React.SetStateAction<string>) => {
    setSelectedOption(option);
  };

  const { metaData } = useAuthContext();

  const renderCard = () => (
    <Box
      sx={{
        background: "#FFFFFF",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        p: 3,
        mb: 4,
      }}
    >
      {/* Status Badge */}
      <Chip
        label="Online"
        sx={{
          backgroundColor: "#28A745",
          color: "#FFFFFF",
          fontWeight: "bold",
          borderRadius: "4px",
          mb: 1,
        }}
      />

      {/* Address */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#0D0D0D",
          mb: 1,
        }}
      >
        1214 54th Street, Yellowknife, Northwest Territories, Ca
      </Typography>

      {/* Timings and Distance */}
      <Typography
        variant="body1"
        sx={{
          color: "grey",
          mb: 1,
          fontWeight:'bold'
        }}
      >
        Timings: 9:00 AM - 11:00 PM
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "grey",
          mb: 2,
          fontWeight:'bold'
        }}
      >
        Distance: 1.2 km
      </Typography>

      <Divider sx={{ my: 3 }} />
      {/* Delivery Options Icons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          mb: 2,
          width: "100%",
        }}
      >
        <Box sx={{ textAlign: "center", display: "flex", gap: 0.7 }}>
          <Image
            src="/images/kitchen-locations/image1.png"
            alt="Delivery"
            width="24"
            height="24"
          />
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Delivery
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center", display: "flex", gap: 0.7 }}>
          <Image
            src="/images/kitchen-locations/image2.png"
            alt="Pickup"
            width="24"
            height="24"
          />
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Pickup
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", display: "flex", gap: 0.7 }}>
          <Image
            src="/images/kitchen-locations/image3.png"
            alt="Dine-in"
            width="24"
            height="24"
          />
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Dine-in
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%", 
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#ECAB21",
            color: "#FFFFFF",
            fontWeight: "bold",
            borderRadius: "25px",
            width: { xs: "50%", md: "100%" },
            padding: "10px",
            justifyContent: "center",
            "&:hover": {
              backgroundColor: "#FFC107",
            },
          }}
        >
          Order Now
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        background: "#FAF3E0",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 4,
        paddingBottom: "1rem",
        px: 2,
      }}
    >
      {/* Content Container */}
      <Box
        sx={{
          width: { xs: "100%", sm: "80%", md: "60%", textAlign: "left" },
          maxWidth: "600px",
          alignSelf: { xs: "center", xl: "flex-start" },
          ml: { xs: 0, xl: 26 },
          mt: { xs: 2, sm: 4 },
        }}
      >
        {/* Heading */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#162548",
            mb: 2,
          }}
        >
          Find A Kitchen
        </Typography>

        <Typography
          sx={{
            fontWeight: "bold",
            color: "grey",
            mb: 1,
            fontSize:'18px'
          }}
        >
          Primary Address:{" "}
          <Typography component="span" sx={{ color: "#333333",fontWeight:'bold',fontSize:'18px' }}>
            {metaData?.address?.raw}
          </Typography>
        </Typography>

        <Link
          href="#"
          underline="hover"
          sx={{
            color: "#162548",
            textDecoration: "underline",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          Use my current location
        </Link>
      </Box>

      {/* Delivery Options */}
      <Box
        sx={{
          width: { xs: "100%", sm: "50%" },
          mt: 4,
          ml: { xs: 0, xl: 26 },
          alignSelf: { xs: "center", xl: "flex-start" },
        }}
      >
        <Grid container spacing={2} justifyContent="flex-start">
          <Grid item xs={4} sm={4} md={3}>
            <Button
              onClick={() => handleButtonClick("pickup")}
              sx={{
                borderRadius: "30px",
                border: "2px solid #FFC107",
                padding: "8px 24px",
                color: selectedOption === "pickup" ? "#FFF" : "#555",
                fontWeight: "bold",
                backgroundColor:
                  selectedOption === "pickup" ? "#ECAB21" : "transparent",
                width: "100%", // Full width within its grid cell
                "&:hover": {
                  backgroundColor:
                    selectedOption === "pickup" ? "#FFC107" : "transparent",
                },
              }}
            >
              Pickup
            </Button>
          </Grid>
          <Grid item xs={4} sm={4} md={3}>
            <Button
              onClick={() => handleButtonClick("delivery")}
              sx={{
                borderRadius: "30px",
                border: "2px solid #FFC107",
                padding: "8px 24px",
                color: selectedOption === "delivery" ? "#000" : "#555",
                fontWeight: "bold",
                backgroundColor:
                  selectedOption === "delivery" ? "#ECAB21" : "transparent",
                width: "100%", // Full width within its grid cell
                "&:hover": {
                  backgroundColor: "#FFF",
                },
              }}
            >
              Delivery
            </Button>
          </Grid>

          <Grid item xs={4} sm={4} md={3}>
            <Button
              onClick={() => handleButtonClick("dine-in")}
              sx={{
                borderRadius: "30px",
                border: "2px solid #FFC107",
                padding: "8px 24px",
                color: selectedOption === "dine-in" ? "#000" : "#555",
                fontWeight: "bold",
                backgroundColor:
                  selectedOption === "dine-in" ? "#ECAB21" : "transparent",
                width: "100%", // Full width within its grid cell
                "&:hover": {
                  backgroundColor: "#FFF",
                },
              }}
            >
              Dine-in
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          width: { xs: "100%", sm: "80%", md: "90%", xl: "70%" },
          mt: 4,
        }}
      >
        <Grid container spacing={4}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              {renderCard()}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default KitchenLocations;
