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
      {/* Status Badge and Information Row */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Online Status */}
        <Box
          sx={{
            backgroundColor: "#28A745",
            color: "#FFFFFF",
            fontWeight: "bold",
            borderRadius: "5px", // Pill shape
            padding: "5px 15px", // Padding for pill effect
            display: "inline-block", // Ensure it’s inline
            fontSize: "14px", // Adjust font size
          }}
        >
          Online
        </Box>

        {/* Distance (Icon + Text) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Image
            src="/images/kitchen-locations/image4.png" // Replace with correct path
            alt="Distance"
            width="24"
            height="24"
          />
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: "#162548" }}
          >
            1.2 km
          </Typography>
        </Box>

        {/* Time (Icon + Text with Blue Block) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box sx={{ position: "relative" }}>
            <Image
              src="/images/kitchen-locations/image5.png" // Replace with correct path
              alt="Time"
              width="24"
              height="24"
            />
          </Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: "#162548" }}
          >
            1 Hour
          </Typography>
        </Box>
      </Box>

      {/* Address */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#0D0D0D",
          mb: 1,
          mt: 3,
          textAlign: "left", // Center the address
        }}
      >
        1214 54th Street, Yellowknife, Northwest Territories, Ca
      </Typography>

      {/* Timings */}
      <Typography
        variant="body1"
        sx={{
          color: "#4a4a4a", // Grey color to match the image
          fontWeight: "bold",
          textAlign: "left",
          display: "flex", // Flex to align elements properly
          alignItems: "flex-start", // Align vertically
          gap: "0.5rem", // Add spacing between elements
          flexDirection: "column",
          fontSize: "1.2em",
          mt:1
        }}
      >
        {/* Timings Label */}
        Timings:
        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <Typography
            component="span"
            sx={{
              fontWeight: "bold",
              color: "#0D0D0D", // Slightly darker color for the time range
              fontSize: "18px", // Adjust font size to match
            }}
          >
            9:00 AM - 11:00 PM
          </Typography>
          <Typography
            component="span"
            sx={{
              color: "grey", // Grey color for (Mon - Sun)
              fontSize: "14px", // Smaller font for (Mon - Sun)
              fontWeight: "normal", // Normal weight for (Mon - Sun)
              mt: 0.3,
            }}
          >
            (Mon - Sun)
          </Typography>
        </Box>
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Delivery Options Icons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around", // Adjust spacing to evenly spread icons
          mb: 2,
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            gap: 0.7,
            position: "relative",
          }}
        >
          <Image
            src="/images/kitchen-locations/image1.png"
            alt="Delivery"
            width="24"
            height="28"
          />
          <Image
            src="/images/kitchen-locations/image.png"
            alt="Dine-in"
            width="7"
            height="18"
            style={{
              position: "absolute",
              left: 16,
              top: 20,
              transform: "rotate(-15deg)", // Rotating the image 45 degrees towards the top-left
              transformOrigin: "top left", // The origin of the rotation is set to the top-left corner
            }}
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
            height="28"
          />
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Pickup
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", display: "flex", gap: 0.7 }}>
          <Image
            src="/images/kitchen-locations/image3.png"
            alt="Dine-in"
            width="32"
            height="28"
          />

          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Dine-in
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Order Now Button */}
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
            width: "60%",
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
          Our Locations
        </Typography>

        <Typography
          sx={{
            fontWeight: "bold",
            color: "grey",
            mb: 1,
            fontSize: "18px",
          }}
        >
          Primary Address:{" "}
          <Typography
            component="span"
            sx={{ color: "#333333", fontWeight: "bold", fontSize: "18px" }}
          >
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
                    selectedOption === "pickup" ? "#FFC107" : "#ECAB21",
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
                  backgroundColor: "#ECAB21",
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
                  backgroundColor: "#ECAB21",
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
